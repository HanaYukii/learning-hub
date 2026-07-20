---
title: 組合・計數期望(艱深)
track: math
category: combinatorics
reviewed: 2026-07-01
review_interval: 21
---

# 組合・計數期望(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

- **從 $(0,0)$ 走到 $(n,n)$、只往右/上、且不越過對角線 $y=x$ 的路徑數?(等價:$n$ 對括號的合法排列數、$n+1$ 葉二元樹數)**
  <details><summary>技巧+答案</summary>

  技巧:反射原理(André)/ Catalan 遞迴 $C_{n}=\sum_{k}C_kC_{n-1-k}$;**答案/關鍵:$C_n=\dfrac{1}{n+1}\dbinom{2n}{n}=\dbinom{2n}{n}-\dbinom{2n}{n+1}$**。

  </details>

- **開票 $A$ 得 $p$ 票、$B$ 得 $q$ 票($p>q$),隨機順序下 $A$ 全程嚴格領先的機率?(Bertrand 選票問題)**
  <details><summary>技巧+答案</summary>

  技巧:反射原理 / 循環引理(cycle lemma),把「首步計 $A$ 且不觸零」的路徑計數;**答案/關鍵:$\dfrac{p-q}{p+q}$(僅取決於差與和,與 Catalan 反射同源)**。

  </details>

- **隨機亂數排列 $n$ 個信封,無人拿到自己那封的機率?(錯排 derangement)**
  <details><summary>技巧+答案</summary>

  技巧:容斥 $D_n=n!\sum_{k=0}^n\frac{(-1)^k}{k!}$,取極限;**答案/關鍵:機率 $=\sum_{k=0}^n\frac{(-1)^k}{k!}\to e^{-1}\approx0.3679$,且 $D_n$ 為最接近 $n!/e$ 的整數**。

  </details>

- **隨機排列的固定點(fixed points)個數期望與變異數?**
  <details><summary>技巧+答案</summary>

  技巧:指示變數 $X=\sum_i\mathbf 1[\sigma(i)=i]$,單點 $P=1/n$,計 $E[X^2]$ 需兩兩相關項;**答案/關鍵:$E[X]=1$、$\mathrm{Var}(X)=1$($n\ge2$ 恆成立);$X$ 依分布收斂到 $\mathrm{Poisson}(1)$,恰 $k$ 個機率 $\to e^{-1}/k!$**。

  </details>

- **$n$ 人隨機戴回帽子,恰 $k$ 人拿對的機率?再問「至少一人拿對」的機率極限?**
  <details><summary>技巧+答案</summary>

  技巧:選出 $k$ 個對位者、其餘錯排 $D_{n-k}$;**答案/關鍵:$P(k)=\dbinom{n}{k}\dfrac{D_{n-k}}{n!}=\dfrac{D_{n-k}}{k!\,(n-k)!}\to\dfrac{e^{-1}}{k!}$;至少一人拿對 $\to 1-e^{-1}\approx0.632$**。

  </details>

- **隨機排列的循環(cycle)個數期望?**
  <details><summary>技巧+答案</summary>

  技巧:寫成 Feller 耦合/標準循環形式,依序放入元素 $i$「開新循環」機率 $1/i$;**答案/關鍵:$E=\sum_{i=1}^n\frac1i=H_n\approx\ln n+\gamma$(且長度 $k$ 之循環數期望恰 $1/k$,漸近獨立 $\mathrm{Poisson}(1/k)$)**。

  </details>

- **逐一讀入 $n$ 個相異數,出現「刷新到目前最大」(record)的期望次數?**
  <details><summary>技巧+答案</summary>

  技巧:第 $i$ 個是前 $i$ 個裡最大的機率為 $1/i$(對稱性),線性期望;**答案/關鍵:$E=H_n=\sum_{i=1}^n\frac1i\approx\ln n+\gamma$**。

  </details>

