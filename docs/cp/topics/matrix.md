---
title: 弱項專題:矩陣快速冪(線性遞推/圖上計數)
tags: [矩陣]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:矩陣快速冪(線性遞推/圖上計數)

> 弱項專題懶人包(不等比賽,主動補):每題「技巧 + 作法 1–2 行」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **觸發辨識**:狀態維度小($d \lesssim 100$)+ 步數/長度巨大($10^9 \sim 10^{18}$)→ 矩陣快速冪 $O(d^3 \log n)$。看到「$n \le 10^{18}$ + 線性遞推/小寬度網格/小自動機」直接反射。
- **圖上計數**:走恰好 $k$ 步的路徑數 = 鄰接矩陣 $A^k$ 的 $(i,j)$ 元素。「長度 $k$ 的合法序列」常可建成小圖套此式。
- **只需結合律 ⇒ 廣義半環**:$(+,\times)$ 計數、$(\max/\min,+)$ 最長/最短路、$(\mathrm{OR},\mathrm{AND})$ 可達性(bitset 壓成 $n^3/64$)。換半環不換模板。
- **非齊次項 / 前綴和**:遞推含 $x$ 或常數 → 狀態向量補 $(x, 1)$ 兩維;要 $\sum_{d\le x} f(d)$ → 補一維累加器 $S$,轉移時 $S \mathrel{+}= f$。
- **指數上的遞推**:答案形如 $c^{w_n}$ 且模 $p$ 素數 → 指數 $w_n$ 要模 $\varphi(p)=p-1$(Fermat),**別模 $p$**。
- **易錯點**:乘法方向(行向量左乘 vs 列向量右乘)全程一致;快速冪初始化單位矩陣;$k=0,1$ 邊界;分段冪的段長 = 端點差(off-by-one)。

## 題目

- **[Xor-sequences (CF691E)](https://codeforces.com/problemset/problem/691/E)** `矩陣` `~1900`
  作法:建 $n\times n$ 0/1 矩陣 $M$($\mathrm{popcount}(a_i\oplus a_j)\equiv 0 \pmod 3$ 則為 1),答案 = $M^{k-1}$ 全元素和。圖上走 $k$ 步計數裸題,墊腳用。

- **[Okabe and El Psy Kongroo (CF821E)](https://codeforces.com/problemset/problem/821/E)** `矩陣` `~2100`
  作法:$y\in[0,15]$、每步 $y\to y\pm1/y$ ⇒ $16\times16$ 三對角轉移矩陣;每個線段依上界 $a_i$ 把超界行列清零,對段長做矩陣冪。**分段矩陣冪**代表題。

- **[Magic Gems (CF1117D)](https://codeforces.com/problemset/problem/1117/D)** `矩陣` `~2100`
  作法:每顆魔法寶石「不裂(占 1)或裂成 $m$ 顆(占 $m$)」⇒ $f(n)=f(n-1)+f(n-m)$;$m\le100$、$n\le10^{18}$,companion 矩陣 $m\times m$ 快速冪。

- **[Darth Vader and Tree (CF514E)](https://codeforces.com/problemset/problem/514/E)** `矩陣` `~2200`
  作法:$cnt[j]$ = 距離為 $j(\le100)$ 的子邊數,$f(d)=\sum_j cnt[j]\,f(d-j)$;求 $\sum_{d\le x}f(d)$ ⇒ 狀態補一維**前綴和**,$101\times101$ 矩陣冪。

- **[Sasha and Array (CF718C)](https://codeforces.com/problemset/problem/718/C)** `矩陣` `~2300`
  作法:每元素存向量 $(F(a_i),F(a_i-1))$,節點存向量和;區間加 $x$ = 懶標乘 Fibonacci 矩陣 $Q^x$。矩陣有結合律 ⇒ **可直接當線段樹 lazy**。

- **[Product Oriented Recurrence (CF1182E)](https://codeforces.com/problemset/problem/1182/E)** `矩陣` `~2300`
  作法:$f_x=c^{2x-6}f_{x-1}f_{x-2}f_{x-3}$ ⇒ 寫成 $f_n=c^{w}f_1^{a}f_2^{b}f_3^{d}$,四組**指數**各自線性遞推($w$ 的非齊次項 $2x-6$ 補 $(x,1)$ 維),指數模 $p-1=10^9+6$。

- **[Axel and Marston in Bitland (CF780F)](https://codeforces.com/problemset/problem/780/F)** `矩陣` `~2400`
  作法:$P[k][t]$ = 走 $2^k$ 步、型別模式固定的布林可達矩陣,$P[k+1][t]=P[k][t]\cdot P[k][1-t]$(bitset 乘法 $n^3/64$);再從高位往低位**貪心接塊**求最長路,超過 $10^{18}$ 輸出 $-1$。倍增 + 布林半環代表題。

- **[Smile House (CF147B)](https://codeforces.com/problemset/problem/147/B)** `矩陣` `~2500`
  作法:$(\max,+)$ 半環 + 每點加權 0 自環(允許墊步 ⇒「長度 $\le L$ 存在正閉走」對 $L$ 單調);正環存在 $\iff$ 某 $L\le n$ 時對角線出現正值,預存 $2^k$ 冪後倍增式二分最小 $L$。
