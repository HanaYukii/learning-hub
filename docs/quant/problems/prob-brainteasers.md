---
title: 機率 & 期望 brainteasers(艱深)
track: math
category: probability
reviewed: 2026-07-01
review_interval: 21
---

# 機率 & 期望 brainteasers(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

## 幾何機率

- **長度 1 的棍子隨機取兩點同時折成三段,能組成三角形的機率?**
  <details><summary>技巧+答案</summary>

  技巧:兩折點 $x,y\sim U(0,1)$,三角形化為單位正方形上「三段皆 $<1/2$」的區域面積;**答案/關鍵:「一次折兩點」為 $\boxed{1/4}$;「先隨機折一段、再折兩段中較長的那段」則為 $2\ln2-1\approx0.386$**。

  </details>

- **Buffon 投針:針長 $\ell$、平行線間距 $d\ (\ell\le d)$,針壓到線的機率?**
  <details><summary>技巧+答案</summary>

  技巧:對針中心到最近線距離 $x\sim U(0,d/2)$ 與夾角 $\theta\sim U(0,\pi)$ 積分,$P=\frac1{d/2}\cdot\frac1\pi\iint[x\le\frac\ell2\sin\theta]$;**答案/關鍵:$\boxed{\dfrac{2\ell}{\pi d}}$;$\ell=d$ 時 $2/\pi\approx0.6366$,可用來估 $\pi$**。

  </details>

- **單位圓上隨機取 $n$ 點,全部落在同一半圓的機率?**
  <details><summary>技巧+答案</summary>

  技巧:令「第 $i$ 點為半圓順時針起點、其餘 $n-1$ 點都在其後半圓內」的事件互斥,每個機率 $(1/2)^{n-1}$,共 $n$ 個;**答案/關鍵:$\boxed{n/2^{n-1}}$,$n=3$ 時 $3/4$**。

  </details>

## 期望值(累加 / 等待時間)

- **iid $U(0,1)$ 一直相加,期望要加幾次才首次超過 1?**
  <details><summary>技巧+答案</summary>

  技巧:$P(\text{前 }n\text{ 個和}\le1)=1/n!$(單體體積),$E[N]=\sum_{n\ge0}P(N>n)=\sum 1/n!$;**答案/關鍵:$\boxed{e\approx2.718}$**。

  </details>

- **Coupon collector:$n$ 種贈品各等機率,期望蒐集幾次集滿?總次數的 variance(大 $n$)?**
  <details><summary>技巧+答案</summary>

  技巧:各階段獨立幾何相加,$E=\sum_{k=1}^n \frac n{k}=nH_n$,$\mathrm{Var}=\sum_{k=1}^n\frac{n^2(k-1)}{k^2}$(逐項幾何 variance);**答案/關鍵:$\boxed{E=nH_n\sim n\ln n+\gamma n}$;$\mathrm{Var}\to\dfrac{\pi^2}{6}n^2$(Basel)。注意這是「總次數」的 variance,並非最後一張(那張是幾何,variance $\sim n^2$)**。

  </details>

- **一副 52 張牌洗勻後翻牌,期望翻到第幾張才出現某指定花色(13 張)的第一張?**
  <details><summary>技巧+答案</summary>

  技巧:對稱性/等待時間公式 $E=\dfrac{N+1}{k+1}$($N$ 張中 $k$ 張為目標),等價於 13 張把其餘 39 張切成 14 段的期望間隔;**答案/關鍵:$\boxed{\dfrac{52+1}{13+1}=\dfrac{53}{14}\approx3.79}$**。

  </details>

- **抽 $\{1,\dots,n\}$ 不放回直到看到某固定數字,期望抽幾次?**
  <details><summary>技巧+答案</summary>

  技巧:目標數字在隨機排列中位置均勻分佈於 $1..n$;**答案/關鍵:$\boxed{(n+1)/2}$**。

  </details>

## 模式等待(Conway / Penney)

- **公平硬幣連擲,首次出現指定模式的期望次數:HH、HT、HHH、HTH 各為多少?**
  <details><summary>技巧+答案</summary>

  技巧:Conway leading-number,$E=\sum_{k:\ \text{長 }k\text{ 前綴}=\text{長 }k\text{ 後綴}}2^{k}$(自我重疊愈多、等愈久);**答案/關鍵:$\boxed{HT=4,\ HH=6,\ HTH=10\ (2{+}8),\ HHH=14\ (2{+}4{+}8)}$**。

  </details>

