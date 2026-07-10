---
title: 物件佈局成本:padding / vtable / 智慧指標
track: lowlevel
reviewed: 2026-07-03
review_interval: 21
---

# 物件佈局成本:padding / vtable / 智慧指標

> C++ item-sheet(求覆蓋):標準知識一行快掃,非顯然處展開。蒸餾自部落格。

## Padding 與 Alignment

- **對齊規則:成員 offset 必須是自身 alignment 的倍數,struct 總大小是最大成員 alignment 的倍數**:不足處編譯器插 padding,所以 `sizeof` ≥ 欄位大小總和;具體 alignment 由 ABI 決定(實作定義;x86-64 上 `int` 4、`double`/指標 **8**,用 `alignof` 查)。
- **欄位重排直接省空間:`{char, double, char}` = 24B → `{double, char, char}` = 16B,省 33%**:經驗法則「大欄位放前面」;同理 `{char, int, char}` **12B** → `{int, char, char}` **8B**。用 `offsetof` 驗證,`-Wpadded` 讓編譯器在插 padding 時發警告。

<svg width="620" viewBox="0 0 620 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="struct padding:欄位排序前後的記憶體佈局">
  <text x="60" y="16" font-size="12" fill="currentColor">Bad {char a; double b; char c;} — sizeof = 24</text>
  <rect x="60" y="26" width="22" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="82" y="26" width="154" height="26" fill="var(--vp-c-default-soft)" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="236" y="26" width="176" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="412" y="26" width="22" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="434" y="26" width="154" height="26" fill="var(--vp-c-default-soft)" stroke="currentColor" stroke-opacity="0.4"/>
  <text x="71" y="43" font-size="12" fill="currentColor" text-anchor="middle">a</text>
  <text x="159" y="43" font-size="12" fill="currentColor" fill-opacity="0.6" text-anchor="middle">pad ×7</text>
  <text x="324" y="43" font-size="12" fill="currentColor" text-anchor="middle">double b</text>
  <text x="423" y="43" font-size="12" fill="currentColor" text-anchor="middle">c</text>
  <text x="511" y="43" font-size="12" fill="currentColor" fill-opacity="0.6" text-anchor="middle">pad ×7</text>
  <text x="60" y="66" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">0</text>
  <text x="236" y="66" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">8</text>
  <text x="412" y="66" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">16</text>
  <text x="588" y="66" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">24</text>
  <text x="60" y="96" font-size="12" fill="currentColor">Good {double b; char a; char c;} — sizeof = 16</text>
  <rect x="60" y="106" width="176" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="236" y="106" width="22" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="258" y="106" width="22" height="26" fill="var(--vp-c-brand-1)" fill-opacity="0.25" stroke="currentColor" stroke-opacity="0.4"/>
  <rect x="280" y="106" width="132" height="26" fill="var(--vp-c-default-soft)" stroke="currentColor" stroke-opacity="0.4"/>
  <text x="148" y="123" font-size="12" fill="currentColor" text-anchor="middle">double b</text>
  <text x="247" y="123" font-size="12" fill="currentColor" text-anchor="middle">a</text>
  <text x="269" y="123" font-size="12" fill="currentColor" text-anchor="middle">c</text>
  <text x="346" y="123" font-size="12" fill="currentColor" fill-opacity="0.6" text-anchor="middle">pad ×6</text>
  <text x="60" y="146" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">0</text>
  <text x="236" y="146" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">8</text>
  <text x="412" y="146" font-size="12" fill="currentColor" fill-opacity="0.7" text-anchor="middle">16</text>
</svg>

- **`#pragma pack(1)` 消除 padding 但非標準、有代價**:`{char, double, char}` packed 後 sizeof = **10**,但 `double` 落在 offset 1(未對齊);x86 未對齊存取有效能懲罰(可能拆成 **2 次記憶體存取**),部分 ARM 架構直接 **bus fault** crash。只用於網路協定 / 檔案格式等需精確控制佈局處。

## Vtable 與 virtual 的代價

- **加一個 `virtual` 使 `sizeof` 從 4 → 16(x86-64)**:物件開頭插入 **8B vptr** + int 4B + padding 4B;vptr 指向 per-class 的 vtable(function pointer 陣列,放 read-only data section),derived override 就是換掉 vtable 裡對應的 entry。vptr/vtable 是實作慣例(Itanium ABI),標準未規定,但主流編譯器行為一致。
- **virtual call = 2 次 memory indirection,但真正的殺手是失去 inline:hot loop 差距可達 5–10x**:讀 vptr → 查 vtable → 跳轉;目標到 runtime 才確定,編譯器無法 inline,呼叫點後續優化也全部斷掉。non-virtual call 是編譯期已知地址的直接跳轉。
- **`final` 觸發 devirtualization,拿回 inline**:標了 `final` 就不會再被繼承/override,編譯器可把 virtual call 還原成 direct call;**LTO** 在某些情況下也能達成類似效果。
- **CRTP 以編譯期 dispatch 取代 virtual,零 runtime 成本**:`static_cast<Derived*>(this)->impl()`,dispatch 全在編譯期、可 inline;缺點是語法複雜、做不到 runtime 多型(異質容器不行)。
- **`std::function` 內部是 type erasure,帶有類 vtable 的 indirection(超出 small buffer 的 callable 還會 heap allocate)**:callable type 編譯期已知時,改用 template 參數直接收 lambda。

## Smart Pointer:unique_ptr vs shared_ptr

- **`unique_ptr` 是真零成本抽象:`sizeof` == raw pointer(**8B**),可編譯成與 raw pointer 相同的機器碼**:前提是 deleter 無狀態(default 情況,靠 EBO 壓成 0B);`unique_ptr<T, void(*)(T*)>` 用 function pointer 當 deleter 會變 **16B**(面試陷阱)。
- **`shared_ptr` 本體 16B(object 指標 + control block 指標),control block 另在 heap 上**:block 內含 **atomic 的 strong_count / weak_count**、deleter、allocator;每次 copy → **atomic increment**,每次 destroy → **atomic decrement**。
- **atomic refcount 的稅:x86 上是 `LOCK ADD` — 無競爭 ~10–20 cycles(普通加法 ~1 cycle),有競爭 100–1000+ cycles**:LOCK 要鎖 cache line、跑 cache coherence protocol、附帶 memory barrier,**single-threaded 也照付固定成本**。不需延長生命週期就傳 `const shared_ptr&`(零 atomic);by-value 參數每次呼叫付一對 inc/dec。
- **`make_shared` 一次 heap allocation,`shared_ptr(new T)` 兩次**:heap allocation 約 **50–100ns**;合併配置還有 cache locality 與 C++17 前的異常安全好處(舊評價順序下 `f(shared_ptr<T>(new T), g())` 可能 leak)。反面細節:合併後物件記憶體要等 **weak_count 歸零**才能釋放 — 有長壽 `weak_ptr` 且物件很大時,物件已解構但記憶體留著。

## EBO 與 [[no_unique_address]]

- **空類別 `sizeof` ≥ 1,但作為 base class subobject 可佔 0B(EBO)**:對 standard-layout class 是標準強制(指向物件的指標須可 reinterpret 成指向首成員);`unique_ptr` 就是靠 EBO(compressed pair 手法)把無狀態 deleter 壓成 0,才維持 8B。
- **C++20 `[[no_unique_address]]` 把 EBO 效果帶給資料成員**:空成員可與其他成員共址、不佔空間,免去繼承 hack;語意是「允許重疊」而非「保證」,且 **MSVC 在既有 ABI 下預設忽略此屬性**(需用 `[[msvc::no_unique_address]]`)。
