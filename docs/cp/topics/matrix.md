---
title: 弱項專題:矩陣快速冪(線性遞推/圖上計數)
tags: [矩陣]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:矩陣快速冪(線性遞推/圖上計數)

> 弱項專題懶人包(不等比賽,主動補):每題「題意 + 核心作法」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **觸發辨識**:狀態維度小($d \lesssim 100$)+ 步數/長度巨大($10^9 \sim 10^{18}$)→ 矩陣快速冪 $O(d^3 \log n)$。看到「$n \le 10^{18}$ + 線性遞推/小寬度網格/小自動機」直接反射。
- **圖上計數**:走恰好 $k$ 步的路徑數 = 鄰接矩陣 $A^k$ 的 $(i,j)$ 元素;「長度 $k$ 的合法序列」常可建成小圖套此式。
- **只需結合律 ⇒ 廣義半環**:$(+,\times)$ 計數、$(\max/\min,+)$ 最長/最短路、$(\mathrm{OR},\mathrm{AND})$ 可達性(bitset 壓成 $n^3/64$)。換半環不換模板。
- **非齊次項 / 前綴和**:遞推含 $x$ 或常數 → 狀態向量補 $(x, 1)$ 兩維;要 $\sum_{d\le x} f(d)$ → 補一維累加器 $S$,轉移時 $S \mathrel{+}= f$。
- **指數上的遞推**:答案形如 $c^{w_n}$ 且模 $p$ 素數 → 指數 $w_n$ 要模 $\varphi(p)=p-1$,**別模 $p$**。
- **易錯點**:乘法方向(行向量左乘 vs 列向量右乘)全程一致;分段冪的段長 = 端點差(off-by-one)。

## 題目

- **[CF691E. Xor-sequences](https://codeforces.com/problemset/problem/691/E)** `矩陣` `~1900`
  題意:給 $n\le100$ 個數($a_i\le10^{18}$),數長度 $k\le10^{18}$ 的序列:每項取自陣列(同值不同下標算不同),相鄰兩項 XOR 的 popcount 是 3 的倍數,mod $10^9+7$。
  作法:$n\times n$ 0/1 矩陣 $M_{ij}=[\mathrm{popcount}(a_i\oplus a_j)\equiv 0 \pmod 3]$,答案 = $M^{k-1}$ 全元素和。圖上走 $k$ 步計數裸題,墊腳用。

- **[CF821E. Okabe and El Psy Kongroo](https://codeforces.com/problemset/problem/821/E)** `矩陣` `~2100`
  題意:從 $(0,0)$ 走到 $(k,0)$($k\le10^{18}$),每步 $x{+}1$、$y$ 變化 $\pm1/0$;$n\le100$ 段水平線段依序覆蓋 $x$ 軸,位於第 $i$ 段時須 $0\le y\le c_i\le 15$,求走法數 mod $10^9+7$。
  作法:$16\times16$ 三對角轉移矩陣;每段把 $y>c_i$ 的行列清零,對段長做矩陣冪。**分段矩陣冪**代表題。

- **[CF1117D. Magic Gems](https://codeforces.com/problemset/problem/1117/D)** `矩陣` `~2100`
  題意:魔法寶石占 1 格,或裂成 $m$ 顆普通寶石占 $m$ 格($2\le m\le100$);求湊出恰好 $N\le10^{18}$ 格的方案數(取幾顆、裂哪些皆區分),mod $10^9+7$。
  作法:排成一列看首顆裂不裂 ⇒ $f(n)=f(n-1)+f(n-m)$,companion 矩陣 $m\times m$ 快速冪。

- **[CF514E. Darth Vader and Tree](https://codeforces.com/problemset/problem/514/E)** `矩陣` `~2200`
  題意:無限有根樹,每節點都有 $n\le10^5$ 個小孩、到第 $i$ 個小孩的邊長 $d_i\le100$;求到根距離 $\le x$($x\le10^9$)的節點數 mod $10^9+7$。
  作法:壓成 $cnt[j]$ = 邊長為 $j(\le100)$ 的小孩數,$f(d)=\sum_j cnt[j]\,f(d-j)$;求 $\sum_{d\le x}f(d)$ ⇒ 狀態補一維**前綴和**,$101\times101$ 矩陣冪。

- **[CF718C. Sasha and Array](https://codeforces.com/problemset/problem/718/C)** `矩陣` `~2300`
  題意:長 $n\le10^5$ 的陣列、$m\le10^5$ 次操作:區間整體加 $x$,或查詢區間 $\sum F(a_i)$($F$ 為 Fibonacci),mod $10^9+7$。
  作法:每元素存向量 $(F(a_i),F(a_i-1))$,線段樹節點存向量和;區間加 $x$ = 懶標乘 Fibonacci 矩陣 $Q^x$。矩陣有結合律 ⇒ **可直接當線段樹 lazy**。

- **[CF1182E. Product Oriented Recurrence](https://codeforces.com/problemset/problem/1182/E)** `矩陣` `~2300`
  題意:$f_x=c^{2x-6}\,f_{x-1}f_{x-2}f_{x-3}$,給 $n\le10^{18}$ 與 $f_1,f_2,f_3,c\le10^9$,求 $f_n \bmod 10^9+7$。
  作法:寫成 $f_n=c^{w}f_1^{a}f_2^{b}f_3^{d}$,四組**指數**各自線性遞推($w$ 的非齊次項 $2x-6$ 補 $(x,1)$ 維),指數模 $\varphi(p)=10^9+6$。

- **[CF780F. Axel and Marston in Bitland](https://codeforces.com/problemset/problem/780/F)** `矩陣` `~2400`
  題意:$n\le500$ 點有向圖,邊分 P/B 兩型($m\le2n^2$);第 $i$ 步必走的型別由 Thue–Morse 式字串($s\to s+\bar s$:P, PB, PBBP, …)決定,從點 1 出發求最長可走步數,超過 $10^{18}$ 輸出 $-1$。
  作法:$P[k][t]$ = 依模式走 $2^k$ 步的布林可達矩陣,$P[k+1][t]=P[k][t]\cdot P[k][1-t]$(bitset 乘法 $n^3/64$);再從高位往低位**貪心接塊**(接上一塊就翻轉 $t$)。倍增 + 布林半環代表題。

- **[CF147B. Smile House](https://codeforces.com/problemset/problem/147/B)** `矩陣` `~2500`
  題意:$n$ 個房間、$m$ 扇門,穿門 $i\to j$ 心情加 $c_{ij}$(兩方向權可不同,$|c|\le10^4$);問能否沿環無限漲心情,能則輸出最短正權環的房間數,否則輸出 0。
  作法:$(\max,+)$ 半環 + 每點加權 0 自環(允許墊步 ⇒「長度 $\le L$ 存在正閉走」對 $L$ 單調);正環存在 $\iff$ 某 $L\le n$ 時對角線出現正值,預存 $2^k$ 冪後倍增式二分最小 $L$。
