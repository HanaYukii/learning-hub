---
title: 反射:RTTI / type_traits / C++26 static reflection
track: modern
reviewed: 2026-07-03
review_interval: 21
---

# 反射:RTTI / type_traits / C++26 static reflection

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## 全局圖景

- **C++ 反射弱是刻意取捨**:編譯後丟棄大部分型別資訊換 **zero overhead**;現況只有兩塊零碎工具——執行期 **RTTI** + 編譯期 **type_traits**,而「列出 struct 欄位」到 **C++23 為止標準完全做不到**,只能手寫或靠庫。

## 執行期:RTTI(typeid / dynamic_cast)

- **typeid 要拿動態型別,class 必須 polymorphic**(至少一個 virtual function,virtual destructor 即可);否則 `typeid` 編譯期就決議成**靜態型別**。細節:operand 只有在是 **polymorphic 型別的 glvalue** 時才求值;對 polymorphic 型別解參考 null 指標是特例——擲 **std::bad_typeid** 而非 UB。
- **type_info::name() 回傳字串是實作定義(implementation-defined)**:GCC/Clang(Itanium ABI)回 mangled 名如 **"3Dog"**,要 `abi::__cxa_demangle` 還原;MSVC 直接回 **"struct Dog"**。跨編譯器不可依賴其格式。
- **dynamic_cast 指標版失敗回 nullptr、參考版擲 std::bad_cast**;成本**非常數**——沿繼承鏈走 type_info 比對,Itanium ABI 跨 shared library 時可退化成 **mangled name 字串比較**,深層/菱形繼承更貴;hot path 慣用 virtual function 或自帶 type tag 取代 downcast。
- **-fno-rtti 是低延遲/遊戲圈常態**:關掉後 `typeid` 與**需要執行期檢查的 `dynamic_cast` 直接編譯錯誤**(靜態可判定的 upcast 不受影響),省下 type_info 的二進位空間;注意 **RTTI 與 exceptions 是獨立開關**,且 **vtable 仍存在**(virtual dispatch 不受影響)。

## 編譯期:type_traits

- **type_traits + if constexpr 是零成本反射主力**:`is_integral_v`、`is_same_v`、`is_pointer_v` 皆純編譯期;**`if constexpr` 落選分支在 template 內不會 instantiate**(但仍須通過語法/非依賴名檢查;**非 template context 兩邊都要完整合法**)。
- **不少 traits 是編譯器 intrinsic 而非純庫實作**(如 `__is_union`、`__is_trivially_copyable`),純標準語法寫不出來;C++20 後多數 dispatch 場景改用 **concepts** 表達更乾淨。
- **type_traits 只能問「型別性質」,問不到欄位名/成員清單**——這是它與完整反射的邊界,也是 C++26 之前的根本缺口。

## 列欄位:第三方方案(magic_get 類)

- **Boost.PFR(前身 magic_get)靠 structured bindings 走訪 aggregate 欄位**:不改 struct、不用巨集,`for_each_field` 即可遍歷;但**只有值、沒有欄位名**,且限 **aggregate**(無自訂 ctor / virtual / private 成員),欄位數是用 aggregate-init 可行性在編譯期探出來的。
- **欄位/枚舉「名字」在 C++26 前只能靠非標準 hack**:magic_enum、新版 PFR 的 `get_name` 都是從 `__PRETTY_FUNCTION__` / `std::source_location::function_name()` 的簽名字串摳出來——**標準未保證格式**,且 magic_enum 預設只掃 **[-128, 127]** 的枚舉值範圍(巨集/`enum_range` 特化可調)。

## C++26:static reflection

- **反射操作子 `^^` + splicer `[: :]` 是一對逆操作**:`^^T` 把型別/實體變成反射值(型別 **`std::meta::info`**),`[: r :]` 把反射值拼回程式實體;查詢走 `std::meta` 的 **consteval** 函式(`enumerators_of`、`identifier_of`、`nonstatic_data_members_of`…),P2996 已於 **2025-06 表決進 C++26**。
- **全程編譯期、零執行期成本**:enum 轉字串 = `template for`(**expansion statement**,同入 C++26)走 `enumerators_of(^^E)`,逐個 `value == [:e:]` 比對後 `identifier_of(e)` 取名——巨集 / PFR 硬湊的事收進標準語言。
- **語法仍在收斂、主流編譯器陸續實作中**:面試講方向與能力(成員枚舉、取 identifier、codegen 如 `define_aggregate`——亦屬 P2996,更完整的 token injection 仍在提案),**別背細節 API**;定位是「快來了」而非「現在能上 production」。

## 語言對照

- **Java/C#/Python 反射內建,是因為型別資訊留到執行期**(Python `vars(p)`/`getattr`、Java `getDeclaredFields()`),代價是 metadata 常駐 + 執行期成本;C++26 選的是**編譯期反射**路線——能力補齊,但 zero-overhead 原則不變。
