---
title: 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)
tags: [數論]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)

> 弱項專題懶人包(不等比賽,主動補):每題「技巧 + 作法 1–2 行」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **逆元**:模質數 $p$ 下除法一律轉乘法,$a^{-1} = a^{p-2} \bmod p$(費馬小定理)。組合數題**預處理階乘 + 逆階乘** $O(n)$:先算 $fact$,再 $ifact[n] = fact[n]^{p-2}$,倒推 $ifact[i] = ifact[i+1]\cdot(i+1)$。易錯:$a \equiv 0$ 無逆元;減法後記得 `((x % p) + p) % p`。
- **CRT 觸發**:出現「兩個互質的模」(典型:$p$ 與 $p-1$,指數走 $\bmod\ (p-1)$、底數走 $\bmod\ p$)→ 枚舉一邊餘數、CRT 合併成 $\bmod\ p(p-1)$ 的等差數列再計數。模不互質用 exCRT(exgcd 合併,無解判 $\gcd \nmid$ 差)。
- **容斥 / Möbius 觸發**:看到「$\gcd = 1$ / 恰好 $k$ / 每行每列至少一個」→ 先算**寬鬆版**(至少/整除),再帶符號扣回。核心式:$[\gcd = 1] = \sum_{d \mid g} \mu(d)$;「恰好」=「至少」做差分或直接 $\sum (-1)^i \binom{n}{i} (\cdot)$。易錯:$\mu$ 要線性篩預處理;容斥項的符號與邊界($i=0$ 項)最常錯。
- **期望技巧**:停時期望用 $E[L] = \sum_{k \ge 0} P(L > k)$ 展開,常配 Möbius 把 $P(\gcd > 1)$ 拆掉;無窮等比 $\sum_{k \ge 1} q^k = \frac{q}{1-q}$ 在模意義下直接用逆元算。
- **生成函數觸發**:「$n$ 個獨立選擇的和的分布」= 多項式 $P(x)^n$ 的係數 → NTT(模 $998244353$,原根 $3$)+ 快速冪式重複平方。易錯:每次乘法前 resize 到 $2$ 的冪、長度要蓋住最終次數上界。
- **積性觸發**:$f(n)$ 對 $n = \prod p_i^{e_i}$ 可拆 → 對每個質因子冪**獨立**算再相乘(期望/計數皆適用),把 $10^{15}$ 規模問題降成每個 $e \le 50$ 的小 DP。

## 題目

- **[Unusual Sequences (CF900D)](https://codeforces.com/problemset/problem/900/D)** `容斥` `~2000`(墊腳)
  作法:求和為 $y$、$\gcd = x$ 的序列數。$x \nmid y$ 答案 $0$;否則令 $n = y/x$,組成數(compositions)共 $2^{n-1}$,Möbius 反演:$ans = \sum_{d \mid n} \mu(d)\, 2^{n/d - 1}$。$n$ 大到 $10^9$ 就枚舉因數、單獨分解算 $\mu$。
- **[Congruence Equation (CF919E)](https://codeforces.com/problemset/problem/919/E)** `數論` `~2100`
  作法:數 $n \le x$ 使 $n \cdot a^n \equiv b \pmod p$。枚舉 $r = n \bmod (p-1)$(費馬:$a^n \equiv a^r$),解出 $n \equiv b \cdot a^{-r} \pmod p$,與 $n \equiv r \pmod{p-1}$ 用 CRT($p \perp p-1$)合併成 $\bmod\ p(p-1)$,對每個 $r$ 數 $[1,x]$ 內解數。
- **[Gerald and Giant Chess (CF559C)](https://codeforces.com/problemset/problem/559/C)** `組合` `~2200`
  作法:格路計數 $\binom{h+w-2}{h-1}$ + 容斥 DP:黑格按 $(r,c)$ 排序,$f_i = $(起點到 $i$ 的全部路徑)$- \sum_{j \preceq i} f_j \cdot \binom{\Delta r + \Delta c}{\Delta r}$($f_i$ = 不經其他黑格先到 $i$)。階乘逆元預處理到 $2 \times 10^5$。
- **[Makoto and a Blackboard (CF1097D)](https://codeforces.com/problemset/problem/1097/D)** `數論` `~2200`
  作法:$k$ 次「均勻隨機換成一個因數」後的期望值是**積性**的 → 對每個 $p^e$ 獨立:$dp_t[j]$ = $t$ 步後指數為 $j$ 的機率,轉移為從 $j$ 均勻掉到 $0..j$(乘 $inv(j+1)$),貢獻 $\sum_j dp_k[j]\, p^j$,各質因子相乘。
- **[Anton and School - 2 (CF785D)](https://codeforces.com/problemset/problem/785/D)** `組合` `~2300`
  作法:數形如 `(((...)))` 的子序列。**固定每個 `(` 為所選的最後一個 `(`** 防重複計數:設其左邊(含自身)有 $a$ 個 `(`、右邊有 $b$ 個 `)`,貢獻 $\sum_t \binom{a-1}{t}\binom{b}{t+1}$,用 Vandermonde 收成 $\binom{a+b-1}{a}$。
- **[Steps to One (CF1139D)](https://codeforces.com/problemset/problem/1139/D)** `數論` `~2300`
  作法:期望長度 $E = \sum_{k \ge 0} P(L > k) = 1 + \sum_{k \ge 1} P(\gcd_k > 1)$;Möbius:$P(d \mid \gcd_k) = (\lfloor m/d \rfloor / m)^k$,對 $k$ 求無窮等比和 $\frac{q_d}{1 - q_d}$,得 $E = 1 - \sum_{d \ge 2} \mu(d) \frac{q_d}{1 - q_d}$(全程模逆元)。
- **[Another Filling the Grid (CF1228E)](https://codeforces.com/problemset/problem/1228/E)** `容斥` `~2300`
  作法:$n \times n$ 填 $1..k$,每行每列都要有 $1$。對「禁止出現 $1$ 的列數 $j$」容斥:$ans = \sum_{j=0}^{n} (-1)^j \binom{n}{j} \left[(k-1)^j \left(k^{n-j} - (k-1)^{n-j}\right)\right]^n$(中括號 = 單行方案:壞列全 $\ge 2$,好列至少一個 $1$)。
- **[Lucky Tickets (CF1096G)](https://codeforces.com/problemset/problem/1096/G)** `生成函數` `~2400`
  作法:可用數字集 $D$,票長 $n$;令 $P(x) = \sum_{d \in D} x^d$,算 $Q = P^{n/2}$(NTT + 重複平方,模 $998244353$),答案 $= \sum_s \left([x^s]Q\right)^2$,即係數平方和。多項式長度上界 $9n/2$。
