---
title: 弱項專題:矩陣快速冪(線性遞推/圖上計數)
tags: [矩陣]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:矩陣快速冪(線性遞推/圖上計數)

> 主題式整理:核心模板與觸發辨識,配 CF 2100–2500 經典題逐題「題意 + 作法」。

## 核心模板 / 觸發

- **觸發辨識**:狀態維度小($d \lesssim 100$)+ 步數/長度巨大($10^9 \sim 10^{18}$)→ 矩陣快速冪 $O(d^3 \log n)$。看到「$n \le 10^{18}$ + 線性遞推/小寬度網格/小自動機」直接反射。
- **圖上計數**:走恰好 $k$ 步的路徑數 = 鄰接矩陣 $A^k$ 的 $(i,j)$ 元素;「長度 $k$ 的合法序列」常可建成小圖套此式。
- **只需結合律 ⇒ 廣義半環**:$(+,\times)$ 計數、$(\max/\min,+)$ 最長/最短路、$(\mathrm{OR},\mathrm{AND})$ 可達性(bitset 壓成 $n^3/64$)。換半環不換模板。
- **非齊次項 / 前綴和**:遞推含 $x$ 或常數 → 狀態向量補 $(x, 1)$ 兩維;要 $\sum_{d\le x} f(d)$ → 補一維累加器 $S$,轉移時 $S \mathrel{+}= f$。
- **指數上的遞推**:答案形如 $c^{w_n}$ 且模 $p$ 素數 → 指數 $w_n$ 要模 $\varphi(p)=p-1$,**別模 $p$**。
- **易錯點**:乘法方向(行向量左乘 vs 列向量右乘)全程一致;分段冪的段長 = 端點差(off-by-one)。

## 題目

### [CF691E. Xor-sequences](https://codeforces.com/problemset/problem/691/E)
`矩陣` `~1900`

::: info 題意
給定 $n$ 個整數 $a_1,\dots,a_n$ 與序列長度 $k$($1\le n\le100$,$0\le a_i\le10^{18}$,$1\le k\le10^{18}$)。

稱 $x_1,\dots,x_k$ 為 xor-sequence:每一項都取自給定陣列(同值不同下標視為不同選擇),且相鄰兩項滿足 $\mathrm{popcount}(x_i\oplus x_{i+1})$ 為 3 的倍數。

輸出:長度恰為 $k$ 的 xor-sequence 總數 mod $10^9+7$($k=1$ 時答案即為 $n$)。

例:`a = [1, 7], k = 2` → $\mathrm{popcount}(1\oplus 7)=\mathrm{popcount}(6)=2$ 不是 3 的倍數,而 $x\oplus x=0$ 合法 → 長 2 的序列只有 $(1,1)$、$(7,7)$,答案 $2$。
:::

::: tip 作法
$n\times n$ 0/1 矩陣 $M_{ij}=[\mathrm{popcount}(a_i\oplus a_j)\equiv 0 \pmod 3]$,答案 = $M^{k-1}$ 全元素和。

圖上走 $k$ 步計數裸題,墊腳用。

```cpp
// sketch:建圖 + 矩陣冪
Mat M(n, n);
for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        M[i][j] = __builtin_popcountll(a[i] ^ a[j]) % 3 == 0;
Mat R = matpow(M, k - 1);                    // O(n^3 log k)
long long ans = 0;
for (auto& row : R) for (long long v : row) ans = (ans + v) % MOD;
// k = 1 時 R = I,全元素和 = n,自然吻合
```
:::

### [CF821E. Okabe and El Psy Kongroo](https://codeforces.com/problemset/problem/821/E)
`矩陣` `~2100`

::: info 題意
從 $(0,0)$ 出發走到 $(k,0)$($1\le k\le10^{18}$),每步由 $(x,y)$ 走到 $(x{+}1,y{+}1)$、$(x{+}1,y)$ 或 $(x{+}1,y{-}1)$。

給定 $n\le100$ 條水平線段:第 $i$ 條覆蓋 $a_i\le x\le b_i$、高度 $c_i$($0\le c_i\le15$),依序首尾相接($a_1=0$、$a_i=b_{i-1}$、$a_n\le k\le b_n$);$x$ 位於第 $i$ 段範圍內時必須保持 $0\le y\le c_i$。

