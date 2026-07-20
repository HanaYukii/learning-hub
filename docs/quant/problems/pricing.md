---
title: 選擇權・定價數學(艱深)
track: math
category: pricing
reviewed: 2026-07-01
review_interval: 21
---

# 選擇權・定價數學(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

## 無套利、複製與風險中性

- **單期二元模型($S_0$ 到 $uS_0$ 或 $dS_0$,無風險利率 $r$)中,如何用股票+債券複製任意 payoff $V_u,V_d$?求對沖股數 $\Delta$ 與風險中性機率 $q$。**
  <details><summary>技巧+答案</summary>

  技巧:複製組合 / 鞅條件 $S_0=e^{-r\Delta t}(qS_u+(1-q)S_d)$;**答案/關鍵:$\Delta=\dfrac{V_u-V_d}{(u-d)S_0}$(離散版 delta),$q=\dfrac{e^{r\Delta t}-d}{u-d}$;無套利 $\Leftrightarrow d<e^{r\Delta t}<u$。$q$ 是定價權重,非真實上漲頻率。**

  </details>

- **證明:若市場無套利,則存在等價鞅測度 $Q$ 使折現價格為鞅;$Q$ 下的機率與真實 drift $\mu$ 無關。**
  <details><summary>技巧+答案</summary>

  技巧:第一基本定理(FTAP)、Girsanov;**答案/關鍵:$e^{-rt}S_t$ 在 $Q$ 下為鞅 $\Rightarrow Q$ 下 drift 一律換成 $r$;定價 $V_0=e^{-rT}E^Q[V_T]$,真實 $\mu$ 消失。**

  </details>

## Black–Scholes:PDE 與封閉解

- **推導 BS PDE:對 $\Pi=V-\Delta S$ 用 Itô 並選 $\Delta=\partial V/\partial S$ 消去隨機項,得到什麼方程?為何 $\mu$ 消失?**
  <details><summary>技巧+答案</summary>

  技巧:Itô 引理、delta-hedge、無套利;**答案/關鍵:$\dfrac{\partial V}{\partial t}+\tfrac12\sigma^2S^2\dfrac{\partial^2V}{\partial S^2}+rS\dfrac{\partial V}{\partial S}-rV=0$;對沖後組合無風險 $\Rightarrow$ 只賺 $r$,drift $\mu$ 被 $\Delta$ 抵消。**

  </details>

- **歐式 call 封閉解(連續股息 $q$)。寫出 $C$ 與 $d_1,d_2$。**
  <details><summary>技巧+答案</summary>

  技巧:BS PDE 邊界條件 / $Q$ 下對 log-normal 取期望;**答案/關鍵:$C=S_0e^{-qT}N(d_1)-Ke^{-rT}N(d_2)$,$d_{1,2}=\dfrac{\ln(S_0/K)+(r-q\pm\sigma^2/2)T}{\sigma\sqrt{T}}$。**

  </details>

- **BS PDE 如何變數變換成熱方程?這說明了什麼結構?**
  <details><summary>技巧+答案</summary>

  技巧:$x=\ln S$、$\tau=T-t$ 與指數乘子換元;**答案/關鍵:化為 $u_\tau=u_{xx}$;定價 = 熱擴散,故解為 payoff 與高斯核的卷積(Green function 表示)。**

  </details>

## Greeks:直覺、符號與極值位置

- **Delta 對歐式 call 的範圍與 ATM 值?為何 $N(d_1)$ 同時是對沖比率又「像」ITM 機率?**
  <details><summary>技巧+答案</summary>

  技巧:$\partial C/\partial S$、numéraire 測度變換;**答案/關鍵:$\Delta_{call}=N(d_1)\in(0,1)$,ATM 約 $0.5^+$;$N(d_1)$ 是「以股票為 numéraire」測度下的 ITM 機率,$N(d_2)$ 才是 $Q$ 下的 ITM 機率。**

  </details>

- **Gamma 的封閉式為何?把它「當作 $S$ 的函數」時,峰值落在哪裡(不是 ATM!)?**
  <details><summary>技巧+答案</summary>

  技巧:$\Gamma=\varphi(d_1)/(S\sigma\sqrt T)$,對 $S$ 取對數微分;**答案/關鍵:$\frac{d}{dS}\ln\Gamma=0\Rightarrow d_1=-\sigma\sqrt T$,即 $S^\*=Ke^{-(r+3\sigma^2/2)T}$(略低於 ATM);常見「gamma 在 ATM 最大」是近似,精確峰在 $d_1=-\sigma\sqrt T$。$\Gamma>0$ 是對沖再平衡的凸性引擎。**

  </details>

