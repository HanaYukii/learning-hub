---
title: 線代・共變異數・隨機矩陣(艱深)
track: math
category: linalg
reviewed: 2026-07-01
review_interval: 21
---

# 線代・共變異數・隨機矩陣(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

## 共變異數與正定性

- **證明任意共變異數矩陣 $\Sigma$ 必為半正定,並說明何時嚴格正定。**
  <details><summary>技巧+答案</summary>

  技巧:對任意向量 $a$,$a^\top\Sigma a=\mathrm{Var}(a^\top X)\ge 0$;**答案/關鍵:$\Sigma=\mathbb{E}[(X-\mu)(X-\mu)^\top]$ 為 Gram 矩陣故 PSD;嚴格 PD $\iff$ 各分量無仿射相依(即 $X$ 不落在低維超平面上,$\Sigma$ 滿秩)**。

  </details>

- **給定 $\Sigma$ PD,如何 $O(n^3)$ 生成相關的多元常態樣本?為何用 Cholesky 而非特徵分解?**
  <details><summary>技巧+答案</summary>

  技巧:$\Sigma=LL^\top$(下三角),取 $X=\mu+Lz$,$z\sim N(0,I)$;**答案/關鍵:$\mathrm{Cov}(Lz)=LL^\top=\Sigma$;Cholesky 約 $n^3/3$ flops、數值穩定且不需算特徵向量,是相關樣本模擬的標準做法**。

  </details>

- **三資產相關矩陣 $R=\begin{pmatrix}1&\rho&\rho\\\rho&1&\rho\\\rho&\rho&1\end{pmatrix}$,求使 $R$ PSD 的 $\rho$ 範圍。**
  <details><summary>技巧+答案</summary>

  技巧:等相關矩陣特徵值為 $1+2\rho$(全一向量,單重)與 $1-\rho$(二重);兩者皆 $\ge 0$;**答案/關鍵:$\rho\in[-\tfrac12,\,1]$。一般 $n$ 維等相關特徵值為 $1+(n-1)\rho$ 與 $1-\rho$($n-1$ 重),故 $\rho\in[-\tfrac{1}{n-1},1]$**。

  </details>

- **一般三資產相關矩陣 $\begin{pmatrix}1&a&b\\a&1&c\\b&c&1\end{pmatrix}$,給定 $a,b$ 問 $c$ 的可行域。**
  <details><summary>技巧+答案</summary>

  技巧:$3\times3$ 相關陣 PSD 由行列式 $1-a^2-b^2-c^2+2abc\ge0$ 主導(對角 $=1$ 保證前兩階主子式);視為 $c$ 的二次不等式;**答案/關鍵:$c\in\big[ab-\sqrt{(1-a^2)(1-b^2)},\ ab+\sqrt{(1-a^2)(1-b^2)}\big]$**。

  </details>

- **Correlation 傳遞界:已知 $\rho_{XY},\rho_{YZ}$,求 $\rho_{XZ}$ 可能範圍。**
  <details><summary>技巧+答案</summary>

  技巧:把相關係數看成單位向量夾角餘弦 $\rho=\cos\theta$,三角不等式 $|\theta_{XZ}|\le\theta_{XY}+\theta_{YZ}$;**答案/關鍵:$\rho_{XZ}\in\big[\rho_{XY}\rho_{YZ}-\sqrt{(1-\rho_{XY}^2)(1-\rho_{YZ}^2)},\ \rho_{XY}\rho_{YZ}+\sqrt{(1-\rho_{XY}^2)(1-\rho_{YZ}^2)}\big]$。特例 $\rho_{XY}=\rho_{YZ}=0.6\Rightarrow\rho_{XZ}\in[-0.28,1]$,故相關不傳遞**。

  </details>

- **樣本相關矩陣不是有效 PSD(如三方報價拼出負特徵值)時,如何求「最近的合法相關矩陣」?**
  <details><summary>技巧+答案</summary>

  技巧:對稱 Frobenius 投影到相關矩陣凸集(Higham 交替投影);單步近似=特徵值截斷;**答案/關鍵:譜分解 $\hat R=\sum\lambda_i q_iq_i^\top$,把負 $\lambda_i$ 設 $0$ 得 $\tilde R=\sum\max(\lambda_i,0)q_iq_i^\top$,再把對角重標為 $1$;嚴格最近解需 Higham 交替投影(對角面 + PSD 錐)迭代收斂**。

  </details>

## 二次型・特徵值・PCA