- **均勻隨機排列的最長遞增子序列(LIS)長度期望的漸近?**
  <details><summary>技巧+答案</summary>

  技巧:RSK 對應到 Young 表、Logan–Shepp / Vershik–Kerov 變分;**答案/關鍵:$E[L_n]\sim 2\sqrt n$;漲落 $\sim n^{1/6}$、$(L_n-2\sqrt n)/n^{1/6}$ 服從 Tracy–Widom(Baik–Deift–Johansson)**。

  </details>

- **每盒有均勻隨機一張、共 $n$ 種贈品券,集滿全部的期望開盒數?(Coupon Collector)**
  <details><summary>技巧+答案</summary>

  技巧:分段幾何等待,第 $k$ 張新券等待 $\frac{n}{n-k+1}$,線性期望求和;**答案/關鍵:$E=nH_n\approx n\ln n+\gamma n$;變異數 $\sim\frac{\pi^2}{6}n^2$**。

  </details>

- **隨機主元 quicksort 排 $n$ 個相異數的期望比較次數?**
  <details><summary>技巧+答案</summary>

  技巧:指示變數 $\mathbf 1[\text{rank }i,j\text{ 被比較}]$,秩差 $d=j-i$ 被比較機率 $\frac{2}{d+1}$,線性期望;**答案/關鍵:$E=2(n+1)H_n-4n\sim 2n\ln n\approx 1.386\,n\log_2 n$**。

  </details>

- **均勻隨機排列的期望逆序數(inversions)?這等於把它排回原序所需的期望「相鄰對換」次數。**
  <details><summary>技巧+答案</summary>

  技巧:每對 $(i,j)$ 為逆序機率 $1/2$,共 $\binom n2$ 對,線性期望;**答案/關鍵:$E=\dfrac12\dbinom n2=\dfrac{n(n-1)}4$(即氣泡排序相鄰交換次數的期望)**。

  </details>

- **公平硬幣連拋,首次出現 `HH` 的期望次數?首次 `HT`?為何不同?**
  <details><summary>技巧+答案</summary>

  技巧:狀態機/一階遞迴,或 Conway leading-number(自重疊前綴造成等待懲罰);**答案/關鍵:$E[HH]=6$、$E[HT]=4$——`HH` 會自重疊故等更久;非傳遞性(Penney)也源於此**。

  </details>

- **用生成函數解遞迴:$a_n=a_{n-1}+a_{n-2}$($a_0=0,a_1=1$)的閉式?**
  <details><summary>技巧+答案</summary>

  技巧:設 $A(x)=\sum a_nx^n$,由遞迴得 $A(x)=\dfrac{x}{1-x-x^2}$,部分分式取係數;**答案/關鍵:$a_n=\dfrac{\varphi^n-\psi^n}{\sqrt5}$,$\varphi,\psi=\frac{1\pm\sqrt5}2$**。

  </details>

- **依序面試 $n$ 位相對可比的應徵者、只能即時錄取且不可回頭,最大化「選到全場最佳者」機率的策略與其成功率?(秘書問題)**
  <details><summary>技巧+答案</summary>

  技巧:最優停時,先觀察前 $r-1$ 位當門檻、之後取首位破紀錄者;令 $r/n\to x$ 最大化 $x\ln(1/x)$;**答案/關鍵:$x^\*=1/e$(跳過前約 $n/e$ 位),成功機率 $\to 1/e\approx0.368$**。

  </details>

- **用「機率法」證存在性:$K_n$ 的邊二染色,要保證出現單色 $K_k$,$n$ 至少多大才「無法避免」的下界?**
  <details><summary>技巧+答案</summary>

  技巧:機率法,若期望單色 $K_k$ 個數 $<1$ 則存在無單色染色;**答案/關鍵:若 $\dbinom n k 2^{1-\binom k2}<1$ 則 $R(k,k)>n$,得 $R(k,k)>2^{k/2}$(經典 Erdős 下界)**。

  </details>
