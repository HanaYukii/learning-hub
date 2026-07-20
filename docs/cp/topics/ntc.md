---
title: 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)
tags: [數論]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)

> 主題式整理:核心模板與觸發辨識,配 CF 2100–2500 經典題逐題「題意 + 作法」。

## 核心模板 / 觸發

- **逆元**:組合數題一律 $O(n)$ 預處理階乘 + 逆階乘;唯一要記的坑:$a \equiv 0$ 無逆元。
- **CRT 觸發**:出現「兩個互質的模」(典型:$p$ 與 $p-1$,指數走 $\bmod\ (p-1)$、底數走 $\bmod\ p$)→ 枚舉一邊餘數、CRT 合併成 $\bmod\ p(p-1)$ 的等差數列再計數。模不互質用 exCRT。
- **容斥 / Möbius 觸發**:看到「$\gcd = 1$ / 恰好 $k$ / 每行每列至少一個」→ 先算**寬鬆版**(至少/整除),再帶符號扣回:$[\gcd = 1] = \sum_{d \mid g} \mu(d)$;「恰好」=「至少」做差分。
- **期望技巧**:停時期望用 $E[L] = \sum_{k \ge 0} P(L > k)$ 展開,常配 Möbius 把 $P(\gcd > 1)$ 拆掉;無窮等比 $\sum_{k \ge 1} q^k = \frac{q}{1-q}$ 在模意義下直接成立。
- **生成函數觸發**:「$n$ 個獨立選擇的和的分布」= 多項式 $P(x)^n$ 的係數 → NTT + 重複平方,長度要蓋住最終次數上界。
- **積性觸發**:$f(n)$ 對 $n = \prod p_i^{e_i}$ 可拆 → 對每個質因子冪**獨立**算再相乘,把 $10^{15}$ 規模降成每個 $e \le 50$ 的小 DP。

## 題目

### [CF900D. Unusual Sequences](https://codeforces.com/problemset/problem/900/D)
`容斥` `~2000`(墊腳)

::: info 題意
給定兩個正整數 $x, y$($1 \le x, y \le 10^9$)。計數對象是長度任意($n \ge 1$)的正整數序列 $a_1, \dots, a_n$,要求 $\gcd(a_1, \dots, a_n) = x$ 且 $a_1 + \dots + a_n = y$;序列是有序的,同一組數的不同排列算不同序列。

求滿足條件的序列個數,模 $10^9+7$。

例:$x=1, y=3$:和為 $3$ 的組成共 $2^2=4$ 個($[3],[1,2],[2,1],[1,1,1]$),扣掉 $\gcd=3$ 的 $[3]$ → 答案 $3$;公式驗證:$\mu(1)\,2^2+\mu(3)\,2^0=4-1=3$。
:::

::: tip 作法
$x \nmid y$ 答案 $0$;否則令 $n = y/x$,對「和為 $n$ 的組成數 $2^{n-1}$」做 Möbius 反演:$ans = \sum_{d \mid n} \mu(d)\, 2^{n/d - 1}$;$n$ 大到 $10^9$,枚舉因數、單獨分解算 $\mu$。
:::

### [CF919E. Congruence Equation](https://codeforces.com/problemset/problem/919/E)
`數論` `~2100`

::: info 題意
給定整數 $a, b$ 與質數 $p$($1 \le a, b < p$,$2 \le p \le 10^6{+}3$),以及上界 $x \le 10^{12}$。

求有多少個正整數 $n \in [1, x]$ 滿足同餘方程 $n \cdot a^n \equiv b \pmod p$。輸出解的個數(答案不取模)。

例:$p=3, a=2, b=2, x=10$:逐一驗 $n \cdot 2^n \bmod 3$,解為 $n=1,2,7,8$ 共 $4$ 個——正是 $\bmod\ p(p-1)=6$ 的兩條等差數列 $n \equiv 1, 2 \pmod 6$。
:::

