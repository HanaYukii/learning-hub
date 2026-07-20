---
title: 隨機微積分・布朗運動(艱深)
track: math
category: stochastic
reviewed: 2026-07-01
review_interval: 21
---

# 隨機微積分・布朗運動(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

- **用 Itô lemma 展開 $d(W_t^2)$,並由此求 $\int_0^t W_s\,dW_s$。**
  <details><summary>技巧+答案</summary>

  技巧:Itô 公式 $df=f'\,dW+\tfrac12 f''\,dt$,對 $f(W)=W^2$;$(dW)^2=dt$;
  **答案/關鍵:$d(W_t^2)=2W_t\,dW_t+dt\Rightarrow \int_0^t W\,dW=\tfrac12(W_t^2-t)$;注意 Itô 積分比「$\tfrac12 W_t^2$」少掉 $\tfrac12 t$,正是二次變差的痕跡**。

  </details>

- **求 $E[W_t^4]$ 以及一般 $E[W_t^{2n}]$。**
  <details><summary>技巧+答案</summary>

  技巧:$W_t\sim N(0,t)$ 之高斯矩;偶數矩 $E[W_t^{2n}]=(2n-1)!!\,t^n$;
  **答案/關鍵:$E[W_t^4]=3t^2$(峰度 $3$);一般 $E[W_t^{2n}]=(2n-1)!!\,t^n$,奇數矩為 $0$**。

  </details>

- **計算 $E[e^{\sigma W_t}]$,並說明它與 GBM 期望的關係。**
  <details><summary>技巧+答案</summary>

  技巧:高斯 MGF $E[e^{\theta X}]=e^{\theta^2\mathrm{Var}/2}$;GBM $S_t=S_0e^{(\mu-\sigma^2/2)t+\sigma W_t}$;
  **答案/關鍵:$E[e^{\sigma W_t}]=e^{\sigma^2 t/2}$;故 $E[S_t]=S_0e^{\mu t}$(漂移調整項 $-\sigma^2/2$ 剛好被指數矩補回)**。

  </details>

- **驗證 $M_t=e^{\sigma W_t-\sigma^2 t/2}$ 是鞅,並指出其金融意義。**
  <details><summary>技巧+答案</summary>

  技巧:對 $M_t$ 套 Itô,$dM_t=\sigma M_t\,dW_t$(無漂移 $\Rightarrow$ 鞅);此即 Doléans-Dade 指數;
  **答案/關鍵:$dM_t=\sigma M_t\,dW_t$,$E[M_t]=1$;$M_t$ 正是 Girsanov 測度變換的 Radon–Nikodym 密度**。

  </details>

- **反射原理:求 $M_t=\max_{s\le t}W_s$ 的分布、期望與變異數。**
  <details><summary>技巧+答案</summary>

  技巧:反射原理 $P(M_t\ge a)=2P(W_t\ge a)$,故 $M_t\overset{d}{=}|W_t|$(半常態);
  **答案/關鍵:$E[M_t]=E[|W_t|]=\sqrt{2t/\pi}$;$\mathrm{Var}(M_t)=(1-\tfrac{2}{\pi})t$**。

  </details>

- **Lévy 定理:$M_t-W_t$($M_t=\max_{s\le t}W_s$)的分布為何?與局部時間的關係?**
  <details><summary>技巧+答案</summary>

  技巧:Lévy 反射同分布 $(M_t-W_t,\,M_t)\overset{d}{=}(|W_t|,\,L_t)$,$L_t$ 為 $0$ 點局部時間;
  **答案/關鍵:$M_t-W_t\overset{d}{=}|W_t|$(半常態),且過程層面 $M-W$ 與反射布朗運動 $|W|$ 同律;跑動最大值減現值,其分布竟與 $|W_t|$ 相同,是諸多恆等式的源頭**。

  </details>

- **首達時間 $\tau_a=\inf\{t:W_t=a\}$($a>0$)的密度與矩。**
  <details><summary>技巧+答案</summary>

  技巧:反射原理導出密度;$\tau_a$ 為 $\tfrac12$-穩定(Lévy 分布);
  **答案/關鍵:$f_{\tau_a}(t)=\dfrac{a}{\sqrt{2\pi t^3}}e^{-a^2/(2t)}$;$P(\tau_a<\infty)=1$ 但 $E[\tau_a]=\infty$(重尾 $t^{-3/2}$);有漂移時 $\tau_a$ 才服從真正的 inverse Gaussian**。

  </details>

- **首達時間的 Laplace 變換 $E[e^{-\lambda\tau_a}]$($a,\lambda>0$)。**
  <details><summary>技巧+答案</summary>

  技巧:指數鞅 $e^{\theta W_t-\theta^2 t/2}$ 配合最優停止,取 $\theta=\sqrt{2\lambda}$;
  **答案/關鍵:$E[e^{-\lambda\tau_a}]=e^{-a\sqrt{2\lambda}}$;由此可反推密度為 Lévy 分布,也直接給出 $\tau_a$ 的無窮可分與 $\tfrac12$-穩定性**。

  </details>