- **Penney's game:兩人各選一個長度 3 的 H/T 模式,先出現者勝——為何「後選者」總能佔上風?**
  <details><summary>技巧+答案</summary>

  技巧:賽局非遞移(non-transitive),對手選 $b_1b_2b_3$ 後,選 $\overline{b_2}\,b_1b_2$ 可壓制;勝率用 Conway 相關數之比;**答案/關鍵:$\boxed{\text{存在制勝反制,勝率恆 }>1/2\text{;偏好關係成環,無最優模式}}$**。

  </details>

## 順序統計量(iid $U(0,1)$)

- **$n$ 個 iid $U(0,1)$ 的最大值、最小值、全距(range)的期望?**
  <details><summary>技巧+答案</summary>

  技巧:第 $k$ 順序統計量 $U_{(k)}\sim\mathrm{Beta}(k,n-k+1)$,$E[U_{(k)}]=k/(n+1)$;**答案/關鍵:$E[\max]=\dfrac{n}{n+1}$,$E[\min]=\dfrac1{n+1}$,$\boxed{E[\text{range}]=\dfrac{n-1}{n+1}}$**。

  </details>

- **$n$ 個 iid $U(0,1)$ 的第 $k$ 順序統計量期望與 variance?**
  <details><summary>技巧+答案</summary>

  技巧:$\mathrm{Beta}(k,n{-}k{+}1)$ 的矩;**答案/關鍵:$E[U_{(k)}]=\dfrac{k}{n+1}$,$\boxed{\mathrm{Var}=\dfrac{k(n-k+1)}{(n+1)^2(n+2)}}$**。

  </details>

## 碰撞 / 生日類

- **生日問題:一年 $n$ 天,期望要幾個人才首次出現重複生日?($n=365$)**
  <details><summary>技巧+答案</summary>

  技巧:$E[N]=\sum_{m\ge0}P(\text{前 }m\text{ 人皆不同})=1+Q(n)$(Ramanujan Q-function),主項 $\sqrt{\pi n/2}$;**答案/關鍵:$\boxed{E\sim\sqrt{\pi n/2}+2/3}$;$n=365$ 主項 $\approx23.9$、精確 $E\approx24.6$ 人($m=23$ 已使機率過半)**。

  </details>

- **線上隨機朝向、碰到就掉頭的螞蟻($n$ 隻),「全程不曾發生任何碰撞」的機率?**
  <details><summary>技巧+答案</summary>

  技巧:碰撞掉頭 $\equiv$ 穿越(貼標籤等價),故所有螞蟻必在有限時間內全數掉落(機率 1);不碰撞 $\iff$ 全部同向;**答案/關鍵:$\boxed{2^{1-n}}$(全左或全右);環上任何非全同向組態必發生碰撞**。

  </details>

## 排列 / 循環結構

- **100 囚犯開盒:各開 50 個抽屜,採「循環跟隨」(從自己編號盒開始),全部找到自己編號的機率?**
  <details><summary>技巧+答案</summary>

  技巧:成功 $\iff$ 隨機排列最長循環 $\le 50$;$P=1-\sum_{k=51}^{100}\frac1k$;**答案/關鍵:$\boxed{1-\sum_{k=51}^{100}\frac1k\approx0.3118}$,大 $n$ 極限 $1-\ln2\approx0.307$**。

  </details>

- **$n$ 封信隨機塞入 $n$ 個信封,無人拿對的機率(錯排)?期望拿對幾封?**
  <details><summary>技巧+答案</summary>

  技巧:錯排 $D_n=n!\sum_{k=0}^n(-1)^k/k!$;拿對數用指示變數 $\sum \mathbb 1$;**答案/關鍵:$P=\boxed{\sum_{k=0}^n(-1)^k/k!\to 1/e}$;期望拿對數恰為 $1$(與 $n$ 無關)**。

  </details>

- **隨機排列 $S_n$:期望有幾個循環?期望有幾個「紀錄值 / 左到右最大值」?**
  <details><summary>技巧+答案</summary>

  技巧:元素 $i$ 為某循環最小者(或位置 $i$ 為紀錄)的機率 $=1/i$,指示變數求和;**答案/關鍵:兩者皆 $\boxed{H_n=\sum_{i=1}^n 1/i\sim\ln n+\gamma}$;循環數服從近似 Poisson**。

  </details>

## 隨機漫步 / 最優停止