- **給對稱 $A$,如何判定正定?列出等價條件。**
  <details><summary>技巧+答案</summary>

  技巧:譜定理 + Sylvester 判準;**答案/關鍵:PD $\iff$ 所有特徵值 $>0$ $\iff$ 所有「順序主子式」(leading principal minors)$>0$(Sylvester)$\iff$ $\exists$ 可逆 $B$ 使 $A=B^\top B$。注意 PSD 需檢查「所有」主子式而非僅順序主子式(反例 $\mathrm{diag}(0,-1)$ 順序主子式為 $0,0$ 卻非 PSD)**。

  </details>

- **PCA:證明第一主成分方向是 $\Sigma$ 最大特徵值對應的特徵向量。**
  <details><summary>技巧+答案</summary>

  技巧:最大化 $\max_{\|w\|=1}w^\top\Sigma w$,Lagrange 乘子或 Rayleigh 商;**答案/關鍵:一階條件給 $\Sigma w=\lambda w$,目標值 $=\lambda$,故取最大特徵值 $\lambda_{\max}$;第 $i$ 主成分解釋變異數比例 $=\lambda_i/\sum_j\lambda_j$**。

  </details>

- **Rayleigh 商 $R(x)=\dfrac{x^\top A x}{x^\top x}$ 的範圍與極值?(對稱 $A$)**
  <details><summary>技巧+答案</summary>

  技巧:譜分解到特徵基;**答案/關鍵:$R(x)\in[\lambda_{\min},\lambda_{\max}]$,在對應特徵向量取到;此即 Courant–Fischer min–max 定理的特例,是條件數與最佳化收斂分析的核心**。

  </details>

- **$X\sim N(0,\Sigma)$,求二次型 $X^\top A X$ 的期望;何時 $X^\top\Sigma^{-1}X\sim\chi^2_n$?**
  <details><summary>技巧+答案</summary>

  技巧:跡技巧 $\mathbb{E}[X^\top AX]=\mathrm{tr}(A\Sigma)$;白化 $Z=\Sigma^{-1/2}X\sim N(0,I)$;**答案/關鍵:$\mathbb{E}[X^\top AX]=\mathrm{tr}(A\Sigma)$;且 $X^\top\Sigma^{-1}X=\|Z\|^2\sim\chi^2_n$(馬氏距離平方)**。

  </details>

- **全域最小變異數投資組合(GMVP):在 $w^\top\mathbf 1=1$ 下最小化 $w^\top\Sigma w$,求最優權重與最小變異數。**
  <details><summary>技巧+答案</summary>

  技巧:等式約束二次規劃,單一 Lagrange 乘子;**答案/關鍵:$w^\star=\dfrac{\Sigma^{-1}\mathbf 1}{\mathbf 1^\top\Sigma^{-1}\mathbf 1}$,最小變異數 $=\dfrac{1}{\mathbf 1^\top\Sigma^{-1}\mathbf 1}$;權重可為負(允許放空),精度矩陣 $\Sigma^{-1}$ 主宰配置**。

  </details>

## 秩一更新・矩陣恆等式

- **Sherman–Morrison:$(A+uv^\top)^{-1}=?$**
  <details><summary>技巧+答案</summary>

  技巧:秩一更新逆的閉式;**答案/關鍵:$(A+uv^\top)^{-1}=A^{-1}-\dfrac{A^{-1}uv^\top A^{-1}}{1+v^\top A^{-1}u}$,存在 $\iff 1+v^\top A^{-1}u\neq0$。用於 $O(n^2)$ 增量更新逆矩陣(卡爾曼濾波、線上迴歸新增一筆資料)**。

  </details>

- **行列式的秩一更新(matrix determinant lemma):$\det(A+uv^\top)=?$**
  <details><summary>技巧+答案</summary>

  技巧:與 Sherman–Morrison 對偶;**答案/關鍵:$\det(A+uv^\top)=\det(A)\,(1+v^\top A^{-1}u)$。廣義:$\det(A+UV^\top)=\det(A)\det(I+V^\top A^{-1}U)$(Weinstein–Aronszajn / Woodbury 版)**。

  </details>

- **因子模型 $\Sigma=D+BB^\top$($D$ 對角、$B\in\mathbb{R}^{n\times k}$、$k\ll n$),如何 $O(nk^2)$ 求 $\Sigma^{-1}$ 而非 $O(n^3)$?**
  <details><summary>技巧+答案</summary>

  技巧:Woodbury 恆等式;**答案/關鍵:$\Sigma^{-1}=D^{-1}-D^{-1}B\,(I_k+B^\top D^{-1}B)^{-1}B^\top D^{-1}$,只需反轉 $k\times k$ 矩陣;這是風險模型/GMVP 在大 $n$ 下可解的關鍵**。

  </details>

