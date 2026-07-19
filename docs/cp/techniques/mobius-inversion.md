---
title: 莫比烏斯反演 / μ 除數篩(互質計數通法)
tags: [數論, 容斥, 莫比烏斯]
why: 「一堆數裡與 v 互質/不互質有幾個」的批次通法——把逐 v 的質因子容斥,用 μ 一次篩掉
trigger: 出現 gcd=1、互質、共質因子計數,且要對一整段 v(或一整批詢問)都算
problems:
  - { name: "LC BW184 Q4 Maximum Score with Co-Prime Element(coprime[v] 一次篩)", url: "https://leetcode.com/problems/maximum-score-with-co-prime-element/", rating: 2390 }
reviewed: 2026-07-19
review_interval: 21
---

# 莫比烏斯反演 / μ 除數篩

- **觸發**:題目出現 **gcd = 1 / 互質 / 共質因子計數**,而且要對「**一整段 $v$**」或「一整批詢問」都算(不是單一次)。單次可暴力分解 + 子集容斥;要**批次**就上 μ 除數篩。
- **核心恆等式**:$\displaystyle\sum_{d\mid n}\mu(d)=[\,n=1\,]$。代 $n=\gcd(x,v)$:

$$[\gcd(x,v)=1]=\sum_{d\mid \gcd(x,v)}\mu(d)=\sum_{d\mid v}\mu(d)\,[\,d\mid x\,].$$

  對 $x$ 求和、令 $\mathrm{cntDiv}[d]=\#\{x:d\mid x\}$,就得到**與 $v$ 互質的元素數**:

$$\mathrm{coprime}[v]=\sum_{d\mid v}\mu(d)\,\mathrm{cntDiv}[d],\qquad \mathrm{conflict}[v]=n-\mathrm{coprime}[v].$$

- **為何等價於「質因子容斥」**:$\mu(d)\ne 0$ 只在 $d$ **無平方因子**,即 $d$ 是 $v$ 的相異質因子的乘積;$\mu(d)=(-1)^{\#質因子}$ 正好給出容斥的奇加偶減。μ 只是把「對每個 $v$ 枚舉 $2^{\omega(v)}$ 個子集」**預先編碼**,順著倍數一次做完。
- **複雜度**:除數篩(對每個 $d$ 掃它的倍數)是 $\sum_d V/d=O(V\log V)$,一次得到**所有** $v$ 的答案;逐 $v$ 顯式容斥則是 $O\!\big(\sum_v 2^{\omega(v)}\big)$,適合只查少數 $v$。

```cpp
// 目標:對所有 v∈[1,V] 一次算出 coprime[v] / conflict[v]。V = max(maxVal, max(nums))
int V = /* ... */;

// 1) 線性篩 μ:i%p==0 時 μ[i·p]=0(p² 因子)並 break
vector<int> mu(V + 1), primes;
vector<char> comp(V + 1, 0);
mu[1] = 1;
for (int i = 2; i <= V; i++) {
    if (!comp[i]) { primes.push_back(i); mu[i] = -1; }
    for (int p : primes) {
        if ((long long)i * p > V) break;
        comp[i * p] = 1;
        if (i % p == 0) { mu[i * p] = 0; break; }
        mu[i * p] = -mu[i];
    }
}

// 2) cntDiv[d] = #{x : d | x}(調和篩)
vector<int> freq(V + 1, 0), cntDiv(V + 1, 0);
for (int x : nums) freq[x]++;
for (int d = 1; d <= V; d++)
    for (int m = d; m <= V; m += d) cntDiv[d] += freq[m];

// 3) coprime[v] = Σ_{d|v} μ(d)·cntDiv[d](divisor transform;跳過 μ=0 的 d)
vector<long long> coprime(V + 1, 0);
for (int d = 1; d <= V; d++) {
    if (mu[d] == 0) continue;
    for (int v = d; v <= V; v += d) coprime[v] += (long long)mu[d] * cntDiv[d];
}
// conflict[v] = n - coprime[v];  d=1 那項貢獻 μ(1)·cntDiv[1] = n,故 coprime 天然含全體再扣不互質
```

## 要點 / 易錯
- **只有 squarefree 的 $d$ 有貢獻**(`if (mu[d]==0) continue`)——這正是「只枚舉相異質因子子集」,不必真的做分解。
- **$d=1$ 的項** $\mu(1)\cdot\mathrm{cntDiv}[1]=n$:$\mathrm{coprime}$ 先含全部 $n$ 個,再被高階項扣成真正互質數。
- **$V$ 要取 $\max(maxVal,\max nums)$**:原生值可能 $>maxVal$,分解/篩的上界別只用 $maxVal$。
- **線性篩 μ 的關鍵行**:`i%p==0` ⇒ `μ[i*p]=0` 且 `break`($i$ 已含 $p$,$i\cdot p$ 有 $p^2$);否則 `μ[i*p]=-μ[i]`。
- **反演對(記著能雙向)**:$g(n)=\sum_{d\mid n}f(d)\iff f(n)=\sum_{d\mid n}\mu(n/d)\,g(d)$;倍數形亦然 $g(n)=\sum_{n\mid m}f(m)\iff f(n)=\sum_{n\mid m}\mu(m/n)g(m)$。
- 只查**單一** $v$(或極少)時別篩全域——直接 `factorize(v)` + 枚舉 $2^{\omega}$ 子集更省(見下)。$v\le10^5$ 時 $\omega(v)\le 6$($2\cdot3\cdot5\cdot7\cdot11\cdot13=30030$)。

## 手動版(單點查詢,不預篩)
```cpp
// conflict(v) = 與 v 不互質的元素數;spf = 最小質因子表
auto conflict = [&](int v) {
    vector<int> ps;                                   // v 的相異質因子
    for (int t = v; t > 1;) { int p = spf[t]; ps.push_back(p); while (t % p == 0) t /= p; }
    int k = ps.size(); long long tot = 0;
    for (int mask = 1; mask < (1 << k); mask++) {      // 非空子集容斥
        long long prod = 1; int bits = __builtin_popcount(mask);
        for (int b = 0; b < k; b++) if (mask >> b & 1) prod *= ps[b];
        tot += (bits & 1 ? cntDiv[prod] : -cntDiv[prod]);
    }
    return tot;                                        // = n - coprime(v)
};
```

## 例題 / 變形
- [LC BW184 Q4 Maximum Score with Co-Prime Element](https://leetcode.com/problems/maximum-score-with-co-prime-element/) `LC~2390` — 對所有 $v$ 求 $\mathrm{conflict}[v]$,再配「改動成本三型」取 $\max$。見 [6 月月報](/cp/leetcode/2026-06)。
- **互質對計數** $\sum_{i<j}[\gcd(a_i,a_j)=1]$:同一招,$\mathrm{cntDiv}[d]$ 換成「值被 $d$ 整除的個數」,答案 $=\sum_d\mu(d)\binom{\mathrm{cntDiv}[d]}{2}$。
- **gcd 求和 / lcm 求和** $\sum_{i,j}\gcd(i,j)$:$\gcd=\sum_{d\mid\gcd}\varphi(d)$ 或用 μ 拆;同屬 divisor transform。
- **squarefree / 無平方因子計數**:直接 $\sum_d\mu(d)\lfloor N/d^2\rfloor$。
