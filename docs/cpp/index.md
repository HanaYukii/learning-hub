# C++ Modern & Low-Level

> 現代 C++ 與底層知識筆記。基本概念簡記，容易混淆或影響效能的地方另作說明。
> 按主題閱讀可從下表開始；[HFT C++ 面試軌](/quant/hft-cpp/parameter-passing) 則以問答方式整理。

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

> ★ = 整理自[部落格](https://hanayukii.dev)既有文章。未勾選的主題待補。
