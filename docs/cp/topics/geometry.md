---
title: 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)
tags: [幾何]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:計算幾何(凸包/旋轉卡尺/極角/半平面)

> 弱項專題懶人包(不等比賽,主動補):每題「題意 + 核心作法」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。
> 版面:題意含小例、作法含關鍵片段。

## 核心模板 / 觸發

- **cross 全程整數**:座標 $10^9$ 時單次 cross 可達 $8\times10^{18}$ 貼 `long long` 上界,求和/比較兩個 cross 就上 `__int128`。
- **凸包(Andrew 單調鏈)**:pop 條件 `<=` 去共線點、`<` 保留;易錯:$n<3$、全點共線的退化。
- **旋轉卡尺**:凸包上對踵點**單調移動** → 最遠點對/直徑/寬度 $O(n)$。內層 `while (cross(p[i],p[i+1],p[j+1]) > cross(p[i],p[i+1],p[j])) j++`。觸發:「凸包上找最X的一對」。
- **極角排序禁用 atan2 當比較器**(精度炸):先按半平面分類 `half(p) = (y<0) || (y==0 && x>0)`,同半平面用 cross 比;真的要量角度才用 `long double atan2(cross, dot)`。
- **半平面交**:半平面按方向角排序 + 雙端隊列;加入新半平面時,**隊尾兩線交點在新半平面外側就彈隊尾**(隊首同理),收尾用隊首再檢查隊尾。觸發:多邊形核、可行域、視野。
- **變換成直線再上凸殼**:見到拋物線 $y=x^2+bx+c$、距離平方、單調包絡 → 先做座標變換(如 $y'=y-x^2$)把「在上方」變成半平面條件。實數二分固定迭代 ~100 次,eps 只留給輸出。

## 題目

### [CF1C. Ancient Berland Circus](https://codeforces.com/problemset/problem/1/C)
`幾何` `~2100`

::: info 題意
給定三個點的座標(三行、每行一對實數,$|$座標$|\le 1000$、小數點後至多 6 位),它們是某個正多邊形競技場僅存的三根柱子,即該多邊形的三個頂點。

<svg viewBox="0 0 360 250" width="360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三點定外接圓,補回正多邊形:例中三柱補成正方形">
  <circle cx="170" cy="118" r="63.6" fill="var(--vp-c-default-soft)" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
  <path d="M 125 163 L 215 163 L 215 73 L 125 73 Z" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2"/>
  <circle cx="170" cy="118" r="3" fill="currentColor"/>
  <circle cx="125" cy="163" r="6" fill="var(--vp-c-brand-1)"/>
  <circle cx="215" cy="163" r="6" fill="var(--vp-c-brand-1)"/>
  <circle cx="125" cy="73" r="6" fill="var(--vp-c-brand-1)"/>
  <circle cx="215" cy="73" r="6" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="100" y="180" text-anchor="middle" font-size="12" fill="currentColor">(0,0)</text>
  <text x="242" y="180" text-anchor="middle" font-size="12" fill="currentColor">(1,0)</text>
  <text x="98" y="70" text-anchor="middle" font-size="12" fill="currentColor">(0,1)</text>
  <text x="245" y="70" text-anchor="middle" font-size="12" fill="currentColor">(1,1)</text>
  <text x="170" y="110" text-anchor="middle" font-size="12" fill="currentColor">O</text>
  <text x="180" y="240" text-anchor="middle" font-size="12" fill="currentColor">三根柱子(實心)定外接圓,補回虛線頂點 ⇒ 正方形,n = 4</text>
</svg>

求/輸出:這個正多邊形可能的最小面積,輸出一個實數(至少 6 位小數);保證最優解的邊數 $n\le 100$。

例:三柱 $(0,0),(1,0),(0,1)$ → 外接圓心 $(0.5,0.5)$、$R=\frac{\sqrt2}{2}$,圓心角 $180^\circ,90^\circ,90^\circ$,gcd $=90^\circ$ ⇒ $n=4$,面積 $=\frac{4}{2}R^2\sin 90^\circ=1$(即補上 $(1,1)$ 的正方形)。
:::

::: tip 作法
三點定外接圓 $R=\frac{a}{2\sin A}$;三個圓心角 $2A,2B,2C$ 做**實數 gcd**(fmod+eps,靠 $n\le 100$ 撐住精度)得單位角 $\frac{2\pi}{n}$,面積 $=\frac{n}{2}R^2\sin\frac{2\pi}{n}$。
:::

### [CF340B. Maximal Area Quadrilateral](https://codeforces.com/problemset/problem/340/B)
`幾何` `~2100`

::: info 題意
給定平面上 $n$ 個相異「特殊點」($4\le n\le 300$,整數座標、$|$座標$|\le 1000$,保證無三點共線)。

四邊形 = 恰有 4 個頂點、無自交的簡單多邊形(**不必凸**);特殊四邊形 = 四個頂點皆取自給定點集。

求/輸出:特殊四邊形的最大面積(實數)。

例:$n=4$:$(0,0),(2,0),(1,1),(1,-1)$ → 取對角線 $(0,0)$–$(2,0)$,上側 $(1,1)$、下側 $(1,-1)$ 各成面積 $1$ 的三角形,拼出面積 $2$ 的箏形,即為答案。
:::

::: tip 作法
**枚舉對角線** $(i,j)$,兩側各取 $|\text{cross}|$ 最大的三角形拼成四邊形,$O(n^3)$;兩側都須非空(凹四邊形也被它的內部對角線涵蓋)。

```cpp
// sketch:枚舉對角線 (i,j),兩側各取最大三角形
double ans = 0;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) {
        long long up = -1, dn = -1;              // 兩側最大 |cross|
        for (int k = 0; k < n; k++) {
            long long c = cross(p[i], p[j], p[k]);
            if (c > 0) up = max(up, c);
            if (c < 0) dn = max(dn, -c);
        }
        if (up > 0 && dn > 0)                    // 兩側都須非空
            ans = max(ans, (up + dn) / 2.0);
    }
```
:::

### [CF166B. Polygons](https://codeforces.com/problemset/problem/166/B)
`幾何` `~2100`

::: info 題意
給定兩個非退化多邊形的頂點座標(整數,$|$座標$|\le 10^9$,皆按**順時針**給出):$A$ 嚴格凸($3\le n\le 10^5$),$B$ 是任意無自交、無自觸的簡單多邊形($3\le m\le 2\cdot 10^4$)。

判定 $B$ 是否**嚴格**在 $A$ 內部:$B$ 的所有點都須嚴格在 $A$ 內,$B$ 的頂點落在 $A$ 的邊上即不合法。求/輸出:YES 或 NO。

例:$A=$ 正方形 $(0,0),(0,5),(5,5),(5,0)$,$B=$ 三角形 $(1,1),(3,1),(2,2)$ → 三頂點皆在 $0<x,y<5$ 內 ⇒ YES;把 $B$ 的一個頂點改成 $(5,3)$(落在 $A$ 的邊上)⇒ NO。
:::

::: tip 作法
$A$ 凸 ⇒ 只需判 $B$ 的每個頂點:以 $A_0$ 扇形剖分,二分角度區間再 cross 判**嚴格**內部,單點 $O(\log n)$。

```cpp
// sketch:凸包內點二分判定(A 已轉逆時針,q 為 B 的頂點)
bool inside(P q) {                    // 嚴格內部才回 true
    if (cross(A[0], A[1], q) <= 0 || cross(A[0], A[n-1], q) >= 0)
        return false;                 // 扇形外 / 落在邊界射線上
    int lo = 1, hi = n - 1;           // 二分:q 落在哪個扇形
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        (cross(A[0], A[mid], q) > 0 ? lo : hi) = mid;
    }
    return cross(A[lo], A[lo + 1], q) > 0;   // > 0 嚴格;= 0 在邊上
}
```
:::

### [CF1059D. Nature Reserve](https://codeforces.com/problemset/problem/1059/D)
`幾何` `~2200`

::: info 題意
給定 $n\le 10^5$ 個動物巢穴的座標(整數,$|$座標$|\le 10^7$,且 $y_i\ne 0$),河流是直線 $y=0$。

保護區必須是一個圓:包含所有巢穴,且與河流**至少一個**公共點(動物要喝水)、**至多一個**公共點(不能擋船)——即與 $y=0$ 恰好相切。

求/輸出:若不可能輸出 $-1$;否則輸出最小可行半徑(實數,誤差 $10^{-6}$)。

例:兩巢 $(-1,1),(1,1)$ → 圓心必在 $y=r$;對稱取圓心 $(0,r)$,包住巢需 $1+(r-1)^2\le r^2\Rightarrow r\ge 1$ ⇒ 答案 $1$(圓心 $(0,1)$ 恰過兩巢並切河)。
:::

::: tip 作法
點分佈在河兩側即 $-1$;否則**二分 $r$**:每點限制圓心橫座標在 $x_i\pm\sqrt{y_i(2r-y_i)}$(需 $y_i\le 2r$),**區間交**非空即可行。固定迭代 ~100 次抗精度。

<svg viewBox="0 0 540 260" width="540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nature Reserve 示意:圓切河,兩巢各給圓心一段容許區間,區間交非空即可行">
  <line x1="30" y1="190" x2="510" y2="190" stroke="currentColor" stroke-width="1.5"/>
  <text x="500" y="180" text-anchor="end" font-size="12" fill="currentColor">河 y = 0</text>
  <circle cx="270" cy="120" r="70" fill="var(--vp-c-default-soft)" stroke="var(--vp-c-brand-1)" stroke-width="2"/>
  <line x1="270" y1="120" x2="270" y2="190" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
  <circle cx="270" cy="120" r="3" fill="var(--vp-c-brand-1)"/>
  <circle cx="270" cy="190" r="4" fill="var(--vp-c-brand-1)"/>
  <circle cx="200" cy="120" r="5" fill="currentColor"/>
  <circle cx="340" cy="120" r="5" fill="currentColor"/>
  <text x="193" y="108" text-anchor="middle" font-size="12" fill="currentColor">(-1,1)</text>
  <text x="347" y="108" text-anchor="middle" font-size="12" fill="currentColor">(1,1)</text>
  <line x1="130" y1="207" x2="270" y2="207" stroke="var(--vp-c-brand-1)" stroke-width="4" opacity="0.55"/>
  <line x1="270" y1="217" x2="410" y2="217" stroke="var(--vp-c-brand-1)" stroke-width="4" opacity="0.55"/>
  <text x="122" y="211" text-anchor="end" font-size="12" fill="currentColor">[-2,0]</text>
  <text x="418" y="221" text-anchor="start" font-size="12" fill="currentColor">[0,2]</text>
  <text x="270" y="248" text-anchor="middle" font-size="12" fill="currentColor">r = 1:每巢給圓心橫座標一段容許區間,區間交非空 ⇒ 可行(此例恰交於 x = 0)</text>
</svg>

```cpp
// sketch:二分 r 的可行性判定(區間交)
bool ok(double r) {
    double L = -1e18, R = 1e18;
    for (auto [x, y] : pts) {
        if (y > 2 * r) return false;        // 圓夾不住這個點
        double d = sqrt(y * (2 * r - y));   // 圓心橫座標容許半寬
        L = max(L, x - d); R = min(R, x + d);
    }
    return L <= R;                          // 區間交非空
}
// 主程式:先判兩側 → -1,再固定二分 ~100 次
```
:::

### [CF598C. Nearest vectors](https://codeforces.com/problemset/problem/598/C)
`幾何` `~2300`

::: info 題意
給定 $n$ 個從原點出發的非零向量($2\le n\le 10^5$,整數座標、$|x|,|y|\le 10^4$,保證無兩向量**同向**,反向允許)。

非定向夾角 = 兩向量順、逆時針方向角中較小者,取值 $\in[0,\pi]$。

求/輸出:非定向夾角最小的一對向量,輸出兩個編號(任一組最優解皆可)。

例:$v_1=(1,0)$、$v_2=(0,1)$、$v_3=(1,1)$、$v_4=(-1,0)$ → 極角序 $v_1(0^\circ),v_3(45^\circ),v_2(90^\circ),v_4(180^\circ)$,相鄰夾角 $45^\circ,45^\circ,90^\circ$、首尾繞回 $180^\circ$ → 最小 $45^\circ$,輸出 `1 3`(`2 3` 亦可)。
:::

::: tip 作法
最小夾角必在**極角排序後相鄰**(含首尾環):排序用象限+cross 的整數比較器,量角度才用 `long double atan2(cross, dot)`。直接拿 double atan2 排序會 WA,本題就是精度課。

```cpp
// sketch:整數極角比較器(禁 double atan2 排序)
int half(P p) { return p.y < 0 || (p.y == 0 && p.x > 0); }
bool cmp(P a, P b) {
    if (half(a) != half(b)) return half(a) < half(b);
    return (long long)a.x * b.y - (long long)a.y * b.x > 0;
}
// 排序後只比相鄰(含首尾繞回);量夾角才碰浮點:
// long double ang = atan2l(llabs(cross(a, b)), dot(a, b));
```
:::

### [CF1142C. U2](https://codeforces.com/problemset/problem/1142/C)
`幾何` `~2400`

::: info 題意
給定平面上 $n\le 10^5$ 個相異整數點($|$座標$|\le 10^6$)。

對每一對 $x$ 座標不同的點,過它們可畫**唯一**一條 $y=x^2+bx+c$ 型(U 形)拋物線;拋物線的內部區域定義為**嚴格**在它上方的部分(落在拋物線上不算內部)。

求/輸出:畫出的拋物線中,內部不含任何給定點的條數(一個整數)。

例:三點 $(-1,2),(0,0),(1,2)$ → 過左右兩點的 $y=x^2+1$ 內部無點(計入);過 $(0,0)$ 與另一點的 $y=x^2-x$、$y=x^2+x$ 都把第三點含在內部 → 答案 $1$。變換 $y'=y-x^2$ 後三點成 $(-1,1),(0,0),(1,1)$,上凸殼恰一條邊,對上。
:::

::: tip 作法
**變換 $y'=y-x^2$** 後拋物線變直線、「嚴格在上方」變半平面 → 答案 = 變換後點集**上凸殼**的非豎直邊數;同 $x$ 只留 $y$ 最大的點。

```cpp
// sketch:y' = y - x^2 後取上凸殼,數非豎直邊
sort(q, q + m);                       // 按 (x, y') 升冪;同 x 只留 y' 最大者
vector<P> h;                          // 上凸殼(從左到右)
for (auto& pt : q) {
    while (h.size() >= 2 && cross(h[h.size()-2], h.back(), pt) >= 0)
        h.pop_back();                 // 非嚴格右轉就 pop(共線同拋物線,併邊)
    h.push_back(pt);
}
long long ans = h.size() - 1;         // 殼上每條邊 = 一條合法拋物線
```
:::

### [CF1017E. The Supersonic Rocket](https://codeforces.com/problemset/problem/1017/E)
`幾何` `~2400`

::: info 題意
給定兩個引擎,分別由 $n$ 與 $m$ 個「能源點」組成($3\le n,m\le 10^5$,整數座標 $0\le x,y\le 10^8$,同一引擎內點相異)。

每個引擎可**獨立**做任意次整體平移、整體旋轉;之後合併兩引擎的點,反覆對任兩點取凸組合,生成的無窮點集稱為 power field(即所有點的凸包)。

若能操作使得**刪去任一能源點**後 power field 都不變,火箭即為 safe。求/輸出:safe 輸出 YES,否則 NO。

例:引擎一 $(0,0),(1,0),(0,1)$、引擎二 $(5,5),(6,5),(5,6)$ → 兩凸包同為腰 $1$ 的等腰直角三角形,平移即重合 ⇒ YES;引擎二若為 $(0,0),(2,0),(0,2)$,邊長平方序列 $(1,2,1)$ 對 $(4,8,4)$ 對不上 ⇒ NO。
:::

::: tip 作法
條件 ⟺ 兩凸包**旋轉+平移全等**:把凸包編碼成 $(|e_i|^2,\ \text{cross}(e_i,e_{i+1}),\ \text{dot}(e_i,e_{i+1}))$ 序列,判**循環同構**:一串倍長、另一串當 pattern 跑 KMP。

```cpp
// sketch:凸包 → 旋轉平移不變量序列,循環同構 = KMP
using T = array<long long, 3>;
vector<T> enc(vector<P>& h) {          // h:凸包頂點序
    int k = h.size(); vector<T> s(k);
    for (int i = 0; i < k; i++) {
        P e = h[(i+1)%k] - h[i], f = h[(i+2)%k] - h[(i+1)%k];
        s[i] = {norm2(e), cross(e, f), dot(e, f)};
    }
    return s;
}
// sa 倍長當 text、sb 當 pattern 跑 KMP;
// |sa| == |sb| 且找到匹配 ⇒ YES
```
:::

### [CF1284E. New Year and Castle Construction](https://codeforces.com/problemset/problem/1284/E)
`幾何` `~2500`

::: info 題意
給定平面上 $n$ 個相異整數點的集合 $s$($5\le n\le 2500$,$|$座標$|\le 10^9$,保證無三點共線)。

對 $p\in s$,定義 $f(p)$ = 由其他 4 點構成、能**嚴格**包住 $p$($p$ 嚴格在內部)的簡單四邊形的 4 點子集數;同一子集即使有多種連法也只算一次。

求/輸出:$\sum_{p\in s} f(p)$(一個整數)。

例:$n=5$:$(0,0)$ 與 $(3,1),(-1,3),(-3,-2),(2,-3)$(繞原點四方向各一點,相鄰極角差皆 $<\pi$)→ 外圍四點的凸四邊形嚴格包住 $(0,0)$ ⇒ $f((0,0))=1$;四個外圍點各自落在其餘四點的凸包外 ⇒ $f=0$。總和 $=1$。
:::

::: tip 作法
對每個 $p$ 用**補集**:$\binom{n-1}{4}$ 減去「4 點全落在過 $p$ 某開半平面內」的子集數——繞 $p$ **極角排序** + two pointers,對每點數出夾角 $<\pi$ 內的 $k$ 個點,累加 $\binom{k}{3}$。$O(n^2\log n)$。

```cpp
// sketch:固定 p,補集 + 極角 two pointers
long long bad = 0;                       // 全落在某開半平面的 4 點組
sort(v, v + m, cmp);                     // m = n-1,整數極角序(象限+cross)
for (int a = 0, b = 1; a < m; a++) {
    if (b <= a) b = a + 1;
    while (b < a + m && cross(v[a], v[b % m]) > 0) b++;
    long long k = b - a - 1;             // 嚴格在 v[a] 逆時針半圈內的點數
    bad += k * (k - 1) * (k - 2) / 6;    // C(k,3):v[a] 當「角度最前」
}
ans += C(m, 4) - bad;                    // f(p) = C(n-1,4) - bad
```
:::