<svg viewBox="0 0 560 220" width="560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="分段高度上限示意:每段內 0 ≤ y ≤ c_i,對每段的段長各做一次矩陣冪">
  <rect x="40" y="80" width="240" height="80" fill="var(--vp-c-default-soft)"/>
  <rect x="280" y="120" width="240" height="40" fill="var(--vp-c-default-soft)"/>
  <line x1="40" y1="80" x2="280" y2="80" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="280" y1="120" x2="520" y2="120" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="280" y1="74" x2="280" y2="160" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
  <line x1="40" y1="160" x2="520" y2="160" stroke="currentColor" stroke-width="1" opacity="0.6"/>
  <polyline points="40,160 120,120 200,80 280,120 360,120 440,160 520,160" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2"/>
  <circle cx="40" cy="160" r="4" fill="var(--vp-c-brand-1)"/>
  <circle cx="520" cy="160" r="4" fill="var(--vp-c-brand-1)"/>
  <text x="160" y="70" text-anchor="middle" font-size="12" fill="currentColor">段 1:c₁ = 2</text>
  <text x="400" y="110" text-anchor="middle" font-size="12" fill="currentColor">段 2:c₂ = 1</text>
  <text x="40" y="178" text-anchor="middle" font-size="12" fill="currentColor">x = 0</text>
  <text x="280" y="178" text-anchor="middle" font-size="12" fill="currentColor">b₁ = a₂</text>
  <text x="520" y="178" text-anchor="middle" font-size="12" fill="currentColor">x = k</text>
  <text x="280" y="204" text-anchor="middle" font-size="12" fill="currentColor">每段內須 0 ≤ y ≤ cᵢ;對每段的段長各做一次矩陣冪</text>
</svg>

輸出:滿足所有限制的走法總數 mod $10^9+7$。

例:`k=2`、單段 `c=1` → 高度序列 $(0,y_1,0)$ 只能取 $y_1\in\{0,1\}$:$0\to0\to0$ 與 $0\to1\to0$,共 $2$ 種。
:::

::: tip 作法
$16\times16$ 三對角轉移矩陣;每段把 $y>c_i$ 的行列清零,對段長做矩陣冪。

**分段矩陣冪**代表題。

```cpp
// sketch:分段矩陣冪(狀態 = 高度 y ∈ [0,15])
Vec v(16); v[0] = 1;                       // 從 (0,0) 出發
for (int i = 0; i < n && a[i] < k; i++) {
    Mat M = tridiag16();                   // M[y][y'] = [|y - y'| <= 1]
    for (int y = c[i] + 1; y < 16; y++)
        M.clear_row_col(y);                // 本段禁止 y > c_i
    long long len = min(b[i], k) - a[i];   // 段長 = 端點差(防 off-by-one)
    v = matpow(M, len) * v;
}
// 答案 = v[0](到達 (k, 0))
```
:::

### [CF1117D. Magic Gems](https://codeforces.com/problemset/problem/1117/D)
`矩陣` `~2100`

::: info 題意
每顆魔法寶石占 1 單位空間,可選擇把它分裂成 $M$ 顆普通寶石(改占 $M$ 單位;普通寶石不可再分)。

給定整數 $N,M$($1\le N\le10^{18}$,$2\le M\le100$),要選取若干魔法寶石並決定哪些分裂,使總占用空間恰為 $N$ 單位;取的魔法寶石數不同、或分裂的寶石下標集合不同,即視為不同組態。

輸出:組態總數 mod $10^9+7$。

例:`M=2, N=3` → 排成一列即把 3 拆成 1/2 的序列:$1{+}1{+}1$、$1{+}2$、$2{+}1$(2 = 分裂了的那顆),共 $3$ 種,吻合 $f(3)=f(2)+f(1)=2+1$。
:::

::: tip 作法
排成一列看首顆裂不裂 ⇒ $f(n)=f(n-1)+f(n-m)$,companion 矩陣 $m\times m$ 快速冪。
:::

### [CF514E. Darth Vader and Tree](https://codeforces.com/problemset/problem/514/E)
`矩陣` `~2200`

::: info 題意
想像一棵無限有根樹:每個節點都恰有 $n$ 個小孩,且任何節點到自己第 $i$ 個小孩的邊長皆為 $d_i$。

給定 $n$、距離上限 $x$ 與陣列 $d$($1\le n\le10^5$,$0\le x\le10^9$,$1\le d_i\le100$)。

輸出:到根距離(路徑邊長總和)$\le x$ 的節點數 mod $10^9+7$。