- **加入一個新資產後如何 $O(n^2)$ 更新精度矩陣 $\Sigma^{-1}$ 而非重算 $O(n^3)$?**
  <details><summary>技巧+答案</summary>

  技巧:分塊矩陣求逆 + Schur 補;**答案/關鍵:對 $\Sigma=\begin{pmatrix}A&b\\b^\top&d\end{pmatrix}$,Schur 補 $s=d-b^\top A^{-1}b$,新逆的分塊由 $A^{-1}$、$A^{-1}b$、$s$ 組出;$s>0$ 亦為新加入資產保持 PD 的條件**。

  </details>

## 隨機矩陣・高維

- **Marchenko–Pastur:$n$ 筆 iid $p$ 維樣本($p/n\to\gamma<1$)、真實 $\Sigma=I$,樣本共變異數 $\hat\Sigma$ 的特徵值分布?支撐邊界?**
  <details><summary>技巧+答案</summary>

  技巧:大隨機矩陣譜的 MP 律;**答案/關鍵:特徵值支撐在 $\big[(1-\sqrt\gamma)^2,\ (1+\sqrt\gamma)^2\big]$(單位變異數;一般乘 $\sigma^2$)。即使真值為 $I$,有限樣本特徵值也「散開」——這正是為何要做 shrinkage / RMT 去噪**。

  </details>

- **當 $p>n$($\gamma>1$)時 MP 分布多出什麼?樣本共變異數還可逆嗎?**
  <details><summary>技巧+答案</summary>

  技巧:秩不足 + MP 在 $\gamma>1$ 的原子質量;**答案/關鍵:$\hat\Sigma$ 秩至多 $n<p$ 故不可逆;MP 在 $0$ 處有質量 $1-1/\gamma$ 的離散原子,其餘非零譜落在正區間 $\big[(1-\sqrt\gamma)^2,(1+\sqrt\gamma)^2\big]$($\gamma>1$ 時下界 $>0$,與原子分離)**。

  </details>

- **高維下樣本共變異數是差估計,標準補救(Ledoit–Wolf)是什麼?最優收縮強度怎麼定?**
  <details><summary>技巧+答案</summary>

  技巧:凸收縮到結構化目標 + 最小化期望 Frobenius 誤差;**答案/關鍵:$\hat\Sigma_{\mathrm{LW}}=(1-\alpha)\hat\Sigma+\alpha\,\mu I$($\mu=\mathrm{tr}(\hat\Sigma)/p$);最優 $\alpha^\star=\dfrac{\mathbb{E}\|\hat\Sigma-\Sigma\|_F^2\text{ 的估計}}{\|\hat\Sigma-\mu I\|_F^2}$,把散開的特徵值往中心壓、改善條件數與樣本外表現**。

  </details>

- **JL 引理:要把 $m$ 個點嵌入低維並保 $(1\pm\varepsilon)$ 兩兩距離,需要幾維?**
  <details><summary>技巧+答案</summary>

  技巧:隨機投影 + 集中不等式(union bound over $\binom{m}{2}$ 對);**答案/關鍵:$k=O\!\big(\varepsilon^{-2}\log m\big)$ 維即可,與原維度 $d$ 無關;用 $\tfrac{1}{\sqrt k}$ 縮放的高斯/次高斯隨機矩陣 $R$,$\|Rx\|^2$ 集中於 $\|x\|^2$**。

  </details>

- **為何隨機高斯矩陣 $R\in\mathbb{R}^{k\times d}$ 近似保長度?一句話說清集中機制。**
  <details><summary>技巧+答案</summary>

  技巧:$\|Rx\|^2/\|x\|^2$ 是 $\chi^2_k/k$ 縮放,尾機率指數小;**答案/關鍵:$\Pr\!\big[\,\big|\,\|Rx\|^2-\|x\|^2\,\big|>\varepsilon\|x\|^2\,\big]\le 2e^{-(\varepsilon^2-\varepsilon^3)k/4}$;取 $k\gtrsim \varepsilon^{-2}\log m$ 配 union bound 即得 JL**。

  </details>

- **(經典)高維單位球中兩隨機向量幾乎正交:$\mathbb{E}[\cos\theta]$ 與集中度?**
  <details><summary>技巧+答案</summary>

  技巧:$\cos\theta=\frac{u^\top v}{\|u\|\|v\|}$,對稱性 + 集中;**答案/關鍵:$\mathbb{E}[\cos\theta]=0$,$\mathrm{Var}\approx 1/d$,故高維隨機向量以高機率近正交($\theta\approx90^\circ$)——「維度詛咒」在共變異數估計/最近鄰的直接後果**。

  </details>
