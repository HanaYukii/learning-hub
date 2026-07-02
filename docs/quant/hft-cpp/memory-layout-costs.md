---
title: 記憶體佈局成本:padding/vtable/智慧指標/false sharing
track: hft-cpp
category: hft-cpp
reviewed: 2026-07-02
review_interval: 21
---

# 記憶體佈局成本:padding/vtable/智慧指標/false sharing

> HFT C++ 面試 item-sheet,蒸餾自親身面試紀錄(部落格),面試前快速複習。

- **struct 欄位順序決定 sizeof——大的放前面**
  要點:每個型別有 ABI 定義的對齊要求 $\text{alignof}(T)$(x86-64 上純量型別通常等於 sizeof),成員 offset 必須是它的倍數,不滿足就插 padding;`char, double, char` 的 $\text{sizeof}=24$,重排成 `double, char, char` 只剩 $16$(省 33%)。整體 sizeof 還必須是最大 alignof 的倍數,尾部也會補 padding。**關鍵:「把 alignment 大的欄位放前面;用 `-Wpadded`(GCC/Clang)讓編譯器報出每一處 padding,用 `offsetof` 驗證。」**

- **`#pragma pack(1)` 不是免費省空間**
  要點:`#pragma pack` 是編譯器擴充(非標準);強制取消 padding 造成 unaligned access——現代 x86 對不跨 cache line 的 unaligned 存取幾乎免費,跨 cache line 才拆成兩次存取(跨 page 更糟);ARMv8 的一般 load/store 多可容忍,但 unaligned 的 atomic/exclusive 指令與舊核心、部分 embedded 核心會直接 fault。另外對 packed 成員取址再解參考是 UB(GCC 有 `-Waddress-of-packed-member` 警告)。只適合網路協議、檔案格式等需要精確 wire layout 的場景。**關鍵:「packed 省的是空間,付的是存取代價——x86 跨 line 變慢、ARM/atomic 可能直接 fault;wire format 之外別用。」**

- **一個 `virtual` 讓 4-byte 物件膨脹成 16 bytes(64-bit)**
  要點:vptr/vtable 是主流 ABI(Itanium、MSVC)的實作方式——標準沒有規定,但 GCC/Clang/MSVC 皆如此:有 virtual function 的 class,每個物件開頭插一個指標大小的 **vptr**(64-bit 為 8 bytes),指向唯讀資料段裡該 class 共用的 **vtable**(function pointer 陣列);`struct { int x; virtual void foo(); }` 的 $\text{sizeof} = 8(\text{vptr}) + 4(\text{int}) + 4(\text{pad}) = 16$。**關鍵:「空間成本是每物件一個 vptr + 對齊 padding,vtable 本身每 class 只有一份。」**

- **virtual call 的真正代價是失去 inline,不是兩次 indirection**
  要點:呼叫路徑 = 讀 vptr → 讀 vtable entry → indirect call(兩次相依的 memory load);indirect branch 在預測命中時跳轉本身很便宜,真正的殺手是編譯期不知道目標、**無法 inline** 與後續優化,hot loop 差距可達 $5\text{–}10\times$。`std::function` 的 type erasure 有同款 overhead(還可能多一次 heap allocation)。**關鍵:「代價在失去 inline 與後續優化;hot path 用 `final` 讓編譯器 devirtualize,或用 CRTP 把 dispatch 搬到編譯期(零 runtime 成本,代價是失去 runtime 多型)。」**

- **unique_ptr 近零成本;shared_ptr 是 16B + heap 上的 control block**
  要點:預設(無狀態)deleter 下 $\text{sizeof(unique\_ptr)}=8$,與 raw pointer 相同(有狀態 deleter 如 function pointer 會變大),inline 後機器碼通常與 raw pointer 等價;但它有非 trivial destructor,按值傳參時 Itanium ABI 規定走記憶體而非暫存器,嚴格說是「近零成本」而非絕對零。$\text{sizeof(shared\_ptr)}=16$(64-bit;物件指標 + control block 指標),control block 另存 atomic 的 strong/weak count、deleter、allocator。**關鍵:「不需要共享所有權就用 `unique_ptr`——先問所有權模型,再談指標選型。」**