- **Vega 的封閉式為何?把它「當作 strike $K$ 的函數」(固定 $S$)時峰值落在哪?與 gamma-over-$K$ 峰位相同嗎?**
  <details><summary>技巧+答案</summary>

  技巧:$\mathcal V=S\sqrt T\,\varphi(d_1)$,對 $K$ 取對數微分;**答案/關鍵:$\frac{d}{dK}\ln\mathcal V=\frac{d_1}{K\sigma\sqrt T}=0\Rightarrow d_1=0$;vega-over-$K$ 與 gamma-over-$K$ 同在 $d_1=0$ 達峰。vega 隨 $\sqrt T$ 增長。**

  </details>

- **long call 的 Theta 為何通常為負?ATM 附近 Theta 與 Gamma 有何 delta-hedged 關係?**
  <details><summary>技巧+答案</summary>

  技巧:BS PDE 重排;**答案/關鍵:delta-hedged 組合滿足 $\Theta+\tfrac12\sigma^2S^2\Gamma=rV$;正 gamma $\Leftrightarrow$ 負 theta,凸性收益用時間價值衰減「付費」買來。**

  </details>

- **Rho 的符號與封閉式:call 與 put 各如何隨 $r$ 變化?**
  <details><summary>技巧+答案</summary>

  技巧:對 $r$ 微分;**答案/關鍵:$\rho_{call}=KTe^{-rT}N(d_2)>0$,$\rho_{put}=-KTe^{-rT}N(-d_2)<0$;升息抬高遠期價 $\Rightarrow$ 利 call、損 put。**

  </details>

## Put–Call Parity 與遠期/期貨

- **導出 put–call parity(含連續股息 $q$),並用「複製」而非公式說明為何與模型無關。**
  <details><summary>技巧+答案</summary>

  技巧:無套利複製(long call + short put = 遠期);**答案/關鍵:$C-P=S_0e^{-qT}-Ke^{-rT}$;不依賴 $\sigma$/分布,任何違反皆可套利。**

  </details>

- **遠期價與期貨價在何條件下相等?何時分歧?**
  <details><summary>技巧+答案</summary>

  技巧:無套利持有成本 vs 每日結算相關性;**答案/關鍵:$F_0=S_0e^{(r-q)T}$;利率為常數(或與標的不相關)時 futures = forward,否則因保證金再投資與利率的共變異數項而分歧。**

  </details>

- **證明歐式 call 對 strike $K$ 遞減且凸,且 $C\ge(S_0e^{-qT}-Ke^{-rT})^+$。**
  <details><summary>技巧+答案</summary>

  技巧:payoff 凸 + Jensen + 無套利;**答案/關鍵:$\partial C/\partial K=-e^{-rT}N(d_2)\in(-e^{-rT},0)$(遞減),$\partial^2C/\partial K^2=e^{-rT}\rho_Q(K)\ge0$(凸);下界由 parity + 非負 put 給出。**

  </details>

## 二項樹、收斂與凸性

- **CRR 樹取 $u=e^{\sigma\sqrt{\Delta t}}$、$d=1/u$。$N\to\infty$ 時樹價如何收斂到 BS?收斂階與病態現象?**
  <details><summary>技巧+答案</summary>

  技巧:CLT(log-return 收斂常態)/ 誤差展開;**答案/關鍵:$O(1/N)$ 收斂,但 ATM/障礙處呈鋸齒振盪;取 $N,N+1$ 平均或 Richardson 外推可加速。**

  </details>

- **Gamma-scalping:delta-hedged long-gamma 部位在時間 $dt$、標的變動 $dS$ 下的瞬時損益是多少?賺什麼?**
  <details><summary>技巧+答案</summary>

  技巧:Itô/泰勒二階項、BS PDE;**答案/關鍵:$\mathrm{dP\&L}\approx\tfrac12\Gamma\big[(\mathrm dS)^2-\sigma_{imp}^2S^2\,\mathrm dt\big]$;即賺「已實現 − 隱含」變異數之差,乘以 $\tfrac12\Gamma S^2$。**

  </details>

## 隱含波動率與風險中性分布

- **BS 價作為 $\sigma$ 的函數有何單調性?為何隱含波動率一定唯一可解?**
  <details><summary>技巧+答案</summary>

  技巧:vega $>0\Rightarrow$ 價對 $\sigma$ 嚴格單調;**答案/關鍵:$C(\sigma)$ 在 $(\text{無套利下界},\,S_0e^{-qT})$ 上嚴格遞增 $\Rightarrow$ IV 唯一;Newton 用 vega 迭代快速收斂。**

  </details>

