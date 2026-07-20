---
title: 編譯期計算:constexpr 到 LUT
track: modern
reviewed: 2026-07-03
review_interval: 21
---

# 編譯期計算:constexpr 到 LUT

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## constexpr / consteval / constinit

- **`#define` 無 type 無 scope、`const` 只保證「不可修改」、`constexpr` 才保證編譯期求值**:`const int x = rand();` 完全合法;只有 `constexpr` 能用在 `if constexpr`、template non-type parameter、`static_assert`。codegen 差異(-O0 對比):**`const` 的值存在記憶體、用時要 load;`constexpr` 直接嵌進指令,零記憶體存取**。歷史例外:**整數/枚舉型別的 `const` 若以常數運算式初始化,仍可當編譯期常數**(如 array bound),但 `const double` 沒有這待遇——浮點常數一律寫 `constexpr`。唯一仍需 `#define` 的場景是 **`#if` 條件編譯**(constexpr 做不到)。
- **`constexpr` 函式是雙態的,且「可以」而非「必須」在編譯期執行**:參數皆編譯期已知 → 整段函式體消失、結果變常數(sorting network `TwoMedians(3,1,4,2)` 直接寫死 `{2,3}`,五組比較全消失);參數含 runtime 值 → 退化為普通函式,零額外成本——同一份 source 產生完全不同機器碼。適用條件:純計算、**no heap allocation、no I/O**。強制編譯期求值只發生在要求 constant expression 的語境(初始化 constexpr 變數、array bound、NTTP);要無條件強制用 **C++20 `consteval`**(immediate function,無法在編譯期求值即編譯錯誤)。
- **`constinit`(C++20)只保證 static initialization(消滅 SIOF),變數本身不是 const、之後仍可改**:三者一句話——constexpr = 編譯期**值**、consteval = 編譯期**函式**、constinit = 編譯期**初始化**;constinit 可與 `thread_local` 併用省掉每次存取的 runtime guard。

## if constexpr 與編譯期分派

- **普通 `if` 的兩個分支都必須能編譯,即使 runtime 永遠走不到**:對 `std::set` 元素寫 `elem.first` 直接 error;`if constexpr` 在 template instantiation 時**丟棄 false 分支(discarded statement),不做 instantiation 與 type check**——本質是 type 導向的編譯期剪枝(模板世界的 dead code elimination),不是 runtime 分支。
- **`if constexpr (requires { elem.first; })` = 編譯期語法測試 + 剪枝,一個 lambda 取代整套 C++11 SFINAE**(兩個 overload + `decltype` trailing return)。Interview trap:**剪枝只對依賴 template 參數的 discarded 分支生效;非 template 程式碼中兩個分支仍會被完整檢查**,且 discarded 分支不能對所有特化都 ill-formed(IFNDR)。

## static_assert:把 bug 擋在 build

- **三種 assert:`static_assert` 編譯期、零機器碼、零成本;`assert` 只在 debug(release 定義 `NDEBUG` 即被關掉);`throw`/`.at()` 每次 runtime 都付檢查成本**。static_assert 失敗 = build 不過 = 生產環境不可能出錯。
- **兩個高價值用法:守護 LUT 的 power-of-2 前提、用 concept 驗自寫 iterator**:`static_assert((N & (N-1)) == 0)` 保護後面的 bitmask 取餘(改成 4000 直接 build 爆;嚴格說 N=0 也會通過,實務可再加 `N > 0`);`static_assert(std::bidirectional_iterator<iterator>)` 讓漏寫 `operator--` 在編譯期報錯,而非 runtime 用到 `std::prev()` 才發現。

## 編譯期 LUT

- **Header-only LUT 標準式:C++17 `static inline` 變數 + IIFE lambda `[](){...}()`**:`inline` 變數允許多個 TU 各有定義、由 linker 合併成一份(否則 header 全域變數 = ODR violation);IIFE 把初始化邏輯收在宣告處,免傳統 `extern` 宣告/定義分離。Linkage 細節:合併行為來自 `inline`;class static data member 才需 `static inline` 連用,**namespace scope 單用 `inline` 即可——加 `static` 反成 internal linkage、各 TU 各留一份**。
- **`index & 4095` 取代 `index % 4096`:and **1 cycle** vs div **~20–30 cycles****。成立前提是 table size 為 **2 的冪**(所以要配 static_assert);且 index 應為 **unsigned**——signed `%` 對負數語意不同,編譯器折成 mask 還得補 sign-correction 指令。
- **Table sizing 對齊 L1d:4096 entries × 8 B(double)= 32 KB ≈ 常見 L1 data cache 容量**:全表駐 L1 → load 約 **4 cycles**;查表版 FastSin 約 **3 條指令**,`std::sin`(argument reduction + polynomial)約 **50–100 條**、慢 **10–20 倍**;表開太大(如 1M entries)反而 cache miss、可能比重算還慢。
- **C++20 真編譯期 LUT:lambda 標 `constexpr` + `static constexpr`,整張表進 `.rodata`、零 runtime initialization**:但 `std::sin` 在 C++23(含)前**不是 constexpr**(C++23 P0533 只納入 fabs/frexp 等;sin/cos 要到 **C++26 P1383**),所以得自寫 constexpr sin 或退回 `inline` runtime 初始化版(GCC 會把 `std::sin` 當 builtin 常數摺疊,屬非可攜擴充)。另注意**編譯期浮點運算結果可能與 runtime libm 有 ULP 級差異**(標準未規定精度、實作各異,cross-compile 時尤要留意)。

## 模板遞迴 vs constexpr、編譯期字串

- **C++17 後編譯期計算優先用 constexpr 函式 + 普通迴圈,不用模板遞迴**:模板遞迴每層 instantiate 一個新特化(compile 慢、記憶體與符號膨脹),constexpr 求值是編譯器內建直譯、無符號成本;求值深度/步數上限為實作定義(標準 Annex B 僅給建議下限)——GCC/Clang `-fconstexpr-depth` 預設 **512**,另有步數/迴圈上限(GCC `-fconstexpr-loop-limit`、`-fconstexpr-ops-limit`;Clang `-fconstexpr-steps`),生成大 LUT 可能撞限、需調 flag。
- **編譯期字串雜湊:constexpr FNV-1a 讓「switch on string」成立**——case label 需要整數常數運算式,把字串在編譯期折成 hash、runtime 只比整數;碰撞需自行處理;C++20 起可用 structural class(fixed_string)當 NTTP 把字串本身帶進 template。

## 什麼該搬到編譯期、什麼不該

- **該搬:常數與純計算能前移就前移;type/size/invariant 錯誤在 build 時擋掉;generic code 真的分型別走不同邏輯才用 `if constexpr`;LUT 三條件 = 高頻熱路徑 + 允許精度誤差 + 輸入範圍固定**。不該搬:依賴 runtime 輸入的值、會炸 compile time/binary size 的巨表、為「看起來很 compile-time」硬堆的 template trick——LUT 是空間換時間,cache footprint 是隱藏成本;重點不是語法炫,而是把不必留到 runtime 的工作提前做掉。