- **Gambler's ruin:每步以 $p$ 進 $1$、$q=1-p$ 退 $1$,從 $i$ 出發、$0$ 或 $N$ 停止,破產(觸 0)機率?公平時的期望時長?**
  <details><summary>技巧+答案</summary>

  技巧:調和方程 $P_i=pP_{i+1}+qP_{i-1}$,令 $r=q/p$;時長解 $D_i=pD_{i+1}+qD_{i-1}+1$;**答案/關鍵:$p\ne q$ 時觸 $N$ 的機率 $=\dfrac{1-r^i}{1-r^N}$;$p=q=\tfrac12$ 時觸 $N$ 機率 $=i/N$、期望時長 $\boxed{i(N-i)}$**。

  </details>

- **Secretary / 最優停止:$n$ 位候選人隨機出場,只能即時取捨,最大化選中「全場最佳」的機率——策略與勝率?**
  <details><summary>技巧+答案</summary>

  技巧:先觀察(拒絕)前 $r-1$ 位設門檻,之後選第一個超越者;最優門檻 $r/n\to 1/e$;**答案/關鍵:$\boxed{\text{跳過前 }n/e\ (\approx37\%)\text{,成功機率 }\to 1/e\approx0.368}$(與 $n$ 幾乎無關)**。

  </details>

## 悖論類(要能說清楚陷阱)

- **兩信封悖論:一封是另一封的兩倍,看到 $X$ 後「換」的期望是 $\frac12(2X)+\frac12(X/2)=1.25X$,該換嗎?**
  <details><summary>技巧+答案</summary>

  技巧:$1.25X$ 把不同條件下的金額都寫成同一個 $X$;不存在可歸一的先驗使「$X$ 為較小/較大」各半且獨立於 $X$;**答案/關鍵:$\boxed{\text{錯在把 }X\text{ 當定值兩用;對稱下換與不換期望相同}}$**。

  </details>

- **St. Petersburg 悖論:首次正面在第 $k$ 次擲時獲利 $2^k$,期望獎金?合理入場費?**
  <details><summary>技巧+答案</summary>

  技巧:$E=\sum_{k\ge1}2^{-k}\cdot2^k=\sum 1=\infty$;實務用對數效用 $E[\log]$ 收斂;**答案/關鍵:$\boxed{E=\infty}$,但有限財富/對數效用下的公平價僅約幾塊錢**。

  </details>

## 貝氏 / 條件機率

- **三門問題:選定一門後,主持人(知道車在哪)開另一扇有山羊的門,換門勝率?若主持人「隨機」開門、恰好開到山羊呢?**
  <details><summary>技巧+答案</summary>

  技巧:比似然比。標準版主持人「必開山羊」對你原門無資訊,原門保持 $1/3$;隨機版「恰好沒開到車」本身是資訊,把原門更新為 $1/2$;**答案/關鍵:標準版換門 $\boxed{2/3}$;Monty Fall(隨機開門)版 $\boxed{1/2}$,換不換皆可——先問清「主持人協定」再作答**。

  </details>

- **病檢偽陽:盛行率 $1\%$,靈敏度 $99\%$、特異度 $99\%$,驗出陽性,真有病的機率?**
  <details><summary>技巧+答案</summary>

  技巧:用自然頻率:$10000$ 人 → $100$ 病人出 $99$ 真陽、$9900$ 健康人出 $99$ 偽陽;**答案/關鍵:$\frac{99}{99+99}=\boxed{50\%}$;若特異度降為 $95\%$(偽陽 $5\%$)→ $\frac{99}{99+495}=\boxed{1/6\approx16.7\%}$。低盛行率下後驗被偽陽主宰**。

  </details>

- **兩個孩子:「至少一個是男孩」vs「老大是男孩」vs「至少一個是星期二出生的男孩」,兩個都是男孩的機率?**
  <details><summary>技巧+答案</summary>

  技巧:列樣本空間;星期版每孩 $14$ 種(性別 × 星期),條件集 $2\cdot14-1=27$、其中兩男 $2\cdot7-1=13$;**答案/關鍵:依序 $\boxed{1/3}$、$\boxed{1/2}$、$\boxed{13/27}$;男孩帶特徵機率 $\varepsilon$ 時 $P=\frac{2-\varepsilon}{4-\varepsilon}$,特徵愈稀有愈趨近 $1/2$**。

  </details>