例:`n=2, d=[1,2], x=2` → 距離 $\le 2$ 的節點:根($0$)、兩個兒($1$ 與 $2$)、「$1{+}1$」的孫($2$);即 $f(0),f(1),f(2)=1,1,2$,答案 $4$。
:::

::: tip 作法
壓成 $cnt[j]$ = 邊長為 $j(\le100)$ 的小孩數,$f(d)=\sum_j cnt[j]\,f(d-j)$;求 $\sum_{d\le x}f(d)$ ⇒ 狀態補一維**前綴和**,$101\times101$ 矩陣冪。

```cpp
// sketch:補前綴和維的 101×101 矩陣
// 狀態 = (f(d), f(d-1), ..., f(d-99), S(d)),S(d) = Σ_{e≤d} f(e)
Mat A(101, 101);
for (int j = 1; j <= 100; j++) A[0][j-1] = cnt[j];   // f(d+1) = Σ cnt[j]·f(d+1-j)
for (int i = 1; i < 100; i++)  A[i][i-1] = 1;        // 舊 f 往下平移
A[100][100] = 1;                                     // S(d+1) = S(d) + f(d+1)
for (int j = 1; j <= 100; j++) A[100][j-1] = cnt[j]; //   (把新 f 的展開式抄進 S 那列)
// 答案 = A^x 作用初始向量後的 S 維
```
:::

### [CF718C. Sasha and Array](https://codeforces.com/problemset/problem/718/C)
`矩陣` `~2300`

::: info 題意
給定長度 $n$ 的整數陣列 $a$($1\le n\le10^5$,$1\le a_i\le10^9$)與 $m\le10^5$ 筆操作。

操作分兩種:`1 l r x` 將區間 $[l,r]$ 內每個 $a_i$ 加上 $x$($1\le x\le10^9$);`2 l r` 查詢 $\sum_{i=l}^{r}f(a_i)$,其中 $f$ 為 Fibonacci 數列($f(1)=f(2)=1$)。

輸出:對每筆型別 2 的查詢輸出該和 mod $10^9+7$。

例:`a=[1,2]` → 查全區間:$f(1)+f(2)=1+1=2$;做 `1 1 2 1` 後 $a=[2,3]$,再查:$f(2)+f(3)=1+2=3$。
:::

::: tip 作法
每元素存向量 $(F(a_i),F(a_i-1))$,線段樹節點存向量和;區間加 $x$ = 懶標乘 Fibonacci 矩陣 $Q^x$。

矩陣有結合律 ⇒ **可直接當線段樹 lazy**。

```cpp
// sketch:線段樹存 2 維向量和,lazy = 2×2 矩陣
struct Node { Vec2 s; Mat2 lz; bool has; };    // s = Σ (F(a_i), F(a_i-1))
void apply(int o, const Mat2& M) {
    t[o].s  = M * t[o].s;          // 線性 ⇒ 可直接作用在「向量和」上
    t[o].lz = M * t[o].lz;  t[o].has = true;
}
void add(int o, int l, int r, int ql, int qr, const Mat2& Qx) {
    if (ql <= l && r <= qr) return apply(o, Qx);   // Qx = Fib 矩陣 Q 的 x 次冪
    push_down(o); /* 遞迴兩子 */ pull_up(o);
}
// 查詢回傳區間向量和,答案取第一維 Σ F(a_i)
```
:::

### [CF1182E. Product Oriented Recurrence](https://codeforces.com/problemset/problem/1182/E)
`矩陣` `~2300`

::: info 題意
數列由遞推 $f_x=c^{2x-6}\cdot f_{x-1}\cdot f_{x-2}\cdot f_{x-3}$($x\ge4$)定義。

給定五個整數 $n,f_1,f_2,f_3,c$($4\le n\le10^{18}$,$1\le f_1,f_2,f_3,c\le10^9$)。

輸出:$f_n \bmod (10^9+7)$。

例:`f1=f2=1, f3=2, c=2` → $f_4=c^{2}f_3f_2f_1=4\cdot2=8$,$f_5=c^{4}f_4f_3f_2=16\cdot8\cdot2=256$。
:::

::: tip 作法
寫成 $f_n=c^{w}f_1^{a}f_2^{b}f_3^{d}$,四組**指數**各自線性遞推($w$ 的非齊次項 $2x-6$ 補 $(x,1)$ 維),指數模 $\varphi(p)=10^9+6$。
:::

