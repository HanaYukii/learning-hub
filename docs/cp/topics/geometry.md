---
title: 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)
tags: [幾何]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)

> 弱項專題懶人包(不等比賽,主動補):每題「技巧 + 作法 1–2 行」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **cross 判向是一切**:$\text{cross}(O,A,B)=(A_x{-}O_x)(B_y{-}O_y)-(A_y{-}O_y)(B_x{-}O_x)$,$>0$ 左轉。**全程整數運算**;座標 $10^9$ 時單次 cross 可達 $8\times10^{18}$ 貼 `long long` 上界,求和/比較兩個 cross 用 `__int128`。
- **凸包(Andrew 單調鏈)**:按 $(x,y)$ 排序,下殼+上殼各掃一遍,`while (cross(h[k-2],h[k-1],p) <= 0) pop`(`<=` 去共線點、`<` 保留)。易錯:$n<3$、全點共線的退化。
- **旋轉卡尺**:凸包上對踵點**單調移動** → 最遠點對/直徑/寬度 $O(n)$。內層 `while (cross(p[i],p[i+1],p[j+1]) > cross(p[i],p[i+1],p[j])) j++`。觸發:「凸包上找最X的一對」。
- **極角排序禁用 atan2 當比較器**(精度炸):先按半平面分類 `half(p) = (y<0) || (y==0 && x>0)`,同半平面用 cross 比;真的要量角度才用 `long double atan2(cross, dot)`。
- **半平面交**:半平面按方向角排序 + 雙端隊列;加入新半平面時,**隊尾兩線交點在新半平面外側就彈隊尾**(隊首同理),收尾用隊首再檢查隊尾。觸發:多邊形核、可行域、視野。
- **變換成直線再上凸殼**:見到拋物線 $y=x^2+bx+c$、距離平方、單調包絡 → 先做座標變換(如 $y'=y-x^2$)把「在上方」變成半平面條件。實數二分固定迭代 ~100 次,eps 只留給輸出。

## 題目

- **[Ancient Berland Circus (CF1C)](https://codeforces.com/problemset/problem/1/C)** `幾何` `~2100`
  作法:三點定外接圓 $R=\frac{a}{2\sin A}$;三個圓心角 $2A,2B,2C$ 做**實數 gcd**(fmod+eps)得單位角 $\frac{2\pi}{n}$(題保證 $n\le 100$,eps 靠此撐住),面積 $=\frac{n}{2}R^2\sin\frac{2\pi}{n}$。

- **[Maximal Area Quadrilateral (CF340B)](https://codeforces.com/problemset/problem/340/B)** `幾何` `~2100`
  作法:**枚舉對角線** $(i,j)$,兩側各取 $|\text{cross}|$ 最大的三角形拼成四邊形,$O(n^3)$;注意兩側都須非空。

- **[Polygons (CF166B)](https://codeforces.com/problemset/problem/166/B)** `幾何` `~2100`
  作法:判 B 每個頂點是否**嚴格**在凸多邊形 A 內:以 $A_0$ 扇形剖分,二分角度區間再 cross 判內部,單點 $O(\log n)$;落在邊上即 NO。

- **[Nature Reserve (CF1059D)](https://codeforces.com/problemset/problem/1059/D)** `幾何` `~2200`
  作法:圓切 $y=0$ 且蓋住所有點 → 先判所有 $y$ 同號;**二分 $r$**,每點給圓心橫座標可行區間 $x_i\pm\sqrt{y_i(2r-y_i)}$(需 $y_i\le 2r$),**區間交**非空即可行。固定迭代 ~100 次抗精度。

- **[Nearest vectors (CF598C)](https://codeforces.com/problemset/problem/598/C)** `幾何` `~2300`
  作法:最小夾角必在**極角排序後相鄰**(含首尾環):排序用象限+cross 的整數比較器,量角度用 `long double atan2(cross, dot)`。直接拿 double atan2 排序會 WA,本題就是精度課。

- **[U2 (CF1142C)](https://codeforces.com/problemset/problem/1142/C)** `幾何` `~2400`
  作法:**變換 $y'=y-x^2$** 後拋物線變直線、「嚴格在上方」變半平面 → 答案 = 變換後點集**上凸殼**的非豎直邊數;同 $x$ 只留 $y$ 最大的點。

- **[The Supersonic Rocket (CF1017E)](https://codeforces.com/problemset/problem/1017/E)** `幾何` `~2400`
  作法:兩引擎等價 ⟺ 兩凸包**旋轉+平移全等**:把凸包編碼成 $(|e_i|^2,\ \text{cross}(e_i,e_{i+1}),\ \text{dot}(e_i,e_{i+1}))$ 序列,判**循環同構**:一串倍長、另一串當 pattern 跑 KMP。

- **[New Year and Castle Construction (CF1284E)](https://codeforces.com/problemset/problem/1284/E)** `幾何` `~2500`
  作法:$f=\sum_p$(嚴格包圍 $p$ 的 4 點子集數),對每個 $p$ 用**補集**:$\binom{n-1}{4}$ 減去「4 點全落在過 $p$ 某開半平面內」的子集數 —— 繞 $p$ **極角排序** + two pointers,對每點數出夾角 $<\pi$ 內的 $k$ 個點,累加 $\binom{k}{3}$。$O(n^2\log n)$。