- **偏幣後驗:未知偏差硬幣 $p\sim U(0,1)$,連擲 $k$ 次皆正面,下一次也是正面的機率?**
  <details><summary>技巧+答案</summary>

  技巧:共軛更新 $\mathrm{Beta}(1,1)\to\mathrm{Beta}(k{+}1,1)$,$P(\text{H})=E[p\mid\text{data}]$;**答案/關鍵:$\boxed{\frac{k+1}{k+2}}$(Laplace rule of succession;一般 $n$ 擲 $s$ 正 → $\frac{s+1}{n+2}$)**。

  </details>

- **三囚犯悖論:A、B、C 恰一人獲赦(均勻)。A 問獄卒「B、C 之中誰會被處決」,獄卒答 B。A 的生還機率變多少?**
  <details><summary>技巧+答案</summary>

  技巧:同 Monty Hall——獄卒被迫從 B/C 指一人,對 A 無資訊,更新全被 C 吸收;**答案/關鍵:A 仍 $\boxed{1/3}$、C 升為 $2/3$;但若獄卒有偏(能說 B 就說 B),聽到 B 時 A 變 $1/2$——答案取決於資訊的產生機制,不是資訊本身**。

  </details>

## Poisson / 指數

- **等公車(inspection paradox):公車按 Poisson 到站、平均間隔 $10$ 分鐘。隨機時刻到站牌,期望等多久?你所在班距平均多長?**
  <details><summary>技巧+答案</summary>

  技巧:無記憶性 → 剩餘等待 $\sim\mathrm{Exp}(\lambda)$;長間隔更容易「罩住」你(length-biased,密度 $\propto x f(x)$);**答案/關鍵:等 $\boxed{10}$ 分鐘(不是 5!),含你的班距期望 $\frac{E[X^2]}{E[X]}=\boxed{20}$ 分鐘;一般間隔分佈等待期望 $=\frac{E[X^2]}{2E[X]}\ge\frac{E[X]}2$,等號僅在定時發車**。

  </details>

- **競速指數:$X_i\sim\mathrm{Exp}(\lambda_i)$ 獨立,$\min$ 的分佈?$P(X<Y)$?**
  <details><summary>技巧+答案</summary>

  技巧:$P(\min>t)=\prod_i e^{-\lambda_i t}=e^{-(\sum\lambda_i)t}$;**答案/關鍵:$\min\sim\mathrm{Exp}(\sum\lambda_i)$(rate 相加);$\boxed{P(X<Y)=\frac{\lambda_x}{\lambda_x+\lambda_y}}$;「誰是最小」與「最小值多大」互相獨立**。

  </details>

- **Poisson 疊加與 thinning:合併兩條獨立 Poisson 流會怎樣?對 rate $\lambda$ 的流,每事件獨立以機率 $p$ 保留呢?**
  <details><summary>技巧+答案</summary>

  技巧:直接算 $N(t)$ 的分佈或用生成函數;**答案/關鍵:疊加 $\to\mathrm{Poisson}(\lambda_1+\lambda_2)$,且每事件來自流 1 的機率 $\frac{\lambda_1}{\lambda_1+\lambda_2}$(獨立);thinning $\to\mathrm{Poisson}(p\lambda)$,且$\boxed{\text{保留流與丟棄流互相獨立}}$(反直覺,必考)**。

  </details>

- **無記憶性陷阱:郵局兩窗口都在服務、你排第一,服務時間 iid $\mathrm{Exp}(\lambda)$。你是三人中最後離開的機率?**
  <details><summary>技巧+答案</summary>

  技巧:第一人離開瞬間,另一窗口的剩餘服務因無記憶性重置為全新 $\mathrm{Exp}(\lambda)$,與你的服務對稱;**答案/關鍵:$\boxed{1/2}$;你的期望總停留 $=\frac1{2\lambda}+\frac1\lambda=\frac3{2\lambda}$。同理「已用 3 年的指數壽命燈泡」剩餘壽命分佈 = 全新**。

  </details>

- **首事件條件均勻:Poisson 過程 rate $\lambda$,已知 $[0,t]$ 內恰發生 $1$ 件,事件時刻的分佈?已知 $N(t)=n$ 呢?**
  <details><summary>技巧+答案</summary>

  技巧:$P(T_1\le s\mid N(t)=1)=\frac{P(N(s)=1)\,P(N(t)-N(s)=0)}{P(N(t)=1)}=\frac st$;**答案/關鍵:$\boxed{U(0,t)}$、與 $\lambda$ 無關;$N(t)=n$ 時 $n$ 個時刻 $\overset{d}{=}$ $n$ 個 iid $U(0,t)$ 的順序統計量;陷阱:$E[T_1\mid N(t)=1]=t/2$ 而非 $1/\lambda$**。

  </details>