### [CF780F. Axel and Marston in Bitland](https://codeforces.com/problemset/problem/780/F)
`矩陣` `~2400`

::: info 題意
給定 $n$ 點 $m$ 邊的有向圖($1\le n\le500$,$0\le m\le2n^2$),每條邊為 P(步行)或 B(單車)型,允許重邊與自環,但(起點、終點、型別)三元組不重複。

路線的型別序列由 Thue–Morse 式字串決定:從 P 開始反覆做 $s\to s+\bar s$($\bar s$ 為逐字元 P/B 互換),得 P, PB, PBBP, PBBPBPPB, …;從點 1 出發,第 $i$ 步必須走型別等於該字串第 $i$ 個字元的邊,無邊可走即終止。

輸出:可走到的最長步數;若存在嚴格超過 $10^{18}$ 步的路線則輸出 $-1$。

例:$n=2$,邊 $1\to2$(P)、$2\to1$(B)→ 型別串 PBBP…:走 $1\xrightarrow{P}2\xrightarrow{B}1$ 後,第 3 步需 B 而點 1 只有 P 邊 → 最長 $2$ 步。
:::

::: tip 作法
$P[k][t]$ = 依模式走 $2^k$ 步的布林可達矩陣,$P[k+1][t]=P[k][t]\cdot P[k][1-t]$(bitset 乘法 $n^3/64$);再從高位往低位**貪心接塊**(接上一塊就翻轉 $t$)。

倍增 + 布林半環代表題。

```cpp
// sketch:倍增表 + 由高位往低位貪心接塊(bitset 矩陣)
P[0][0] = adjP;  P[0][1] = adjB;            // 2^0 步
for (int k = 0; k < 61; k++) {
    P[k+1][0] = P[k][0] * P[k][1];          // s -> s + s̄(前半 t、後半 1-t)
    P[k+1][1] = P[k][1] * P[k][0];
}
Row cur; cur.set(1);                        // 目前可達點集(自點 1)
long long ans = 0;  int t = 0;
for (int k = 61; k >= 0; k--) {
    Row nxt = cur * P[k][t];                // 試著再走 2^k 步
    if (nxt.any()) { cur = nxt; ans += 1LL << k; t ^= 1; }  // 接上就翻轉 t
}
if (ans > (long long)1e18) ans = -1;
```
:::

### [CF147B. Smile House](https://codeforces.com/problemset/problem/147/B)
`矩陣` `~2500`

::: info 題意
給定 $n$ 個房間與 $m$ 扇門,每扇門連接一對相異房間 $i,j$(任兩房間之間至多一扇門),並帶兩個方向權:從 $i$ 穿到 $j$ 心情加 $c_{ij}$、反向穿加 $c_{ji}$($-10^4\le c_{ij},c_{ji}\le10^4$,兩方向可不同)。

問能否沿著某個環無限繞圈使心情無限上漲。

輸出:若存在這種環,輸出繞一個週期需要經過的最少房間數;否則輸出 $0$。

例:$n=2$,一扇門 $c_{12}=3$、$c_{21}=-1$ → 繞 $1\to2\to1$ 一圈心情 $+3-1=+2>0$,可無限上漲;週期經過 2 個房間且無更短的環 → 答案 $2$。
:::

::: tip 作法
$(\max,+)$ 半環 + 每點加權 0 自環(允許墊步 ⇒「長度 $\le L$ 存在正閉走」對 $L$ 單調);正環存在 $\iff$ 某 $L\le n$ 時對角線出現正值,預存 $2^k$ 冪後倍增式二分最小 $L$。

```cpp
// sketch:(max,+) 半環冪 + 倍增二分最小 L
// mul(A,B)[i][j] = max_k(A[i][k] + B[k][j]),不可達 = -INF
P[0] = adj;  for (int i = 0; i < n; i++) P[0][i][i] = 0;  // 0 自環 = 墊步
for (int k = 1; (1 << k) <= 2 * n; k++) P[k] = mul(P[k-1], P[k-1]);
Mat cur = ID;  int L = 0;               // ID:對角 0、其餘 -INF
for (int k = K; k >= 0; k--) {
    Mat nxt = mul(cur, P[k]);
    if (!pos_diag(nxt)) { cur = nxt; L += 1 << k; }  // 長度 L 仍無正閉走
}
// 最小正閉走長度 = L + 1;若 L + 1 > n 輸出 0
```
:::
