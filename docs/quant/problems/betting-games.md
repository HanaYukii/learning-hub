---
title: Kelly・賭注 sizing・做市 EV 遊戲(艱深)
track: math
category: betting
reviewed: 2026-07-02
review_interval: 21
---

# Kelly・賭注 sizing・做市 EV 遊戲(艱深)

> 艱深題庫:每題「題目 + 技巧 + 解法/答案」。面試前快速複習。

## Kelly 與 bet sizing

- **推導 Kelly:賠率 $b$(押 1 贏 $b$)、勝率 $p$、$q=1-p$,每輪押財富比例 $f$,求長期成長最快的 $f^*$。**
  <details><summary>技巧+答案</summary>

  技巧:最大化 $\mathbb{E}[\log W]$(log-utility ⇔ 幾何成長率);$g(f)=p\log(1+bf)+q\log(1-f)$,令 $g'(f^*)=0$。**答案:$f^*=\dfrac{bp-q}{b}=$ edge/odds**;直覺:分子 $bp-q$ 是每 \$1 注的期望淨利(edge),再除以賠率。$bp>q$ 才下注。

  </details>

- **為何實務全都用 fractional Kelly(如 half-Kelly)?**
  <details><summary>技巧+答案</summary>

  技巧:$g(f)$ 是倒 U 形、右側懸崖——押到 $2f^*$ 成長率歸零、再多轉負;edge 估計有誤差時,over-bet 懲罰 ≫ under-bet(不對稱)。**關鍵:押 $c\,f^*$ 得成長率 $c(2-c)\,g_{\max}$ ⇒ half-Kelly 保住 75% 成長、log-wealth 波動只剩一半**;參數不確定 = 有效 edge 更低,故打折。

  </details>

- **連續版 Kelly:資產超額報酬 $\mu-r$、波動 $\sigma$,最優槓桿?**
  <details><summary>技巧+答案</summary>

  技巧:GBM 下 $g(f)=r+f(\mu-r)-\tfrac12 f^2\sigma^2$,求極值。**答案:$f^*=\dfrac{\mu-r}{\sigma^2}$**(可 $>1$ 即開槓桿);最優成長率多出 $\dfrac{(\mu-r)^2}{2\sigma^2}=\tfrac12\,$Sharpe$^2$。

  </details>

- **押 full Kelly,財富曾跌到初始 $x$ 倍($x<1$)的機率?押 $c\,f^*$ 呢?**
  <details><summary>技巧+答案</summary>

  技巧:log-wealth 是帶漂移 BM(漂移 $m$、variance $s^2$),單邊觸壁機率 $x^{2m/s^2}$,代入得指數 $2/c-1$。**答案:full Kelly 機率 $=x$(腰斬機率 50%!);fractional 為 $x^{2/c-1}$,half-Kelly 腰斬機率僅 $(1/2)^3=12.5\%$**——打折的量化理由(Thorp)。

  </details>

- **同時押 2 個獨立、勝率 60% 的公平賠率硬幣,每個押多少?**
  <details><summary>技巧+答案</summary>

  技巧:最大化 $\mathbb{E}\log(1+fX_1+fX_2)$,對稱 + 一階條件:$\tfrac{0.72}{1+2f}=\tfrac{0.32}{1-2f}$。**答案:每個 $f=5/26\approx19.2\%$(單押是 20%),總曝險 $\approx38.5\%\gg20\%$**——分散讓「總注碼變大、單注略減」。

  </details>

- **Haghani–Dewey 實驗:給你 \$25、一枚 60% 出正面的硬幣、公平賠率、30 分鐘(約 300 注)、獎金上限 \$250,怎麼玩?**
  <details><summary>技巧+答案</summary>

  技巧:直接套 Kelly:$f^*=(0.6-0.4)/1=20\%$;有上限/有限局數 ⇒ 接近上限時縮注、實務再打折至 10–20%。**答案/關鍵:固定押 10–20% 幾乎必達上限;實驗裡 61 名金融科班生 28% 破產、僅 21% 達標**——知道公式 ≠ 會 sizing。

  </details>

- **馬場 Kelly(bet your beliefs):$n$ 匹馬、賠率 $o_i$-for-1(公平:$\sum 1/o_i=1$)、你的機率 $p_i$,每輪財富全額分配,怎麼押?**
  <details><summary>技巧+答案</summary>

  技巧:$\max\sum p_i\log(f_i o_i)$ s.t. $\sum f_i=1$,Lagrange ⇒ $p_i/f_i=\lambda$。**答案:$f_i^*=p_i$——與賠率完全無關!**成長率 $W^*=\sum p_i\log(p_i o_i)=D(p\Vert r)$($r_i=1/o_i$ 是市場隱含機率)⇒ **長期成長率 = 你的分佈與市場分佈的 KL 散度**(Cover–Thomas)。

  </details>

