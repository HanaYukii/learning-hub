---
title: 統計推論・回歸(艱深)
track: math
category: statistics
reviewed: 2026-07-02
review_interval: 21
---

# 統計推論・回歸(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

## OLS 幾何與代數

- **推導 OLS 閉式解,說明幾何意義與殘差正交性。**
  <details><summary>技巧+答案</summary>

  技巧:normal equations $X^\top(y-X\hat\beta)=0$,或視為投影;**答案/關鍵:$\hat\beta=(X^\top X)^{-1}X^\top y$;$\hat y=Hy$,hat matrix $H=X(X^\top X)^{-1}X^\top$ 是往 $\mathrm{col}(X)$ 的正交投影(對稱、冪等、$\mathrm{tr}(H)=p$)**。
  正交性 $X^\top e=0$ ⇒ 含截距時 $\sum e_i=0$、$e\perp\hat y$、$\bar{\hat y}=\bar y$;推論:**加變數 $R^2$ 永不下降**(投影到更大子空間);陷阱:過原點回歸 $\sum e_i\neq 0$、$R^2$ 可為負。

  </details>

- **$y$ 對 $x$ 斜率 $b_{yx}$ 與 $x$ 對 $y$ 斜率 $b_{xy}$:乘積是多少?互為倒數嗎?**
  <details><summary>技巧+答案</summary>

  技巧:寫成 $b_{yx}=\rho\,\sigma_y/\sigma_x$、$b_{xy}=\rho\,\sigma_x/\sigma_y$;**答案/關鍵:$b_{yx}b_{xy}=\rho^2=R^2\le 1$,僅 $|\rho|=1$ 時互為倒數**。
  經典陷阱:$b_{xy}\neq 1/b_{yx}$;quant 版:A 對 B 與 B 對 A 的 hedge ratio 不對稱。

  </details>

- **簡單回歸中把 t-stat、$R^2$、相關係數 $r$ 串成一條公式。**
  <details><summary>技巧+答案</summary>

  技巧:把 $\hat\beta/SE(\hat\beta)$ 全部展開,只剩 $r$ 與 $n$;**答案/關鍵:$t=\dfrac{r\sqrt{n-2}}{\sqrt{1-r^2}}$,等價 $t^2=\dfrac{(n-2)R^2}{1-R^2}$,且單一係數檢定 $F=t^2$**。
  反解 $R^2=\dfrac{t^2}{t^2+n-2}$——HFT 常問「$t=3$、$n=1000$ 的訊號 $R^2$?」答:$9/1007\approx 0.9\%$,**顯著 ≠ 解釋力大**。

  </details>

## 偏誤與病態(quant 最愛)

- **Gauss–Markov:條件是什麼?各條違反後果?**
  <details><summary>技巧+答案</summary>

  技巧:分「無偏所需」與「有效率所需」兩層;**答案/關鍵:參數線性、無完全共線、外生性 $E[\varepsilon|X]=0$、球形誤差(同變異+無自相關)⇒ OLS 是 BLUE;不需要常態**。加常態 ⇒ OLS=MLE 且達 Cramér–Rao(所有無偏估計中最佳)。
  違反:異質變異/自相關 ⇒ **仍無偏但無效率、SE 錯**(White / Newey–West 修);$E[\varepsilon|X]\neq 0$(內生性)⇒ **有偏且不一致 = 致命**,需 IV/2SLS。

  </details>

- **$x$ 觀測含噪音 $\tilde x=x+u$($u\perp x,\varepsilon$),OLS 斜率怎麼變?$y$ 加噪音呢?**
  <details><summary>技巧+答案</summary>

  技巧:$\mathrm{plim}\,\hat\beta=\mathrm{Cov}(\tilde x,y)/\mathrm{Var}(\tilde x)$;**答案/關鍵:attenuation bias,$\hat\beta\xrightarrow{p}\beta\cdot\dfrac{\sigma_x^2}{\sigma_x^2+\sigma_u^2}$(縮向 0、不變號);$y$ 加噪音只放大 SE,斜率不偏**。
  Quant 直覺:訊號含測量噪音 ⇒ 係數自帶 shrinkage;低 SNR 下 β 系統性偏小。

  </details>

- **真模型 $y=\beta_1x_1+\beta_2x_2+\varepsilon$,漏掉 $x_2$,$\hat\beta_1$ 偏多少?**
  <details><summary>技巧+答案</summary>

  技巧:auxiliary regression:$x_2$ 對 $x_1$ 回歸得 $\delta$;**答案/關鍵:$E[\hat\beta_1]=\beta_1+\beta_2\delta$,$\delta=\dfrac{\mathrm{Cov}(x_1,x_2)}{\mathrm{Var}(x_1)}$;偏誤方向 $=\mathrm{sign}(\beta_2)\times\mathrm{sign}(\mathrm{Cov})$**。
  $\mathrm{Cov}(x_1,x_2)=0$ ⇒ 無偏 ⇒ **正交因子可分開回歸**(FWL 定理精神)。

  </details>

