---
title: 手寫 inplace_vector 要點
track: hft-cpp
category: hft-cpp
reviewed: 2026-07-02
review_interval: 21
---

# 手寫 inplace_vector 要點

> HFT C++ 面試 item-sheet,蒸餾自親身面試紀錄(部落格),面試前快速複習。

- **為什麼不能用 `T data[N]`:inplace_vector 的語意是「push 時才建構」**
  要點:`T data[N]` 會對全部 $N$ 個元素跑 default constructor——T 沒有 default ctor 直接編譯失敗,ctor 有副作用則語意錯;size = 0 時不該有任何 T 物件存在。**關鍵:「我需要一塊 raw memory,把建構延遲到 push_back 用 placement new。」**

- **Aligned storage 的標準寫法:`alignas(T)` + `std::byte` 陣列**
  要點:`alignas(T)` 保證 buffer 起始位址是 $\text{alignof}(T)$ 的倍數;純 `std::byte` 陣列的對齊只有 1,漏掉 `alignas` 而在未對齊位址上建構 T 就是 UB,某些架構直接 bus fault。舊寫法 `std::aligned_storage` C++23 已棄用(P1413),別再用。面試官會追問「你的 buffer 對齊了嗎?」**關鍵:`alignas(T) std::byte storage_[sizeof(T) * N];`**

- **取元素指標要過 `std::launder`(C++17)**
  要點:`storage_`(byte 陣列)和在它上面建構出來的 T 物件**不是 pointer-interconvertible**,所以 `reinterpret_cast` 出來的指標直接 dereference 嚴格說是 UB(實務上編譯器都放行);`std::launder` 回傳指向「該位址上 lifetime 內的 T」的合法指標——前提是那個位址上確實有活著的 T。加分項,非必考。**關鍵:`return std::launder(reinterpret_cast<T*>(storage_ + sizeof(T) * i));`**

- **Placement new = 只建構不配置;explicit destructor call = 只解構不釋放**
  要點:普通 `new` = allocate + construct;placement new 跳過 allocate,直接在指定位址呼叫 ctor(`::` 前綴 + `static_cast<void*>` 避開 class 自訂的 operator new);銷毀用 `ptr->~T()`,絕不 free(記憶體屬於 `storage_`)。C++17 起有 `std::destroy_at`,C++20 起有 `std::construct_at`(可在 constexpr 用;placement new 要到 C++26 才能進 constexpr),但手寫展示你懂底層。**關鍵:`::new (static_cast<void*>(addr)) T(std::forward<Args>(args)...);` 與 `ptr->~T();` 成對出現。**

- **Exception safety:先 construct,成功後才 `++size_`**
  要點:順序反過來的話,ctor throw 時 `size_` 已加一但物件不存在,destructor 會去銷毀幽靈物件 = UB;construct-then-increment 讓 throw 時 vector 狀態完全不變 = **strong exception guarantee**。**關鍵:「construct first, then update size——emplace_back 裡是 `construct_at_(size_, ...); return *ptr(size_++);`」**

- **Destructor 必須手動 clear():compiler 眼裡只有 `std::byte[]`**
  要點:default destructor 不會呼叫各元素的 `~T()`,因為成員只是 byte 陣列,compiler 不知道上面有活的物件 → resource leak。`clear()` = `while (size_ > 0) pop_back();`,而 `pop_back` 先 `--size_` 再 `destroy_at_(size_)`。**關鍵:`~inplace_vector() { clear(); }`**

- **Rule of Five 全部手寫:default copy/move 只是 bitwise copy `storage_`**
  要點:隱式生成的 copy/move 逐 byte 複製 `storage_`——複製動作本身合法,但新 buffer 上從未建構過任何 T,之後把那些 byte 當 T 物件用是 UB;對 `unique_ptr` 這類 T 還會 double-free(default「move」對 byte 陣列也只是 bitwise copy,不會清空來源)。copy/move ctor 逐元素 `construct_at_` 且**逐個 `++size_`**;注意:**ctor 中途 throw 時物件未完成建構,`~inplace_vector()` 不會執行**(member 是 trivial 的 byte 陣列)→ 已建構的前 $k$ 個元素洩漏——解法是 delegating ctor(`: inplace_vector()`,target ctor 完成後 body 再 throw 才會呼叫 dtor)或 try/catch 手動清理。assignment 先自我賦值檢查、`clear()`、再逐個重建;move 之後把 `other.clear()`(標準版只保證 moved-from 是 valid but unspecified,手寫可給更強保證)。**關鍵:「五個 special member 都要寫;copy/move ctor 要 delegate 到 default ctor(或 try/catch),否則 throw 時沒人清理;先 `if (this == &other) return *this;`。」**

- **Move 的 conditional noexcept**
  要點:move ctor/assignment 標 `noexcept(std::is_nothrow_move_constructible_v<T>)`;這決定外層 `std::vector<inplace_vector>` reallocation 時走 move 還是退回 copy(`std::move_if_noexcept`:move ctor 為 noexcept 或 T 不可 copy 時才 move)。**關鍵:`inplace_vector(inplace_vector&& other) noexcept(std::is_nothrow_move_constructible_v<T>)`**

- **memcpy 只對 trivially copyable 合法**
  要點:對 `int`/`double` 可以,對 `std::string`/`unique_ptr` 是 UB;判準是 `std::is_trivially_copyable_v<T>`。面試安全解是逐元素 construct。進階優化:`if constexpr (std::is_trivially_copyable_v<T>)` 分支——trivial 走 memcpy,其餘逐個建構。**關鍵:講出「trivially copyable 才能 memcpy,否則逐元素 copy/move construct」。**

- **與 vector/array 的取捨 + C++26 `std::inplace_vector<T, N>`**
  要點:資料 inline 在物件內、零 heap allocation → HFT 場景不 malloc = 不觸發 latency spike;vs `std::array`:size 動態、push 時才建構;`capacity()`/`max_size()` 是 `static constexpr` 成員(編譯期常數,面試小亮點)。C++26 標準版(P0843)滿了 `push_back` 會 throw `std::bad_alloc`;另有 `try_push_back`(滿了回傳 `nullptr`、不 throw)和 `unchecked_push_back`(滿了是 UB,precondition)。注意:container 自身不 malloc,但 T 本身可能會——`std::string` 超過 SSO 容量時 data 仍在 heap,而 SSO 容量是**實作定義**(典型值:libstdc++ 15、libc++ 22、MSVC 15 chars)。**關鍵:「inplace_vector 保證的是 container 自身不 malloc,不是整體不 malloc。」**