- **Proebsting's paradox:$p=\tfrac12$,先開 2:1,你按 Kelly 押 $f=(2\cdot\tfrac12-\tfrac12)/2=25\%$;結算前又開 5:1、再更好……每次都對同一事件按 Kelly 加碼,會怎樣?**
  <details><summary>技巧+答案</summary>

  技巧:Kelly 是對「最終財富分佈」的聯合最佳化,不能對同一事件逐筆 myopic 套用。**答案/關鍵:賠率一路變好(如不斷翻倍)時,逐筆 Kelly 的總注碼可被推到任意接近 100%,事件輸(機率 ½)即近乎破產**——同一風險源的多筆注必須合併算總曝險(Thorp)。

  </details>

## 骰子與序列停止

- **擲一顆骰子拿點數,可免費重擲一次,期望?可重擲 $n$ 次呢?**
  <details><summary>技巧+答案</summary>

  技巧:backward induction:續擲值 3.5 ⇒ 首擲 $\ge4$ 保留。**答案:$E_1=\tfrac{4+5+6}{6}+\tfrac36\cdot3.5=4.25$;遞推 $E_{n+1}=\tfrac16\sum_{k=1}^{6}\max(k,E_n)$**,得 $3.5,\;4.25,\;14/3\approx4.67,\;89/18\approx4.94,\dots\to6$(門檻隨 $E_n$ 上移)。

  </details>

- **100 面骰拿面值 \$1–\$100,可付 \$1 無限次重擲(首擲免費),策略與遊戲價值?**
  <details><summary>技巧+答案</summary>

  技巧:最優停止 + 自洽:保留 iff $x\ge V-1$;門檻 $T$ 下 $V=\mathbb{E}[X\mid X\ge T]-\tfrac{1-p}{p}$,$p=\tfrac{101-T}{100}$。**答案:$T=87$($\le86$ 重擲),$V=93.5-\tfrac{43}{7}=\tfrac{1223}{14}\approx\$87.36$**;口訣:門檻 $\approx$ 遊戲價值 $-$ 重擲成本。

  </details>

## 做市與 EV 賽局

- **面試官:“Make me a market on 兩顆骰子之和。”怎麼報?**
  <details><summary>技巧+答案</summary>

  技巧:三步:① fair value $=$ EV $=7$;② 繞 EV 開雙邊(如 **6.5 bid / 7.5 ask**),寬度反映你對 EV 的不確定度;③ 被 lift(對方買)⇒ 上移報價、控庫存與 size。**關鍵:spread 要補償 variance + 對手可能 informed;報價前先確認自己雙邊都願意成交。**

  </details>

- **Adverse selection:資產值 $V_H$ 或 $V_L$ 各半,比例 $\pi$ 的訂單是 informed(方向必對),其餘買賣各半,零利潤 bid/ask?**
  <details><summary>技巧+答案</summary>

  技巧:Glosten–Milgrom:ask $=\mathbb{E}[V\mid\text{buy}]$、bid $=\mathbb{E}[V\mid\text{sell}]$(貝氏更新)。**答案:ask $=\mu+\tfrac{\pi}{2}(V_H-V_L)$、bid $=\mu-\tfrac{\pi}{2}(V_H-V_L)$ ⇒ spread $=\pi(V_H-V_L)$**;直覺:向 noise trader 收的 spread 恰好貼補被 informed 吃掉的錢,informed 越多 spread 越寬。

  </details>

- **Acquiring a company:公司對現任者值 $V\sim U[0,100]$,對你值 $1.5V$;出價 $b$,對方 iff $V\le b$ 才賣。最優 $b$?**
  <details><summary>技巧+答案</summary>

  技巧:**condition on 成交**:$\mathbb{E}[\text{利潤}]=\tfrac{b}{100}\big(1.5\cdot\tfrac{b}{2}-b\big)=-\tfrac{b^2}{400}$。**答案:$b^*=0$,任何 $b>0$ 都虧**——「成交」本身就是壞消息,adverse selection 的極致版。

  </details>

- **Common value 拍賣(估罐中硬幣數後競標),怎麼出價?**
  <details><summary>技巧+答案</summary>

  技巧:winner's curse 一句話:**你贏 ⇔ 你的估計是全場最高 ⇒ $\mathbb{E}[V\mid\text{你贏}]<$ 無條件估計,必須先 shade(下修)再出價;競標人越多 shade 越深。**

  </details>

## Sizing 陷阱

- **每輪全押「$+50\%$ / $-40\%$ 各半」,單輪 EV $=+5\%$,長期會怎樣?**
  <details><summary>技巧+答案</summary>

  技巧:看 $\mathbb{E}[\log]$ 不看 $\mathbb{E}$:$\tfrac12\ln1.5+\tfrac12\ln0.6\approx-0.053<0$。**答案:財富 a.s. $\to0$!variance 拖累 $g\approx\mu-\tfrac{\sigma^2}{2}$**;$\mathbb{E}[W_n]$ 被極小機率的暴富路徑撐大、typical path 幾何衰減。此局 Kelly:$f^*=\tfrac{p}{0.4}-\tfrac{q}{0.5}=25\%$——sizing 本身就是答案。

  </details>

---

參考:Thorp《Understanding the Kelly Criterion》、MacLean–Thorp–Ziemba《Good and Bad Properties of the Kelly Criterion》、Cover–Thomas《Elements of Information Theory》Ch.6、Haghani–Dewey《Observed Betting Patterns on a Biased Coin》(2016)。
