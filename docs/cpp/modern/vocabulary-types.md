---
title: Vocabulary types:span 與 format
track: modern
reviewed: 2026-07-03
review_interval: 21
---

# Vocabulary types:span 與 format

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## std::span:非擁有的連續記憶體視圖

- **`std::span<T>` = 指標 + 長度,統一接收所有連續資料**:C array、`std::array`、`vector`、`{ptr, len}` 全部直接傳,取代 `(const vector&) / (T*, size_t)` 多載;介面仿容器(`size()/empty()/data()/front()/back()/begin()/end()`),range-for 與 `<algorithm>` 直接用。`#include <span>`,C++20。
- **它是 view 不是容器:傳參數直接 by value**,本體只有**兩個欄位(指標+長度)**,不用寫 `const span<T>&`;透過 span 寫元素改到的是**原本那塊記憶體**(可視為配好迭代器的 `(T*, size_t)`)。
- **坑:`const span<int>` ≠ `span<const int>`,規則同指標**(`int* const` vs `const int*`):`const` 加在 span 上只鎖 view 本身不能改指向,**元素照樣可寫**(`g(const span<int> s){ s[0]=1; }` 可編);唯讀介面要寫 **`span<const T>`**,順便讓 `const` 容器也能傳入。
- **切片 `first(n)` / `last(n)` / `subspan(off)` / `subspan(off, cnt)`:零複製,回傳仍是 span 指著原資料**;`ranges::sort(s.first(s.size()/2))` 動的是本體,sliding window 就是迴圈裡 `s.subspan(i, k)`。
- **第二個 template 參數是 extent:`span<T, N>`,預設 `dynamic_extent`**;N 寫死後長度進型別,適合「剛好 N 個」的介面(如 `dot3(span<const double,3>, ...)`)。**CTAD 坑:C array / `std::array` 推出 static extent(如 `span<int, 3>`),vector 才是 dynamic**;dynamic → static 不會隱式轉(vector 直接傳 → 編譯錯誤),要 `std::span{v}.first<3>()` 明確保證。static extent 少存一個長度欄位。
- **`std::as_bytes(span)` → `span<const std::byte>`,`as_writable_bytes` → `span<std::byte>`**:IO/hash/序列化的標準寫法,取代手寫 `reinterpret_cast`;`raw.size()` == **元素數 × `sizeof(T)`**。
- **坑:`s[i]` 越界是 UB,且 C++20/23 沒有 `at()`(C++26 才補)**:index 來自外部輸入時先自查 `size()`。
- **坑:dangling — span 不延長底層生命週期,同 `string_view` 一類問題**:回傳指向 local vector 的 span 必懸空;`vector::push_back` 可能 **reallocate 使既有 span 整個失效**。安全用法:**當參數往下傳 OK**;存成成員或回傳前,要確定底層壽命更長且中途不 reallocate。
- **與 `string_view` 的分工:字串用 `string_view`(概念上 = 字串特化的唯讀 span,多 `find/substr/starts_with`,永遠唯讀),其他連續記憶體用 `span`**;只有要原地改字元的少數場合才用 `span<char>`。

## std::format:格式語法

- **`std::format` 用 `{}` 佔位,type-safe,不用像 `printf` 手動對 `%d/%f`**:`#include <format>`,C++20;格式字串為常量時**格式錯誤在編譯期報錯**(P2216,回溯入 C++20);`{0}{1}{0}` 位置索引可重複引用同一參數;`std::print/println` 是 **C++23**(`<print>`)。
- **format spec 全形:`{:[fill][align][sign][#][0][width][.precision][type]}`**:對齊 `<` 靠左 / `>` 靠右 / `^` 置中,align 前可加 fill 字元(`{` `}` 除外任意字元,`{:*^8}` → `***hi***`);`{:08}` = 0 + width 補零;sign:`{:+}` 正數也印 `+`、`{: }` 正數留空位。
- **浮點數記兩件事:`.N` 定精度、type 字母定形式**:`{:.2f}` 固定小數 2 位、`{:.3e}` 科學記號(`3.142e+00`)、`{:.4g}` 自動選 f/e 緊湊顯示;金額/比例類輸出 `{:.2f}` 通常就對,可疊 width:`{:>8.2f}`。
- **坑:同一個 `.N`,浮點是「精度」、字串是「截斷長度(最多 N 字元)」**:`{:.3}` 對 `3.14159` → `"3.14"`(無 type 時按 **`g` 語義 = 3 位有效數字**),對 `"formatting"` → `"for"`;`{:.3f}` 才是 3 位小數(→ `"3.142"`)。套在字串上**不報錯、不會炸,輸出只是悄悄變短**,特別難抓。
- **整數進制 `b/o/x`,`#` 加前綴**(`{:#x}` → `0xff`,`{:#010b}` → `0b00101010`);**width/precision 可動態傳:巢狀 `{}`**,`{:>{}}` 寬度吃下一個參數、`{:.{}f}` 小數位吃參數,適合欄寬/精度來自 config 的 log 或 table 輸出。