- **雙邊出界(連續版賭徒破產):$W_0=0$,$\tau=\inf\{t:W_t\notin(-a,b)\}$,求命中 $b$ 的機率與 $E[\tau]$。**
  <details><summary>技巧+答案</summary>

  技巧:$W_t$ 為鞅 $\Rightarrow$ 命中機率用線性;$W_t^2-t$ 為鞅 $\Rightarrow$ 用最優停止定 $E[\tau]$;
  **答案/關鍵:$P(\text{先到 }b)=\dfrac{a}{a+b}$;$E[\tau]=ab$(對稱 $a=b$ 時為 $a^2$)**。

  </details>

- **arcsine law(其一):$[0,t]$ 內布朗運動為正的總時間 $A_t$ 之分布。**
  <details><summary>技巧+答案</summary>

  技巧:Lévy 第一 arcsine 定律,$A_t/t$ 服從 arcsine;密度集中在 $0,1$ 兩端;
  **答案/關鍵:$P(A_t/t\le x)=\dfrac{2}{\pi}\arcsin\sqrt{x}$;直覺:路徑「多半待在同一側」,而非平均對半**。

  </details>

- **arcsine law(其二):$[0,t]$ 內達到最大值的時刻 $\theta_t$ 之分布。**
  <details><summary>技巧+答案</summary>

  技巧:Lévy 第三 arcsine 定律,最大值位置(與最後歸零時刻同分布)服從 arcsine;
  **答案/關鍵:$P(\theta_t/t\le x)=\dfrac{2}{\pi}\arcsin\sqrt{x}$;最大值最可能出現在區間頭尾,而非中間**。

  </details>

- **Brownian bridge:給定 $W_0=0,\,W_1=0$,求 $B_s$($0\le s\le 1$)的均值、變異數與共變異數。**
  <details><summary>技巧+答案</summary>

  技巧:條件高斯,$B_s=W_s-sW_1$;或直接算條件分布;
  **答案/關鍵:$E[B_s]=0$,$\mathrm{Cov}(B_s,B_u)=s(1-u)$($s\le u$),故 $\mathrm{Var}(B_s)=s(1-s)$(最大在 $s=\tfrac12$)**。

  </details>

- **二次變差:證明布朗運動在 $[0,t]$ 上的二次變差為 $t$(非隨機)。**
  <details><summary>技巧+答案</summary>

  技巧:$\sum(W_{t_{k+1}}-W_{t_k})^2\to t$ 於 $L^2$;每項期望 $\Delta t$、變異數 $2\Delta t^2\to0$;
  **答案/關鍵:$[W]_t=t$(a.s. 確定值),故 $(dW)^2=dt$;這正是 Itô 修正項的來源,也使一階變差發散、路徑處處不可微**。

  </details>

- **Girsanov 直覺:如何把有漂移的 $\tilde W_t=W_t+\theta t$ 在新測度下變回標準布朗運動?**
  <details><summary>技巧+答案</summary>

  技巧:以 $\frac{dQ}{dP}=e^{-\theta W_t-\theta^2 t/2}$ 換測度,吸收漂移;
  **答案/關鍵:在 $Q$ 下 $\tilde W_t$ 是標準布朗運動;金融上即從真實測度 $P$ 轉風險中性測度 $Q$,把 $\mu$ 換成 $r$,折現後資產價成鞅**。

  </details>

- **求 $\mathrm{Cov}(W_s,W_t)$ 並解釋為何布朗運動非平穩但增量獨立平穩。**
  <details><summary>技巧+答案</summary>

  技巧:$W_t=W_s+(W_t-W_s)$,增量與 $W_s$ 獨立;
  **答案/關鍵:$\mathrm{Cov}(W_s,W_t)=\min(s,t)$;$\mathrm{Var}(W_t)=t$ 隨時間增長(非平穩),但增量 $W_t-W_s\sim N(0,t-s)$ 只依賴時間差(平穩獨立)**。

  </details>

- **Ornstein–Uhlenbeck:解 $dX_t=-\theta X_t\,dt+\sigma\,dW_t$,求解與穩態分布。**
  <details><summary>技巧+答案</summary>

  技巧:積分因子 $e^{\theta t}$,$X_t=X_0e^{-\theta t}+\sigma\int_0^t e^{-\theta(t-s)}\,dW_s$;
  **答案/關鍵:$E[X_t]=X_0e^{-\theta t}\to0$,穩態 $X_\infty\sim N\!\big(0,\tfrac{\sigma^2}{2\theta}\big)$;OU 是唯一同時高斯、馬可夫、平穩的連續過程(Doob)**。

  </details>

- **Doob 極大不等式與 BDG:如何控制 $E[\sup_{s\le t}W_s^2]$?**
  <details><summary>技巧+答案</summary>

  技巧:$W_t^2$ 為子鞅,$L^2$ Doob 極大不等式 $E[\sup_{s\le t}W_s^2]\le 4\,E[W_t^2]$;
  **答案/關鍵:$E[\sup_{s\le t}W_s^2]\le 4t$(常數 $(\tfrac{p}{p-1})^2=4$);更一般由 Burkholder–Davis–Gundy 以二次變差 $[M]_t$ 上下夾住 $\sup|M|$ 的各階矩**。

  </details>