::: tip 作法
**枚舉 $r = n \bmod (p-1)$**(費馬:$a^n \equiv a^r$),解出 $n \equiv b \cdot a^{-r} \pmod p$,與 $n \equiv r \pmod{p-1}$ 用 CRT($p \perp p-1$)合併成 $\bmod\ p(p-1)$ 的等差數列,對每個 $r$ 數 $[1,x]$ 內解數。

```cpp
// sketch:枚舉 r = n mod (p-1),CRT 合併後數等差數列
long long ans = 0, M = 1LL * p * (p - 1);
for (int r = 0; r < p - 1; ++r) {
    long long c = b * pw(pw(a, r), p - 2) % p;  // n ≡ b·a^{-r} (mod p)
    long long n0 = crt(r, p - 1, c, p);         // 併 n ≡ r (mod p-1)
    if (n0 == 0) n0 = M;                        // 只要正整數解
    if (n0 <= x) ans += (x - n0) / M + 1;       // 數 [1,x] 內的項數
}
```
:::

### [CF559C. Gerald and Giant Chess](https://codeforces.com/problemset/problem/559/C)
`組合` `~2200`

::: info 題意
給定 $h \times w$ 的棋盤($1 \le h, w \le 10^5$)與 $n \le 2000$ 個黑格的座標 $(r_i, c_i)$,其餘格子都是白格,保證左上、右下角為白。

棋子從左上角出發,每步只能往右或往下走一格,且不能踏進黑格。

求走到右下角的路徑總數,模 $10^9+7$。

<svg viewBox="0 0 420 200" width="420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3×3 棋盤:黑格 (2,2) 擋住中路,合法路徑僅剩沿上緣與沿左緣兩條">
  <rect x="40" y="16" width="144" height="144" fill="var(--vp-c-default-soft)"/>
  <g stroke="currentColor" stroke-width="1" opacity="0.35">
    <line x1="40" y1="16" x2="184" y2="16"/>
    <line x1="40" y1="64" x2="184" y2="64"/>
    <line x1="40" y1="112" x2="184" y2="112"/>
    <line x1="40" y1="160" x2="184" y2="160"/>
    <line x1="40" y1="16" x2="40" y2="160"/>
    <line x1="88" y1="16" x2="88" y2="160"/>
    <line x1="136" y1="16" x2="136" y2="160"/>
    <line x1="184" y1="16" x2="184" y2="160"/>
  </g>
  <rect x="88" y="64" width="48" height="48" fill="currentColor" opacity="0.55"/>
  <polyline points="64,40 160,40 160,136" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="3"/>
  <polyline points="64,40 64,136 160,136" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="3" stroke-dasharray="5 4"/>
  <circle cx="64" cy="40" r="5" fill="var(--vp-c-brand-1)"/>
  <circle cx="160" cy="136" r="5" fill="var(--vp-c-brand-1)"/>
  <text x="212" y="44" font-size="12" fill="currentColor">起點 (1,1) → 終點 (3,3)</text>
  <text x="212" y="92" font-size="12" fill="currentColor">黑格 (2,2) 擋住中路</text>
  <text x="212" y="140" font-size="12" fill="currentColor">僅剩 2 條:沿上緣、沿左緣</text>
  <text x="112" y="186" text-anchor="middle" font-size="12" fill="currentColor">3×3 棋盤,只能往右/往下</text>
</svg>

例:$3 \times 3$ 棋盤、唯一黑格 $(2,2)$:總路數 $\binom{4}{2}=6$,經黑格的有 $\binom{2}{1}\binom{2}{1}=4$ 條 → 答案 $6-4=2$(沿上緣、沿左緣各一條)。
:::

::: tip 作法
黑格按 $(r,c)$ 排序做容斥 DP:$f_i = $(起點到 $i$ 的自由格路數)$- \sum_{j \preceq i} f_j \cdot \binom{\Delta r + \Delta c}{\Delta r}$,即**不經其他黑格首達 $i$**;終點視為第 $n{+}1$ 個黑格。

