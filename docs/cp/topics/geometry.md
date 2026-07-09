---
title: 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)
tags: [幾何]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)

> 弱項專題懶人包(不等比賽,主動補):每題「題意 + 核心作法」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **cross 全程整數**:座標 $10^9$ 時單次 cross 可達 $8\times10^{18}$ 貼 `long long` 上界,求和/比較兩個 cross 就上 `__int128`。
- **凸包(Andrew 單調鏈)**:pop 條件 `<=` 去共線點、`<` 保留;易錯:$n<3$、全點共線的退化。
- **旋轉卡尺**:凸包上對踵點**單調移動** → 最遠點對/直徑/寬度 $O(n)$。內層 `while (cross(p[i],p[i+1],p[j+1]) > cross(p[i],p[i+1],p[j])) j++`。觸發:「凸包上找最X的一對」。
- **極角排序禁用 atan2 當比較器**(精度炸):先按半平面分類 `half(p) = (y<0) || (y==0 && x>0)`,同半平面用 cross 比;真的要量角度才用 `long double atan2(cross, dot)`。
- **半平面交**:半平面按方向角排序 + 雙端隊列;加入新半平面時,**隊尾兩線交點在新半平面外側就彈隊尾**(隊首同理),收尾用隊首再檢查隊尾。觸發:多邊形核、可行域、視野。
- **變換成直線再上凸殼**:見到拋物線 $y=x^2+bx+c$、距離平方、單調包絡 → 先做座標變換(如 $y'=y-x^2$)把「在上方」變成半平面條件。實數二分固定迭代 ~100 次,eps 只留給輸出。

## 題目

- **[CF1C. Ancient Berland Circus](https://codeforces.com/problemset/problem/1/C)** `幾何` `~2100`
  題意:給正多邊形的三個頂點座標(實數,$|$座標$|\le 1000$),求該正多邊形可能的最小面積;保證最優邊數 $n\le 100$。
  作法:三點定外接圓 $R=\frac{a}{2\sin A}$;三個圓心角 $2A,2B,2C$ 做**實數 gcd**(fmod+eps,靠 $n\le 100$ 撐住精度)得單位角 $\frac{2\pi}{n}$,面積 $=\frac{n}{2}R^2\sin\frac{2\pi}{n}$。

- **[CF340B. Maximal Area Quadrilateral](https://codeforces.com/problemset/problem/340/B)** `幾何` `~2100`
  題意:平面 $n\le 300$ 個點、無三點共線,選 4 點作簡單四邊形(不必凸),最大化面積。
  作法:**枚舉對角線** $(i,j)$,兩側各取 $|\text{cross}|$ 最大的三角形拼成四邊形,$O(n^3)$;兩側都須非空(凹四邊形也被它的內部對角線涵蓋)。

- **[CF166B. Polygons](https://codeforces.com/problemset/problem/166/B)** `幾何` `~2100`
  題意:給嚴格凸多邊形 $A$($n\le 10^5$)與任意簡單多邊形 $B$($m\le 2\cdot 10^4$),頂點皆順時針、$|$座標$|\le 10^9$;判 $B$ 是否**嚴格**在 $A$ 內(頂點落在 $A$ 的邊上即 NO)。
  作法:$A$ 凸 ⇒ 只需判 $B$ 的每個頂點:以 $A_0$ 扇形剖分,二分角度區間再 cross 判**嚴格**內部,單點 $O(\log n)$。

- **[CF1059D. Nature Reserve](https://codeforces.com/problemset/problem/1059/D)** `幾何` `~2200`
  題意:$n\le 10^5$ 個點($y_i\ne 0$,$|$座標$|\le 10^7$),求最小半徑的圓,包含所有點且與直線 $y=0$ 恰有一個公共點(相切);不可能輸出 $-1$。
  作法:點分佈在河兩側即 $-1$;否則**二分 $r$**:每點限制圓心橫座標在 $x_i\pm\sqrt{y_i(2r-y_i)}$(需 $y_i\le 2r$),**區間交**非空即可行。固定迭代 ~100 次抗精度。

- **[CF598C. Nearest vectors](https://codeforces.com/problemset/problem/598/C)** `幾何` `~2300`
  題意:$n\le 10^5$ 個由原點出發的向量($|x|,|y|\le 10^4$,無兩向量同向),求非定向夾角($\in[0,\pi]$)最小的一對,輸出編號。
  作法:最小夾角必在**極角排序後相鄰**(含首尾環):排序用象限+cross 的整數比較器,量角度才用 `long double atan2(cross, dot)`。直接拿 double atan2 排序會 WA,本題就是精度課。

- **[CF1142C. U2](https://codeforces.com/problemset/problem/1142/C)** `幾何` `~2400`
  題意:$n\le 10^5$ 個相異整數點($|$座標$|\le 10^6$);對每對 $x$ 不同的點畫過兩點的拋物線 $y=x^2+bx+c$,數多少條拋物線的**嚴格上方**區域不含任何給定點。
  作法:**變換 $y'=y-x^2$** 後拋物線變直線、「嚴格在上方」變半平面 → 答案 = 變換後點集**上凸殼**的非豎直邊數;同 $x$ 只留 $y$ 最大的點。

- **[CF1017E. The Supersonic Rocket](https://codeforces.com/problemset/problem/1017/E)** `幾何` `~2400`
  題意:兩個點集($3\le n,m\le 10^5$)各可整體任意平移+旋轉;合體後的 power field 是聯集所有點的凸組合(=凸包),問能否操作到「刪去任一點都不改變 power field」。
  作法:條件 ⟺ 兩凸包**旋轉+平移全等**:把凸包編碼成 $(|e_i|^2,\ \text{cross}(e_i,e_{i+1}),\ \text{dot}(e_i,e_{i+1}))$ 序列,判**循環同構**:一串倍長、另一串當 pattern 跑 KMP。

- **[CF1284E. New Year and Castle Construction](https://codeforces.com/problemset/problem/1284/E)** `幾何` `~2500`
  題意:$n\le 2500$ 個點、無三點共線;$f(p)$ = 由其他 4 點構成、**嚴格**包住 $p$ 的簡單四邊形數(同一 4 點子集只算一次),求 $\sum_p f(p)$。
  作法:對每個 $p$ 用**補集**:$\binom{n-1}{4}$ 減去「4 點全落在過 $p$ 某開半平面內」的子集數——繞 $p$ **極角排序** + two pointers,對每點數出夾角 $<\pi$ 內的 $k$ 個點,累加 $\binom{k}{3}$。$O(n^2\log n)$。
