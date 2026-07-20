---
title: 多型:virtual vs template/CRTP
track: modern
reviewed: 2026-07-03
review_interval: 21
---

# 多型:virtual vs template/CRTP

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## 動態多型:virtual 分派機制與成本

- **virtual call = 經 vtable 的兩次記憶體間接**:object → **vptr** → vtable slot → 函式位址;每個多型物件多 **1 個 vptr(64-bit 下通常 8 bytes)**,每個多型 class 一份 vtable(Itanium ABI 慣例,標準不規定實作方式)。
- **真正的成本不是跳轉本身,而是「優化屏障」**:間接呼叫讓編譯器無法 inline(除非能 devirtualize,見下),連帶失去常數傳播、向量化等後續優化;分支預測命中時 call 開銷很小,**miss 時約 15–20 cycles 的 pipeline flush**(依 µarch 而異)。
- **多型基底必須有 virtual destructor**:經 `Base*` 對衍生物件 `delete` 而 dtor 非 virtual 是 **UB**;慣用 `virtual ~Shape() = default;`。
- **virtual 的核心賣點是異質容器與開放集合**:`vector<unique_ptr<Shape>>` 可裝執行期才知道的型別;template/CRTP 做不到——`Shape<Circle>` 與 `Shape<Square>` 是**不同型別,塞不進同一容器**。

<svg width="620" viewBox="0 0 620 232" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" style="max-width:100%;height:auto" role="img" aria-label="virtual 經 vptr 與 vtable 兩次間接呼叫,對比 CRTP 編譯期直接inline">
  <defs>
    <marker id="vt-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="10" y="16" font-size="12" font-weight="bold" fill="currentColor">virtual:執行期 2 次間接</text>
  <rect x="10" y="30" width="130" height="66" rx="4" fill="var(--vp-c-default-soft)" stroke="currentColor"/>
  <text x="20" y="48" font-size="12" fill="currentColor">Circle object</text>
  <rect x="20" y="56" width="110" height="18" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor"/>
  <text x="26" y="69" font-size="12" fill="currentColor">vptr</text>
  <text x="20" y="90" font-size="12" fill="currentColor">r = 2.0</text>
  <line x1="140" y1="65" x2="205" y2="65" stroke="currentColor" marker-end="url(#vt-arr)"/>
  <text x="144" y="58" font-size="12" fill="currentColor">1. 讀 vptr</text>
  <rect x="210" y="30" width="150" height="66" rx="4" fill="var(--vp-c-default-soft)" stroke="currentColor"/>
  <text x="220" y="48" font-size="12" fill="currentColor">vtable (Circle)</text>
  <rect x="220" y="56" width="130" height="18" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor"/>
  <text x="226" y="69" font-size="12" fill="currentColor">[0] &area</text>
  <text x="220" y="90" font-size="12" fill="currentColor">[1] &~Circle</text>
  <line x1="360" y1="65" x2="425" y2="65" stroke="currentColor" marker-end="url(#vt-arr)"/>
  <text x="364" y="58" font-size="12" fill="currentColor">2. call</text>
  <rect x="430" y="30" width="180" height="66" rx="4" fill="var(--vp-c-default-soft)" stroke="currentColor"/>
  <text x="440" y="52" font-size="12" fill="currentColor">Circle::area()</text>
  <text x="440" y="74" font-size="12" fill="currentColor">間接目標 → 難 inline</text>
  <line x1="10" y1="120" x2="610" y2="120" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
  <text x="10" y="146" font-size="12" font-weight="bold" fill="currentColor">CRTP / template:編譯期綁定</text>
  <rect x="10" y="160" width="130" height="52" rx="4" fill="var(--vp-c-default-soft)" stroke="currentColor"/>
  <text x="20" y="182" font-size="12" fill="currentColor">print_area(c)</text>
  <text x="20" y="200" font-size="12" fill="currentColor">呼叫點</text>
  <line x1="140" y1="186" x2="205" y2="186" stroke="currentColor" marker-end="url(#vt-arr)"/>
  <text x="150" y="179" font-size="12" fill="currentColor">inline</text>
  <rect x="210" y="160" width="220" height="52" rx="4" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor"/>
  <text x="220" y="182" font-size="12" fill="currentColor">area_impl() 直接展開</text>
  <text x="220" y="200" font-size="12" fill="currentColor">0 次間接、可繼續優化</text>
</svg>

## 靜態多型:template / CRTP

- **template = 編譯期綁定,可 inline、零分派成本**:`template<typename T> void print_area(const T& sh)` 直接綁 `T::area`;代價是**每個 T 各生一份程式碼**(code bloat)、編譯變慢、**二進位介面不穩**(不宜跨 ABI 邊界)。
- **CRTP:基底吃下衍生型別當模板參數,用 `static_cast` 下轉取代 vtable**:`static_cast<const Derived&>(*this).area_impl()`,全程編譯期解析、無 vptr;常用於 header-only 泛型基底。
- **CRTP 基底/衍生介面故意不同名(`area` vs `area_impl`)**:同名時若衍生忘了自己定義,`static_cast` 那行經名稱查找綁回(繼承自基底的)同名函式 → **無限遞迴**;不同名則漏實作直接**編譯錯誤**,fail fast。
- **C++23 deducing this 可取代大部分 CRTP 樣板**:`template<class Self> double area(this const Self& self)` 讓基底成員直接推導出衍生型別,不再需要模板基底 + `static_cast`(公認補充,原文未涵蓋)。

## concepts:把靜態介面講清楚

- **concept 把 template 的隱式介面顯式化,錯誤直指呼叫點**:`concept HasArea = requires(const T t) { { t.area() } -> std::convertible_to<double>; };`,不滿足時報一行「constraint not satisfied」,而非具現化深處的長篇錯誤。

## 第三條路:std::variant + std::visit

- **封閉集合的第三條路:`std::variant` 裝值 + `std::visit` 分派**:值語意、**無 heap 配置、無 vtable**,能放進同一容器;執行期只剩**一次依 `index()` 的跳轉**(實作常為函式指標表或 switch);大小約為最大 alternative + discriminant。
- **泛型 lambda visitor 不做完整性檢查(反直覺)**:`[](const auto& s){ return s.area(); }` 對新增型別只要有 `area()` 就**默默通過**;要「漏一種就編譯錯」,visitor 得**每個型別一個 overload**(overloaded idiom)。代價:集合封閉,加型別就得改 `variant` 定義。

## devirtualization

- **devirtualization 條件 = 編譯器能證明動態型別**:局部/棧上物件直接呼叫、建構點在(inlining 後)可見範圍、或 LTO/whole-program 分析;GCC/Clang 另有 **speculative devirtualization**(常配 PGO):插入 `if (vptr == &Circle::vtable)` 走直呼 + inline,否則 fallback 間接呼叫。
- **`final` 是最便宜的 devirtualization 開關**:`struct Circle final : Shape` 或 `double area() const final`,讓編譯器可將經 `Circle*`/`Circle&` 的 virtual call **直接靜態綁定**(直呼、可 inline),不需全程式分析。

## 選用時機

- **一句話:開放集合用 virtual、封閉集合用 variant、熱路徑用 template**:virtual — 型別執行期才知道、需要異質容器、跨 plugin/**ABI 邊界**;template/CRTP — 型別編譯期已知、效能敏感熱路徑、header-only 泛型庫;variant — 就那幾種、又想放同一容器。
