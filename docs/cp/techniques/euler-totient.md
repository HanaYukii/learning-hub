---
title: 歐拉函數 φ / 積性函數線性篩(gcd 求和)
tags: [數論, 歐拉函數, 莫比烏斯]
why: φ 是 gcd 求和 / 互質計數 / 模冪降次的主力;與 μ 同屬「積性函數線性篩 + divisor transform」套件
trigger: 出現「與 n 互質的個數」「Σ gcd」「a^b mod m 且 b 巨大」「積性函數要對 1..N 全算」
problems:
  - { name: "gcd 求和 Σ_{i≤n} gcd(i,n) / Σ_{i,j} gcd(i,j) 型(divisor transform)", url: "", rating: 2100 }
reviewed: 2026-07-19
review_interval: 21
---

# 歐拉函數 φ / 積性函數線性篩

- **觸發**:「與 $n$ 互質的個數」、「$\sum\gcd$」、「$a^b\bmod m$ 且 $b$ 巨大(降次)」、或任何**積性函數**要對 $1\dots N$ 全算。與 [莫比烏斯](/cp/techniques/mobius-inversion) 是同一套 divisor-transform 工具。
- **定義 / 積性**:$\varphi(n)=\#\{1\le k\le n:\gcd(k,n)=1\}$;積性 $\varphi(ab)=\varphi(a)\varphi(b)\ (\gcd(a,b)=1)$,$\varphi(p^e)=p^e-p^{e-1}$。
- **兩條主identity**:
  - **除數和** $\displaystyle\sum_{d\mid n}\varphi(d)=n$(⇒ $\mathrm{id}=\varphi*\mathbf 1$,反過來 $\varphi=\mu*\mathrm{id}$,即 $\varphi(n)=\sum_{d\mid n}\mu(d)\,\tfrac nd$)。
  - **gcd 求和** $\displaystyle\sum_{i=1}^{n}\gcd(i,n)=\sum_{d\mid n}d\,\varphi\!\Big(\tfrac nd\Big)$(把 $i$ 依 $\gcd(i,n)=d$ 分類:恰 $\varphi(n/d)$ 個)。
- **複雜度**:線性篩 $O(N)$;divisor transform $O(N\log N)$。

```cpp
// 線性篩 φ(順便可篩質數 / μ,同一個框架)
vector<int> phi(N + 1), primes;
vector<char> comp(N + 1, 0);
phi[1] = 1;
for (int i = 2; i <= N; i++) {
    if (!comp[i]) { primes.push_back(i); phi[i] = i - 1; }   // 質數:φ(p)=p-1
    for (int p : primes) {
        if ((long long)i * p > N) break;
        comp[i * p] = 1;
        if (i % p == 0) { phi[i * p] = phi[i] * p; break; }   // p | i:φ(ip)=φ(i)·p
        phi[i * p] = phi[i] * (p - 1);                        // p∤i:積性 φ(ip)=φ(i)(p-1)
    }
}

// Σ_{i=1}^{n} gcd(i,n) = Σ_{d|n} d·φ(n/d)(單一 n:枚舉除數 O(√n))
long long gcd_sum(int n, const vector<int>& phi) {
    long long s = 0;
    for (int d = 1; (long long)d * d <= n; d++)
        if (n % d == 0) {
            s += (long long)d * phi[n / d];
            if (d != n / d) s += (long long)(n / d) * phi[d];
        }
    return s;
}
```

## 要點 / 易錯
- **線性篩 φ 的兩支**:`i%p==0` ⇒ `φ[i*p]=φ[i]*p`(此時 $p\mid i$,新質因子沒增加、只多一個 $p$ 冪 → 乘 $p$);否則 `φ[i*p]=φ[i]*(p-1)`(積性)。**這條和篩 μ 的分支結構一模一樣**,可同框架一起篩。
- **模冪降次(歐拉定理推廣)**:$a^b\equiv a^{\,b\bmod\varphi(m)+\varphi(m)}\pmod m$(當 $b\ge\log_2 m$;此式對 $\gcd(a,m)\ne1$ 也成立,不必互質)。指數塔 / $b$ 為巨大字串時必用。
- **$\varphi=\mu*\mathrm{id}$**:$\dfrac{\varphi(n)}{n}=\displaystyle\sum_{d\mid n}\dfrac{\mu(d)}{d}$——φ 與 μ 可互相導出,遇到 gcd 型和式兩者常可換算。
- **雙重 gcd 和** $\sum_{i=1}^n\sum_{j=1}^n\gcd(i,j)$:用 $\gcd=\sum_{d\mid\gcd}\varphi(d)$ 拆成 $\sum_d\varphi(d)\lfloor n/d\rfloor^2$,$O(N)$(或整除分塊 $O(\sqrt N)$)。
- 篩上界別只取詢問值——若要保留原生大值等,取到真正需要的 $N$。

## 例題 / 變形
- **gcd 求和** $\sum_{i\le n}\gcd(i,n)$:上面閉式;多詢問可整段預處理。
- **互質對 / 前綴互質數**:$\#\{i\le n:\gcd(i,n)=1\}=\varphi(n)$;$\sum_{i\le n}[\gcd(i,n)=1]$ 直接查。
- **$\sum_{i,j}\gcd(i,j)$ / $\sum \mathrm{lcm}$**:divisor transform + φ,常與 [μ 除數篩](/cp/techniques/mobius-inversion) 二選一或並用。
- **$a^{b}\bmod m$,$b$ 為超大數 / 指數塔**:$\varphi$ 降次遞迴。