- **高度共線性會怎樣?如何量化與處置?**
  <details><summary>技巧+答案</summary>

  技巧:$\mathrm{Var}(\hat\beta_j)=\dfrac{\sigma^2}{(n-1)s_j^2}\cdot\dfrac{1}{1-R_j^2}$;**答案/關鍵:估計仍無偏/一致,但變異爆炸(VIF $=1/(1-R_j^2)$)、係數符號亂跳、個別 $t$ 小但整體 $F$ 大**;完全共線 ⇒ $X^\top X$ 奇異。
  處置:ridge $(X^\top X+\lambda I)^{-1}X^\top y$、PCA、刪變數;**預測不受害,係數解讀才受害**。

  </details>

## 估計理論

- **證明 Gaussian 誤差下 OLS = MLE;Laplace 誤差對應什麼?**
  <details><summary>技巧+答案</summary>

  技巧:log-likelihood $=-\frac{n}{2}\log\sigma^2-\frac{1}{2\sigma^2}\sum(y_i-x_i^\top\beta)^2+c$;**答案/關鍵:對 $\beta$ 最大化 ⇔ 最小化 SSE ⇒ 同解;$\hat\sigma^2_{\text{MLE}}=\mathrm{SSE}/n$ 有偏(無偏版除 $n-p$)**。
  加分:Laplace 誤差 ⇒ MLE = 最小化 $\sum|e_i|$ = LAD(中位數回歸,肥尾穩健)。

  </details>

- **MLE vs 動差法(MoM):用 $U(0,\theta)$ 完整比較。**
  <details><summary>技巧+答案</summary>

  技巧:MoM 解 $E[X]=\theta/2$;MLE 看支撐邊界;**答案/關鍵:MoM $=2\bar X$(無偏,$\mathrm{Var}=\theta^2/3n$);MLE $=X_{(n)}$(有偏,$E=\frac{n}{n+1}\theta$),修正 $\frac{n+1}{n}X_{(n)}$ 後 $\mathrm{Var}=\frac{\theta^2}{n(n+2)}=O(n^{-2})$ 壓倒性勝**。
  通則:MLE 漸近有效(達 CRLB)、有不變性;MoM 簡單一致但通常無效率,還可能違反支撐(出現 $2\bar X<X_{(n)}$)。

  </details>

- **背出常見分布的充分統計量。**
  <details><summary>技巧+答案</summary>

  技巧:Fisher–Neyman 分解 $f=g(T(x),\theta)\,h(x)$;指數族直接讀 natural statistic;**答案/關鍵:Bernoulli / Poisson / Exponential:$\sum x_i$;Normal(雙參數未知):$(\sum x_i,\sum x_i^2)$;Uniform$(0,\theta)$:$X_{(n)}$;Gamma:$(\sum x_i,\sum\log x_i)$**。
  陷阱:Uniform 支撐依賴參數 ⇒ **非指數族**,充分統計量是 order statistic。

  </details>

- **$\hat\sigma^2$ 除 $n$ 還是 $n-1$?講清楚無偏 vs 一致。**
  <details><summary>技巧+答案</summary>

  技巧:$E[\sum(x_i-\bar x)^2]=(n-1)\sigma^2$($\bar x$ 吃掉 1 個自由度);**答案/關鍵:$1/(n-1)$ 無偏(Bessel);$1/n$ 是 MLE,有偏但一致、MSE 更小;兩者皆一致**。
  概念題:無偏 ⇏ 一致($\hat\mu=X_1$ 無偏但不一致);一致 ⇏ 無偏($1/n$ 版);加碼:$s=\sqrt{s^2}$ 因 Jensen 仍是 $\sigma$ 的**有偏**估計(偏低)。

  </details>

## 檢定陷阱

- **一句話說對 p-value,並指出最常見錯讀。**
  <details><summary>技巧+答案</summary>

  技巧:注意條件方向;**答案/關鍵:$p=P(\text{統計量}\ge\text{觀測值}\mid H_0)$——「$H_0$ 為真時資料有多極端」,不是 $P(H_0\mid\text{data})$、不是效果大小、$1-p$ 不是重現機率**。
  Quant 版陷阱:掃 1000 個因子必撈到假顯著 ⇒ 多重檢定要 Bonferroni / FDR / deflated Sharpe。

  </details>