- **copy 一次 shared_ptr = 一次 atomic RMW,單執行緒也逃不掉**
  要點:每次 copy/destroy 對 strong count 做 atomic inc/dec,x86 上是 `lock` 前綴的 RMW(如 `lock xadd`):鎖 cache line + 完整 memory barrier;無競爭約 $\sim 20$ cycles(普通加法 $\sim 1$ cycle),多核搶同一條 refcount line 時可差百倍。只要程式連結了執行緒支援(實務上必然),即使物件從未跨執行緒,copy 仍是 atomic(libstdc++ 僅在未連結 pthread 時才降級為非 atomic)。**關鍵:「函數不延長物件生命週期就傳 `const std::shared_ptr<T>&`(或乾脆 `T&`),零 atomic 操作;要轉移所有權就 `std::move`(同樣零 atomic)。」**

- **`make_shared` 一次 allocation,`shared_ptr(new T)` 兩次**
  要點:`make_shared` 把 control block 與物件合併成一塊連續記憶體——少一次 heap allocation(一次約數十至上百 ns)、control block 與物件相鄰 cache locality 更好、C++17 前還順帶解掉 `shared_ptr(new T)` 的 exception-leak 風險(C++17 起引數不再交錯求值,該風險已消失)。代價:物件與 control block 同一塊記憶體,只要還有 `weak_ptr` 活著,整塊(含物件儲存空間)都不能釋放;也不能自訂 deleter。**關鍵:`auto p = std::make_shared<Widget>();`**

- **false sharing:兩個 core 寫同一條 cache line,互相打爆對方**
  要點:cache line 在主流 x86-64 上是 $64$ bytes(Apple M 系列 ARM 是 $128$);兩個 thread 各寫「邏輯無關但同 line」的變數,coherence protocol 讓該 line 在 core 間乒乓,吞吐可掉一個數量級——per-thread counter、SPSC queue 的 head/tail 是經典受害者;多執行緒狂 copy 同一個 shared_ptr 時,refcount 那條 line 就是 contention 熱點。**關鍵:`alignas(64)` 把各 thread 的熱門變數隔進獨立 cache line(struct 加 alignas 後 sizeof 也補成 64 的倍數,陣列元素不共 line;C++17 `<new>` 有 `std::hardware_destructive_interference_size`,GCC 12 起才提供)。**

- **Order Book:絕不用 double 當價格 key**
  要點:crypto 價格帶 $18$ 位小數(源自 $1\ \text{ETH}=10^{18}$ wei、ERC-20 慣例 18 decimals),double 只保證 $15$ 位有效十進位數字(`DBL_DIG` $=15$,round-trip 最多需 17 位),且 $0.1+0.2 \neq 0.3$——「相同」價格會被當成不同 key,在 order book 是致命 bug。轉整數:已知 tick size 就用 tick index($111.5/0.5=223$);fixed-point $\times 10^{18}$ 要注意 int64 上限 $\approx 9.22\times10^{18}$,價格範圍大時 tick index 更穩。**關鍵:`std::map<Price, Qty, std::greater<Price>> bid;`(Price 用 `int64_t` tick index;ask 用預設升序;delta 更新 `qty==0` 即 `erase`)**

- **Order Book 熱路徑:top-of-book 才是主戰場**
  要點:best bid/ask 每筆 market order/cancel 都在動——`std::map::begin()` 標準保證 $O(1)$,真正的成本是 $O(\log n)$ 的 find/insert/erase 加上 tree node 分散造成的 pointer-chasing cache miss,所以快取 best level 的 iterator/指標、避免反覆查找;前幾層用固定大小 sorted array(更新頻繁、數量少、cache friendly),深層用 map 或 flat sorted vector;node 用 memory pool 預先配置,消掉 insert/erase 的 heap allocation latency spike。進階:delta 靠 sequence number 偵測 gap、gap 就 fallback snapshot 重建;single-writer + seqlock/RCU 做 lock-free read。**關鍵:「分層設計:top N 用 array 吃 cache locality,深層用 map;加 memory pool 壓 tail latency。」**
