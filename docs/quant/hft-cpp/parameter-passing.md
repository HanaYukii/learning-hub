---
title: 參數傳遞與 string 成本
track: hft-cpp
category: hft-cpp
reviewed: 2026-07-02
review_interval: 21
---

# 參數傳遞與 string 成本

> HFT C++ 面試 item-sheet，蒸餾自親身面試紀錄（部落格），面試前快速複習。

- **建構子接 string：`string_view` 在四種傳入（lvalue / rvalue / literal / `const char*`）下都恰好一次 string 建構，對 literal / `const char*` 最快**
  要點：`string_view` 只是 pointer + length（64-bit 下典型 16 bytes），本身建構近零成本、不擁有資料；lvalue 傳入時與 `const&` 打平（各 1 copy）。注意它不是全場最快：rvalue `std::string` 傳入時只能從 view copy（1 次 allocation + copy）、吃不到 move，這個情境輸給 sink pattern。**關鍵：「string_view 不擁有資料，caller 必須保證原字串 lifetime；`vector<char>`、單一 `char` 不能隱式轉，要手動 `string_view(v.data(), v.size())`；且 string_view 不保證 null-terminated」。**

- **Sink parameter（by-value + move）是單一 string 參數建構子最平衡的寫法**
  要點：prvalue 傳入（temp / 函式回傳值）因 C++17 強制 elision 直接在參數槽建構，只剩 1 move；xvalue（`std::move(s)`）= 2 moves（近零成本）；lvalue = 1 copy + 1 move（比 `const&` 多一個廉價 move）；程式碼最簡單、ownership 語意最清楚。**關鍵：`Widget(std::string n) : name{std::move(n)} {}` ——「caller 給 rvalue 我就 move，給 lvalue 我付一次本來就必要的 copy」。**

- **`const std::string&` 的隱藏成本：對 rvalue 只能 copy 吃不到 move，literal 還多建一個 temp**
  要點：`f("hello")` 會先隱式建構臨時 `std::string`（可能 heap alloc）再 copy 進成員——兩次建構、最多兩次 heap allocation；rvalue string 綁上 ref 後成員仍是 copy 建構。**關鍵：「const& 接 string literal 是 temp 建構 + copy 兩段成本——這是它輸給 string_view 與 sink pattern 的地方」。**

- **SSO：短字串直接存在 string 物件內部的 union，完全不碰 heap；容量是實作定義**
  要點：標準不強制 SSO（C++11 起因 iterator/reference 失效規則實質禁止 COW，各家改用 SSO）；閾值與大小皆實作定義，64-bit 典型值：GCC libstdc++ 15 chars / `sizeof` 32B、MSVC 15 chars / 32B、Clang libc++ 22 chars / 24B；`vector` 典型 24B（3 pointers）——用更大的物件換更少的 allocation。**關鍵：「union 同一塊記憶體兩種解讀：短字串 inline buffer vs capacity + heap pointer；驗證法：`s.data()` 落在 `&s` 起 `sizeof(string)` 範圍內就是 SSO」。**

- **SSO 下 copy 反而快：短字串 move 偷不到 heap buffer，成本 $\approx$ copy**
  要點：SSO 字串 move 一樣得搬 inline buffer（還要清 source），move 沒有優勢；copy 一個短 string 只是 $\le$ 32B 的 memcpy、零 allocation，所以 sink pattern 對短字串多付的那次 copy 很便宜。**關鍵：「對 SSO 字串 move 和 copy 幾乎同價；真正貴的是跨過閾值後的 heap allocation——多 1 byte 就掉下效能懸崖」。**

- **NRVO 的機制是 hidden pointer：callee 直接在 caller 的 return slot 上建構**
  要點：編譯器（依 ABI，如 x86-64 的 sret）把 return value 的目標位址當隱藏參數傳給函式，named local 從頭到尾只建構一次；沒有 copy、沒有 move、沒有臨時物件。**關鍵：「概念上變成 `void make_vec(std::vector<int>* __result)` ——物件直接建構在最終目的地」。**

- **`return std::move(v)` 反而更慢：破壞 NRVO，退化成 move construction**
  要點：`std::move` 把 expression 的 value category 變成 xvalue，NRVO 條件（回傳 named local 本身）不成立；而 `return v;` 即使 NRVO 失敗，C++11 起也自動 implicit move——所以 `std::move` 最好情況打平、通常更差。**關鍵：「`return std::move(local)` 幾乎永遠是錯的（Core Guidelines F.48）——直接 `return v;`，編譯器比你聰明」。**

- **C++17 起回傳 prvalue 保證零 copy 零 move；NRVO 仍是非強制（但主流編譯器都做）**
  要點：`return Obj{};`、`return {1, 2, 3};` 是 C++17 保證的「延遲實體化」——根本沒有 copy 可省；NRVO 非強制但 GCC/Clang 普遍做，MSVC 在 `/O2`、`/permissive-` 或 `/std:c++20` 起自動開 `/Zc:nrvo`。NRVO 失敗四情況：多 return 路徑用不同 local、回傳函式參數（禁止 elision，但仍 implicit move）、`return std::move(x)`（退化成 move）、`return flag ? a : b;`（兩邊皆 lvalue 時退化成 copy）。**關鍵：「區分：回傳 prvalue = C++17 強制省略；回傳 named local = NRVO，非強制」。**

- **Lambda：能不 capture 就不 capture；`static` + `[&]` / `[this]` 是 dangling UB**
  要點：`static` local lambda 只初始化一次，第一次呼叫時捕獲的 reference / `this` 被永久固定，之後換了物件或原物件亡故再呼叫就是 dangling；stateless lambda（資料改用參數傳）可轉成 function pointer、以 template / 直接呼叫時極易被 inline、零 lifetime 風險；capture `this` 版每次建構 closure 都要把 pointer 寫進 lambda 物件，讀成員多一次 indirection。**關鍵：`static constexpr auto fn = [](std::string_view s) { ... };` ——「最快且最安全；在 HFT 每次多餘的 function call 都可能是數 ns 到數十 ns（視 cache 而定）」。**

- **`std::function` 是型別抹除：間接呼叫擋 inline，大 callable 還會 heap alloc——hot path 禁用**
  要點：type erasure 需要類 virtual 的 indirect dispatch，編譯器通常無法跨抹除邊界 inline；captures 超過實作的 small-object buffer（大小實作相依，如 libstdc++ 約 16B）就觸發 heap allocation。**關鍵：「hot path 用 template / `auto` 參數直接收 callable（零抹除、可 inline）；`std::function` 只留給真的需要存異質 callback 的邊界層」。**
