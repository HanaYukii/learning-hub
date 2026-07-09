---
title: 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)
tags: [數論]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:數論與組合(逆元/CRT/容斥/生成函數)

> 弱項專題懶人包(不等比賽,主動補):每題「題意 + 核心作法」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **逆元**:組合數題一律 $O(n)$ 預處理階乘 + 逆階乘;唯一要記的坑:$a \equiv 0$ 無逆元。
- **CRT 觸發**:出現「兩個互質的模」(典型:$p$ 與 $p-1$,指數走 $\bmod\ (p-1)$、底數走 $\bmod\ p$)→ 枚舉一邊餘數、CRT 合併成 $\bmod\ p(p-1)$ 的等差數列再計數。模不互質用 exCRT。
- **容斥 / Möbius 觸發**:看到「$\gcd = 1$ / 恰好 $k$ / 每行每列至少一個」→ 先算**寬鬆版**(至少/整除),再帶符號扣回:$[\gcd = 1] = \sum_{d \mid g} \mu(d)$;「恰好」=「至少」做差分。
- **期望技巧**:停時期望用 $E[L] = \sum_{k \ge 0} P(L > k)$ 展開,常配 Möbius 把 $P(\gcd > 1)$ 拆掉;無窮等比 $\sum_{k \ge 1} q^k = \frac{q}{1-q}$ 在模意義下直接成立。
- **生成函數觸發**:「$n$ 個獨立選擇的和的分布」= 多項式 $P(x)^n$ 的係數 → NTT + 重複平方,長度要蓋住最終次數上界。
- **積性觸發**:$f(n)$ 對 $n = \prod p_i^{e_i}$ 可拆 → 對每個質因子冪**獨立**算再相乘,把 $10^{15}$ 規模降成每個 $e \le 50$ 的小 DP。

## 題目

- **[CF900D. Unusual Sequences](https://codeforces.com/problemset/problem/900/D)** `容斥` `~2000`(墊腳)
  題意:數長度任意的正整數序列,使 $\gcd = x$ 且總和 $= y$($x, y \le 10^9$),模 $10^9+7$。
  作法:$x \nmid y$ 答案 $0$;否則令 $n = y/x$,對「和為 $n$ 的組成數 $2^{n-1}$」做 Möbius 反演:$ans = \sum_{d \mid n} \mu(d)\, 2^{n/d - 1}$;$n$ 大到 $10^9$,枚舉因數、單獨分解算 $\mu$。
- **[CF919E. Congruence Equation](https://codeforces.com/problemset/problem/919/E)** `數論` `~2100`
  題意:給 $a, b$、質數 $p \le 10^6{+}3$ 與 $x \le 10^{12}$,數有多少 $n \in [1, x]$ 滿足 $n \cdot a^n \equiv b \pmod p$。
  作法:**枚舉 $r = n \bmod (p-1)$**(費馬:$a^n \equiv a^r$),解出 $n \equiv b \cdot a^{-r} \pmod p$,與 $n \equiv r \pmod{p-1}$ 用 CRT($p \perp p-1$)合併成 $\bmod\ p(p-1)$ 的等差數列,對每個 $r$ 數 $[1,x]$ 內解數。
- **[CF559C. Gerald and Giant Chess](https://codeforces.com/problemset/problem/559/C)** `組合` `~2200`
  題意:$h \times w$ 棋盤($h, w \le 10^5$)上有 $n \le 2000$ 個黑格,從左上只往右/下走到右下、不踩黑格,數路徑模 $10^9+7$。
  作法:黑格按 $(r,c)$ 排序做容斥 DP:$f_i = $(起點到 $i$ 的自由格路數)$- \sum_{j \preceq i} f_j \cdot \binom{\Delta r + \Delta c}{\Delta r}$,即**不經其他黑格首達 $i$**;終點視為第 $n{+}1$ 個黑格。
- **[CF1097D. Makoto and a Blackboard](https://codeforces.com/problemset/problem/1097/D)** `數論` `~2200`
  題意:黑板上寫著 $n \le 10^{15}$,執行 $k \le 10^4$ 次「把當前值 $v$ 等機率換成 $v$ 的某個因數」,求最終值的期望模 $10^9+7$。
  作法:期望值對質因子**積性** → 對每個 $p^e$ 獨立:$dp_t[j]$ = $t$ 步後指數為 $j$ 的機率,從 $j$ 等機率掉到 $0..j$;答案為各質因子 $\sum_j dp_k[j]\, p^j$ 之積($e \le 50$)。
- **[CF785D. Anton and School - 2](https://codeforces.com/problemset/problem/785/D)** `組合` `~2300`
  題意:給括號串 $s$($|s| \le 2 \times 10^5$),數其子序列中形如「$k$ 個 `(` 接 $k$ 個 `)`」的個數,模 $10^9+7$。
  作法:**固定每個 `(` 為所選的最後一個 `(`** 防重複:設其左邊(含自身)有 $a$ 個 `(`、右邊有 $b$ 個 `)`,貢獻 $\sum_t \binom{a-1}{t}\binom{b}{t+1}$,Vandermonde 收成 $\binom{a+b-1}{a}$。
- **[CF1139D. Steps to One](https://codeforces.com/problemset/problem/1139/D)** `數論` `~2300`
  題意:從 $[1, m]$($m \le 10^5$)均勻隨機抽數依序加入陣列,直到全體 $\gcd = 1$ 停止;求期望長度模 $10^9+7$。
  作法:$E = \sum_{k \ge 0} P(L > k) = 1 + \sum_{k \ge 1} P(\gcd_k > 1)$;Möbius 拆開 $P(d \mid \gcd_k) = q_d^k$($q_d = \lfloor m/d \rfloor / m$),對 $k$ 收等比,得 $E = 1 - \sum_{d \ge 2} \mu(d) \frac{q_d}{1 - q_d}$。
- **[CF1228E. Another Filling the Grid](https://codeforces.com/problemset/problem/1228/E)** `容斥` `~2300`
  題意:$n \times n$ 網格($n \le 250$)每格填 $1..k$($k \le 10^9$),要求每行、每列的最小值都是 $1$,計數模 $10^9+7$。
  作法:對「不含 $1$ 的列數 $j$」容斥:$ans = \sum_{j=0}^{n} (-1)^j \binom{n}{j} \left[(k-1)^j \left(k^{n-j} - (k-1)^{n-j}\right)\right]^n$,中括號 = 單行方案(壞列全 $\ge 2$、其餘至少一個 $1$)。
- **[CF1096G. Lucky Tickets](https://codeforces.com/problemset/problem/1096/G)** `生成函數` `~2400`
  題意:票號恰 $n$ 位($n \le 2 \times 10^5$、偶數),每位只能用給定的 $k \le 10$ 種數字;數「前 $n/2$ 位和 = 後 $n/2$ 位和」的票數,模 $998244353$。
  作法:令 $P(x) = \sum_{d \in D} x^d$,NTT 快速冪算 $Q = P^{n/2}$,答案 $= \sum_s \left([x^s]Q\right)^2$,即係數平方和;長度上界 $9n/2$。