- **Breeden–Litzenberger:如何由連續 strike 的 call 價反推風險中性密度?**
  <details><summary>技巧+答案</summary>

  技巧:對 $K$ 二次微分;**答案/關鍵:$\dfrac{\partial^2C}{\partial K^2}=e^{-rT}\rho_Q(K)$;一階 $\partial C/\partial K=-e^{-rT}Q(S_T>K)$,故 call 曲率即折現密度。**

  </details>

- **為何實務出現波動率微笑/偏斜?用風險中性密度的高階矩解釋。**
  <details><summary>技巧+答案</summary>

  技巧:Breeden–Litzenberger、fat tails / skew;**答案/關鍵:真實 $\rho_Q$ 相對 log-normal 有厚尾(超峰)與負偏 $\Rightarrow$ OTM 需更高 IV;股票市場左尾更肥,呈負斜率「skew」。**

  </details>

- **經典無套利界:兩到期相同、strike 不同的 call 若違反單調($C(K_1)\ge C(K_2)$,$K_1<K_2$)或蝶式為負,如何套利?**
  <details><summary>技巧+答案</summary>

  技巧:單調性 + 凸性(call-spread / butterfly);**答案/關鍵:$C$ 對 $K$ 遞減且凸;違反遞減 $\to$ call-spread 套利;$C(K_1)-2C(K_2)+C(K_3)<0$($K_2$ 居中)$\to$ 零成本 butterfly 得非負 payoff 套利。**

  </details>

## 進階經典:多資產、路徑依賴、靜態複製

- **Margrabe 交換選擇權:payoff $(S_1(T)-S_2(T))^+$,兩資產 GBM、波動率 $\sigma_1,\sigma_2$、相關 $\rho$、股息 $q_1,q_2$。閉式為何?**
  <details><summary>技巧+答案</summary>

  技巧:以 $S_2$ 為 numéraire,把問題化為單資產 BS($K=1$、無風險項消失);**答案/關鍵:$V=S_1e^{-q_1T}N(d_1)-S_2e^{-q_2T}N(d_2)$,$\hat\sigma=\sqrt{\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2}$,$d_{1,2}=\frac{\ln(S_1e^{-q_1T}/S_2e^{-q_2T})\pm\frac12\hat\sigma^2T}{\hat\sigma\sqrt T}$。**

  </details>

- **Carr–Madan 靜態複製:任意光滑歐式 payoff $f(S_T)$ 如何用債券 + 遠期 + 一整條 call/put 複製?**
  <details><summary>技巧+答案</summary>

  技巧:對 $f$ 做二階泰勒/分部積分,以 $F$ 為展開點;**答案/關鍵:$f(S_T)=f(F)+f'(F)(S_T-F)+\int_0^F f''(K)(K-S_T)^+dK+\int_F^\infty f''(K)(S_T-K)^+dK$;定價 = 常數債券 + 遠期 + 用 $f''(K)$ 加權的 OTM put/call 積分。**

  </details>

- **變異數交換(variance swap)公平履約價:如何由 log-contract 靜態複製、權重為何?**
  <details><summary>技巧+答案</summary>

  技巧:Carr–Madan 套在 $f=-2\ln(S_T/S_0)$(log contract);**答案/關鍵:$K_{var}=\dfrac{2e^{rT}}{T}\Big(\int_0^{F}\frac{P(K)}{K^2}dK+\int_{F}^\infty\frac{C(K)}{K^2}dK\Big)$;OTM 選擇權以 $1/K^2$ 加權,低 strike put 權重極大(左尾主導)。**

  </details>

- **永續美式 put(無到期、無股息、常數 $r,\sigma$):最優執行界 $S^\*$ 與價值閉式為何?**
  <details><summary>技巧+答案</summary>

  技巧:自由邊界 ODE $\tfrac12\sigma^2S^2V''+rSV'-rV=0$ + smooth-pasting($V(S^\*)=K-S^\*$、$V'(S^\*)=-1$);**答案/關鍵:令 $\gamma=2r/\sigma^2$,則 $S^\*=\dfrac{\gamma}{\gamma+1}K$,且 $S\ge S^\*$ 時 $V(S)=(K-S^\*)\big(S/S^\*\big)^{-\gamma}$。**

  </details>
