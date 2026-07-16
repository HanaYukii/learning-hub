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
  題意:給定 $n$ 個整數 $a_1,\dots,a_n$ 與序列長度 $k$($1\le n\le100$,$0\le a_i\le10^{18}$,$1\le k\le10^{18}$)。
  稱 $x_1,\dots,x_k$ 為 xor-sequence:每一項都取自給定陣列(同值不同下標視為不同選擇),
  且相鄰兩項滿足 $\mathrm{popcount}(x_i\oplus x_{i+1})$ 為 3 的倍數。
  輸出:長度恰為 $k$ 的 xor-sequence 總數 mod $10^9+7$($k=1$ 時答案即為 $n$)。
  作法:$n\times n$ 0/1 矩陣 $M_{ij}=[\mathrm{popcount}(a_i\oplus a_j)\equiv 0 \pmod 3]$,答案 = $M^{k-1}$ 全元素和。圖上走 $k$ 步計數裸題,墊腳用。

- **[CF821E. Okabe and El Psy Kongroo](https://codeforces.com/problemset/problem/821/E)** `矩陣` `~2100`
  題意:從 $(0,0)$ 出發走到 $(k,0)$($1\le k\le10^{18}$),每步由 $(x,y)$ 走到 $(x{+}1,y{+}1)$、$(x{+}1,y)$ 或 $(x{+}1,y{-}1)$。
  給定 $n\le100$ 條水平線段:第 $i$ 條覆蓋 $a_i\le x\le b_i$、高度 $c_i$($0\le c_i\le15$),
  依序首尾相接($a_1=0$、$a_i=b_{i-1}$、$a_n\le k\le b_n$);$x$ 位於第 $i$ 段範圍內時必須保持 $0\le y\le c_i$。
  輸出:滿足所有限制的走法總數 mod $10^9+7$。
  作法:$16\times16$ 三對角轉移矩陣;每段把 $y>c_i$ 的行列清零,對段長做矩陣冪。**分段矩陣冪**代表題。

- **[CF1117D. Magic Gems](https://codeforces.com/problemset/problem/1117/D)** `矩陣` `~2100`
  題意:每顆魔法寶石占 1 單位空間,可選擇把它分裂成 $M$ 顆普通寶石(改占 $M$ 單位;普通寶石不可再分)。
  給定整數 $N,M$($1\le N\le10^{18}$,$2\le M\le100$),要選取若干魔法寶石並決定哪些分裂,使總占用空間恰為 $N$ 單位;
  取的魔法寶石數不同、或分裂的寶石下標集合不同,即視為不同組態。
  輸出:組態總數 mod $10^9+7$。
  作法:排成一列看首顆裂不裂 ⇒ $f(n)=f(n-1)+f(n-m)$,companion 矩陣 $m\times m$ 快速冪。

- **[CF514E. Darth Vader and Tree](https://codeforces.com/problemset/problem/514/E)** `矩陣` `~2200`
  題意:想像一棵無限有根樹:每個節點都恰有 $n$ 個小孩,且任何節點到自己第 $i$ 個小孩的邊長皆為 $d_i$。
  給定 $n$、距離上限 $x$ 與陣列 $d$($1\le n\le10^5$,$0\le x\le10^9$,$1\le d_i\le100$)。
  輸出:到根距離(路徑邊長總和)$\le x$ 的節點數 mod $10^9+7$。
  作法:壓成 $cnt[j]$ = 邊長為 $j(\le100)$ 的小孩數,$f(d)=\sum_j cnt[j]\,f(d-j)$;求 $\sum_{d\le x}f(d)$ ⇒ 狀態補一維**前綴和**,$101\times101$ 矩陣冪。

- **[CF718C. Sasha and Array](https://codeforces.com/problemset/problem/718/C)** `矩陣` `~2300`
  題意:給定長度 $n$ 的整數陣列 $a$($1\le n\le10^5$,$1\le a_i\le10^9$)與 $m\le10^5$ 筆操作。
  操作分兩種:`1 l r x` 將區間 $[l,r]$ 內每個 $a_i$ 加上 $x$($1\le x\le10^9$);
  `2 l r` 查詢 $\sum_{i=l}^{r}f(a_i)$,其中 $f$ 為 Fibonacci 數列($f(1)=f(2)=1$)。
  輸出:對每筆型別 2 的查詢輸出該和 mod $10^9+7$。
  作法:每元素存向量 $(F(a_i),F(a_i-1))$,線段樹節點存向量和;區間加 $x$ = 懶標乘 Fibonacci 矩陣 $Q^x$。矩陣有結合律 ⇒ **可直接當線段樹 lazy**。

- **[CF1182E. Product Oriented Recurrence](https://codeforces.com/problemset/problem/1182/E)** `矩陣` `~2300`
  題意:數列由遞推 $f_x=c^{2x-6}\cdot f_{x-1}\cdot f_{x-2}\cdot f_{x-3}$($x\ge4$)定義。
  給定五個整數 $n,f_1,f_2,f_3,c$($4\le n\le10^{18}$,$1\le f_1,f_2,f_3,c\le10^9$)。
  輸出:$f_n \bmod (10^9+7)$。
  作法:寫成 $f_n=c^{w}f_1^{a}f_2^{b}f_3^{d}$,四組**指數**各自線性遞推($w$ 的非齊次項 $2x-6$ 補 $(x,1)$ 維),指數模 $\varphi(p)=10^9+6$。

- **[CF780F. Axel and Marston in Bitland](https://codeforces.com/problemset/problem/780/F)** `矩陣` `~2400`
  題意:給定 $n$ 點 $m$ 邊的有向圖($1\le n\le500$,$0\le m\le2n^2$),每條邊為 P(步行)或 B(單車)型,允許重邊與自環,但(起點、終點、型別)三元組不重複。
  路線的型別序列由 Thue–Morse 式字串決定:從 P 開始反覆做 $s\to s+\bar s$($\bar s$ 為逐字元 P/B 互換),得 P, PB, PBBP, PBBPBPPB, …;
  從點 1 出發,第 $i$ 步必須走型別等於該字串第 $i$ 個字元的邊,無邊可走即終止。
  輸出:可走到的最長步數;若存在嚴格超過 $10^{18}$ 步的路線則輸出 $-1$。
  作法:$P[k][t]$ = 依模式走 $2^k$ 步的布林可達矩陣,$P[k+1][t]=P[k][t]\cdot P[k][1-t]$(bitset 乘法 $n^3/64$);再從高位往低位**貪心接塊**(接上一塊就翻轉 $t$)。倍增 + 布林半環代表題。

- **[CF147B. Smile House](https://codeforces.com/problemset/problem/147/B)** `矩陣` `~2500`
  題意:給定 $n$ 個房間與 $m$ 扇門,每扇門連接一對相異房間 $i,j$(任兩房間之間至多一扇門),並帶兩個方向權:
  從 $i$ 穿到 $j$ 心情加 $c_{ij}$、反向穿加 $c_{ji}$($-10^4\le c_{ij},c_{ji}\le10^4$,兩方向可不同)。
  問能否沿著某個環無限繞圈使心情無限上漲。
  輸出:若存在這種環,輸出繞一個週期需要經過的最少房間數;否則輸出 $0$。
  作法:$(\max,+)$ 半環 + 每點加權 0 自環(允許墊步 ⇒「長度 $\le L$ 存在正閉走」對 $L$ 單調);正環存在 $\iff$ 某 $L\le n$ 時對角線出現正值,預存 $2^k$ 冪後倍增式二分最小 $L$。