```cpp
// sketch:黑格按 (r,c) 排序後的容斥 DP;paths(...) = C(Δr+Δc, Δr)
sort(cell, cell + n);            // cell[n] = 右下角(視為第 n+1 個黑格)
for (int i = 0; i <= n; ++i) {
    f[i] = paths(1, 1, cell[i].r, cell[i].c);   // 起點 → i 的自由路數
    for (int j = 0; j < i; ++j)
        if (cell[j].c <= cell[i].c)             // 排序後 r 已保證不減
            f[i] -= f[j] * paths(cell[j].r, cell[j].c, cell[i].r, cell[i].c);
}
// f[n] 即答案:不經任何黑格首達右下角
```
:::

### [CF1097D. Makoto and a Blackboard](https://codeforces.com/problemset/problem/1097/D)
`數論` `~2200`

::: info 題意
黑板上寫著正整數 $n$($1 \le n \le 10^{15}$),另給操作次數 $k$($1 \le k \le 10^4$)。

每次操作:設當前黑板上的數為 $v$,從 $v$ 的所有因數(含 $1$ 與 $v$)中**等機率**挑一個取代 $v$;恰好執行 $k$ 次。

求最終黑板上數字的期望值,寫成最簡分數 $P/Q$ 後輸出 $P \cdot Q^{-1} \bmod (10^9+7)$。

例:$n=2, k=2$:第一步等機率變 $1$ 或 $2$;$1$ 不再動、$2$ 再走一步期望 $\frac{1+2}{2}=\frac32$ → $E=\frac12 \cdot 1+\frac12 \cdot \frac32=\frac54$。
:::

::: tip 作法
期望值對質因子**積性** → 對每個 $p^e$ 獨立:$dp_t[j]$ = $t$ 步後指數為 $j$ 的機率,從 $j$ 等機率掉到 $0..j$;答案為各質因子 $\sum_j dp_k[j]\, p^j$ 之積($e \le 50$)。

```cpp
// sketch:單一質因子 p^e 的指數 DP(機率用模逆元)
vector<Z> dp(e + 1, 0); dp[e] = 1;
for (int t = 0; t < k; ++t) {
    vector<Z> nx(e + 1, 0); Z suf = 0;
    for (int j = e; j >= 0; --j) {   // nx[j] = Σ_{j'≥j} dp[j']/(j'+1)
        suf += dp[j] * inv[j + 1];
        nx[j] = suf;                 // 從 j' 等機率掉到 0..j'
    }
    dp = nx;
}
Z contrib = 0;
for (int j = 0; j <= e; ++j) contrib += dp[j] * pw(p, j);
ans *= contrib;                      // 質因子間獨立 → 相乘(積性)
```
:::

### [CF785D. Anton and School - 2](https://codeforces.com/problemset/problem/785/D)
`組合` `~2300`

::: info 題意
給定只含 `(` 與 `)` 的括號串 $s$($1 \le |s| \le 2 \times 10^5$)。

定義 RSBS 為「前半全是 `(`、後半全是 `)`」的非空偶長度串,即 $k$ 個 `(` 接 $k$ 個 `)`($k \ge 1$),如 `((()))`;子序列以**選取的位置集合**區分,內容相同、位置不同也算不同。

求 $s$ 有多少個子序列是 RSBS,模 $10^9+7$。

例:`s = "(())"`:$k=1$ 有 $2 \times 2=4$ 個(兩個 `(` 各配兩個 `)`)、$k=2$ 有 $1$ 個 → 共 $5$;公式驗證:$\binom{2}{1}+\binom{3}{2}=2+3=5$。
:::

::: tip 作法
**固定每個 `(` 為所選的最後一個 `(`** 防重複:設其左邊(含自身)有 $a$ 個 `(`、右邊有 $b$ 個 `)`,貢獻 $\sum_t \binom{a-1}{t}\binom{b}{t+1}$,Vandermonde 收成 $\binom{a+b-1}{a}$。
:::

### [CF1139D. Steps to One](https://codeforces.com/problemset/problem/1139/D)
`數論` `~2300`

