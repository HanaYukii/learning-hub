# C++ Modern & Low-Level

> **用途**:現代 C++ 與底層知識的 item 化知識庫,面試/複習快掃。**求覆蓋**(quant 式):標準知識也列一行,非顯然處才展開。
> **分工**:這裡是**知識庫**(體系導向);[HFT C++ 面試軌](/quant/hft-cpp/parameter-passing) 是**考點 item-sheet**(面試導向),條目互相連結。

## Modern 軌 checklist

- [x] [編譯期計算:constexpr 到 LUT](/cpp/modern/compile-time) ★
- [x] [多型:virtual vs template/CRTP](/cpp/modern/polymorphism) ★
- [x] [反射:RTTI / type_traits / C++26 static reflection](/cpp/modern/reflection) ★
- [x] [Vocabulary types:span 與 format](/cpp/modern/vocabulary-types) ★
- [ ] Value categories 與 move 語意(lvalue/xvalue/prvalue、forward、移後狀態)
- [ ] RAII / Rule of Five / Rule of Zero
- [ ] string_view 生命週期陷阱
- [ ] concepts / ranges 實戰
- [ ] coroutines(generator / awaitable 模型)
- [ ] C++26:`inplace_vector`(★ [面試軌已有](/quant/hft-cpp/inplace-vector))、contracts、`std::execution`

## Low-level 軌 checklist

- [x] [物件佈局成本:padding / vtable / 智慧指標](/cpp/lowlevel/object-layout) ★
- [x] [編譯器與標準庫的隱形優化:SSO / copy elision](/cpp/lowlevel/compiler-optimizations) ★
- [ ] Memory model 與 atomics(happens-before、acquire/release vs seq_cst 成本)
- [ ] Cache 階層與 false sharing(★ [面試軌部分覆蓋](/quant/hft-cpp/memory-layout-costs))
- [ ] Branch prediction 與 branchless 技巧
- [ ] SIMD / 自動向量化(何時會 / 何時不會)
- [ ] Allocator / memory pool / arena
- [ ] Devirtualization、LTO、PGO
- [ ] Huge pages / TLB / NUMA
- [ ] 量測方法:rdtsc、benchmark 陷阱

> ★ = 蒸餾自[部落格](https://hanayukii.dev)既有文章。未打勾 = backlog,之後波次補。
