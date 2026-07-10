---
title: 編譯器與標準庫的隱形優化:SSO / copy elision
track: lowlevel
reviewed: 2026-07-03
review_interval: 21
---

# 編譯器與標準庫的隱形優化:SSO / copy elision

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## SSO(Small String Optimization)

- **SSO:短字串直接內嵌在 string 物件內,不碰 heap**:實作用 union 切換 long 模式(ptr / size / capacity)與 short 模式(inline buffer);短字串的建構/解構完全不呼叫 allocator。
- **內嵌容量是實作定義,面試要能報數字(64-bit)**:libstdc++ **15 chars**(`sizeof(string)` = **32**)、libc++ **22 chars**(`sizeof` = **24**)、MSVC STL **15 chars**(`sizeof` = **32**)。libc++ 用更緊湊的佈局(size 與 long/short flag 擠進 1 byte)在較小的物件裡換到更大的 inline buffer。
- **驗證 SSO 的慣用法:比較 `s.data()` 與 `&s`**:若 `data()` 落在 `[&s, &s + sizeof(std::string))` 範圍內即 SSO;**空字串也是 SSO**(三大實作皆不配置 — 這是實作慣例,非標準保證)。
- **效能懸崖(performance cliff):跨過閾值多 1 char 就觸發 heap allocation**:GCC 下 **15 chars = SSO、16 chars = heap**,長度微變 → 效能不成比例地變差;JSON parsing、symbol table、config 這類短字串密集場景,設計 key 命名時可刻意壓在閾值內。
- **`std::vector` 沒有 Small Vector Optimization 是刻意取捨**:`sizeof(vector)` = **24**(pointer + size + capacity),string 多出的 **8 bytes** 正是 SSO buffer;string 的使用場景短值佔絕大多數(key、name、label),vector 的 element type 大小不定、buffer 難以定大小。需要 inline capacity 用 Boost / LLVM 的 **`small_vector`** 自行指定。

## Copy Elision 與 NRVO

- **機制是 hidden pointer(return slot)**:caller 把 return value 的目標位址當隱藏參數傳給 callee,callee 直接在該位址上建構 → 物件**只建構一次**,無 copy ctor、無 move ctor、無臨時物件。
- **C++17 起 return prvalue 是語言保證,不是優化**:`return Obj{};`(prvalue)與 `return {1, 2, 3};`(braced-init-list 直接初始化回傳物件)**保證零 copy 零 move**;甚至 copy/move ctor 可以不存在(non-copyable 且 non-movable 的型別也能這樣 return),`-fno-elide-constructors` 也關不掉(該旗標只影響 NRVO 這類非強制 elision)。
- **NRVO(return named local variable)允許但非強制**:主流編譯器幾乎都做(GCC/Clang 連 `-O0` 都做;MSVC 傳統上需開啟優化)。copy elision 是少數**允許改變 observable behavior** 的優化 — 即使 copy ctor 有 side effects 也能整個省掉。
- **NRVO miss 的四種典型**:1) 多個 return 路徑回傳**不同** local(編譯器不知道該把哪個建在 return slot);2) 回傳**函數參數**(生命週期由 caller 管理,無法與 slot 重疊);3) `return std::move(x)`;4) `return flag ? a : b;`(與多路徑同理)。miss 時退化成**一次 move(或 copy)construction**。
- **`return std::move(v)` 是 anti-pattern:反而更慢**:`std::move` 把表達式從 named lvalue 變成 rvalue,NRVO 條件不成立 → 從**零成本**退化成**強制一次 move construction**。且 `return v;` 在 NRVO miss 時本來就會 **implicit move**(local 變數與函數參數自 **C++11** 起即適用;**C++20** P1825 再擴及 rvalue reference 變數等情形),所以 `std::move` 至多冗餘、通常有害;Clang/GCC 的 `-Wpessimizing-move` 會抓。
- **RVO-friendly 寫法**:單一 named 回傳變數、所有 return 路徑回傳**同一個**、能 return prvalue 就直接 return(`return Obj{};` / `return {a, b, c};`);不要先建構多個候選再挑一個回傳,也不要「幫」編譯器 move。

## Move 不是免費的

- **SSO string 的 move ≈ copy**:短字串模式下沒有 heap pointer 可偷,move ctor 仍要**整塊複製 inline buffer** 並重置來源;只有 heap 模式的 move 才是 **O(1)** 指標交接。「move 一定便宜」對 `std::string` 不成立。
- **elision 永遠不輸 move:零次 vs 一次**:NRVO / 強制 elision 是**零次**特殊成員函數呼叫,move 是**一次**(vector 是搬三個指標,SSO string 是 buffer copy)。核心觀念:**不要和編譯器搶工作** — 最好的優化是直接 `return x;`,讓編譯器決定。