::: info 題意
給定整數 $m$($1 \le m \le 10^5$),從空陣列 $a$ 開始重複執行:從 $[1, m]$ 均勻隨機取一個整數接到 $a$ 尾端,接著計算 $a$ 全體的 $\gcd$,若等於 $1$ 就停止,否則回到取數步驟。

求停止時 $a$ 的期望長度,寫成最簡分數 $P/Q$ 後輸出 $P \cdot Q^{-1} \bmod (10^9+7)$。

例:$m=2$:$\gcd_k>1$ ⇔ 前 $k$ 抽全是 $2$,機率 $2^{-k}$ → $E=1+\sum_{k \ge 1}2^{-k}=2$;公式同得 $1-\mu(2)\cdot\frac{1/2}{1-1/2}=1+1=2$。
:::

::: tip 作法
$E = \sum_{k \ge 0} P(L > k) = 1 + \sum_{k \ge 1} P(\gcd_k > 1)$;Möbius 拆開 $P(d \mid \gcd_k) = q_d^k$($q_d = \lfloor m/d \rfloor / m$),對 $k$ 收等比,得 $E = 1 - \sum_{d \ge 2} \mu(d) \frac{q_d}{1 - q_d}$。
:::

### [CF1228E. Another Filling the Grid](https://codeforces.com/problemset/problem/1228/E)
`容斥` `~2300`

::: info 題意
給定 $n \times n$ 網格($1 \le n \le 250$)與整數 $k$($1 \le k \le 10^9$),每格要填一個 $1..k$ 之間的整數。

約束:每一行的最小值都是 $1$,且每一列的最小值也都是 $1$(等價於每行、每列都至少出現一個 $1$)。

求合法填法的總數,模 $10^9+7$。

例:$n=2, k=2$:每行至少一個 $1$ 有 $3^2=9$ 種,扣掉「某列全 $2$」的 $2$ 種(兩行同為 $(2,1)$ 或同為 $(1,2)$)→ $7$;公式驗證:$9-2\cdot 1+0=7$。
:::

::: tip 作法
對「不含 $1$ 的列數 $j$」容斥:$ans = \sum_{j=0}^{n} (-1)^j \binom{n}{j} \left[(k-1)^j \left(k^{n-j} - (k-1)^{n-j}\right)\right]^n$,中括號 = 單行方案(壞列全 $\ge 2$、其餘至少一個 $1$)。
:::

### [CF1096G. Lucky Tickets](https://codeforces.com/problemset/problem/1096/G)
`生成函數` `~2400`

::: info 題意
給定偶數 $n$($2 \le n \le 2 \times 10^5$)與 $k \le 10$ 個相異的十進位數字 $d_1, \dots, d_k$。

票號是恰好 $n$ 位、每一位都取自這 $k$ 個數字的串(若 $0$ 可用則允許前導零);一張票「幸運」定義為前 $n/2$ 位的數字和等於後 $n/2$ 位的數字和。

求幸運票號的總數,模 $998244353$。

例:$n=4$、數字集 $\{1,2\}$:半票(2 位)的和分布為 $2{:}1,\ 3{:}2,\ 4{:}1$(即 $P^2=x^2+2x^3+x^4$)→ 答案 $1^2+2^2+1^2=6$。
:::

::: tip 作法
令 $P(x) = \sum_{d \in D} x^d$,NTT 快速冪算 $Q = P^{n/2}$,答案 $= \sum_s \left([x^s]Q\right)^2$,即係數平方和;長度上界 $9n/2$。

```cpp
// sketch:NTT 快速冪 P(x)^(n/2),再收係數平方和
vector<Z> P(10, 0), Q{1};
for (int d : digits) P[d] = 1;
for (int e = n / 2; e; e >>= 1) {   // 重複平方,長度蓋住 9n/2
    if (e & 1) Q = mul(Q, P);       // mul = NTT 卷積
    P = mul(P, P);
}
Z ans = 0;
for (Z c : Q) ans += c * c;         // 前後半分布相同 → 係數平方和
```
:::
