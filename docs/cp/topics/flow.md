---
title: 弱項專題:網路流(Dinic/最小割建模/費用流)
tags: [flow]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:網路流(Dinic/最小割建模/費用流)

> 主題式整理:核心模板與觸發辨識,配 CF 2100–2500 經典題逐題「題意 + 作法」。

## 核心模板 / 觸發

- **觸發辨識**:「二擇一/分組有衝突」「選 A 必須付 B 的代價」→ **最小割**;「每個 X 恰好/至多 $k$ 個配對」→ **二分圖流**;「代價隨使用次數遞增(凸)」→ **拆平行邊費用流**;「答案單調可行」→ **二分 + maxflow 判定**。
- **Dinic 模板三件套**:BFS **分層** + DFS **多路增廣** + **當前弧** `it[u]`。複雜度 $O(V^2E)$,**單位容量圖 $O(E\sqrt{V})$**。易錯:每輪忘記重置 `level/it`;反向邊成對存(`e ^ 1` 取反邊)。
- **最小割建模(最大權閉合子圖)**:答案 $=\sum(\text{收益}) - \text{mincut}$。收益項連 $S$(割掉=放棄收益),成本項連 $T$(割掉=支付成本),**依賴關係連 $\infty$ 邊**(不可割)。
- **費用流(MCMF)**:SPFA 增廣或 Johnson 位勢 + Dijkstra。**凸費用拆邊**:$c^2=\sum_{k=1}^{c}(2k-1)$ → 拆成 cap 1、cost $1,3,5,\dots$ 的平行邊。求最大收益 → 邊費用取負跑最小費用。
- **容量縮放(capacity scaling)**:增廣次數跟容量大小掛鉤時的救法——門檻 $\Delta$ 從最高位元開始減半,每輪只沿殘量 $\ge\Delta$ 的邊增廣,每輪至多 $O(E)$ 次、總增廣 $O(E\log U)$ 次。**主戰場是費用流**:SSP 的增廣次數 $=$ 流值,容量 $10^9$ 直接炸,scaling SSP 把它壓到 $O(E\log U)$;純 maxflow 的 Dinic 本身與容量無關,通常不用。
- **費用縮放(cost scaling)**:MCMF 的另一條路(Goldberg–Tarjan,$\varepsilon$-optimality + push-relabel,$O(V^2E\log(VC))$);圖大、流量大時常比 SSP 快一個量級,大型 assignment 可考慮。
- **輸出方案**:邊上實際流量 $=$ 初始容量 $-$ 殘量;**最小割割集** $=$ 殘量網路上從 $S$ BFS 可達點集與其補集之間的原邊。
- **常見易錯**:總量不守恆先判 $\sum a_i \ne \sum b_i$ 直接無解;點容量要**拆點**($v_{in}\to v_{out}$);二分 + 流時容量對 target 取 $\min$ 防溢位。

## 題目

### [CF730I. Olympiad in Programming and Sports](https://codeforces.com/problemset/problem/730/I)
`flow` `~2000`

::: info 題意
給定 $n\le 3000$ 個學生,每人有兩個整數能力值:程式能力 $a_i$、體育能力 $b_i$。

要組出兩支隊伍:程式隊恰 $p$ 人、體育隊恰 $s$ 人($p+s\le n$),同一學生不能同時屬於兩隊;程式隊實力 $=$ 隊員 $\sum a_i$,體育隊實力 $=$ 隊員 $\sum b_i$。

輸出:兩隊實力和的最大值,以及一組達成最大值的兩隊隊員編號。

例:$n=2$, $p=s=1$, $a=[5,4]$, $b=[5,1]$ → 學生 1 進程式隊只得 $5+1=6$;改讓學生 2 進程式隊、學生 1 進體育隊得 $4+5=9$,才是最大值。
:::

::: tip 作法
MCMF:$S\to$ 人 cap 1,人 $\to$ 程式隊節點 cost $-a_i$、人 $\to$ 體育隊節點 cost $-b_i$,兩隊節點 $\to T$ cap 分別 $p,s$;最小費用取負即答案(也可反悔貪心對照)。

```cpp
// sketch:MCMF 建圖(節點:S, 人 1..n, P, Q, T)
for (int i = 1; i <= n; ++i) {
    add_edge(S, i, 1, 0);        // 每人至多屬一隊
    add_edge(i, P, 1, -a[i]);    // 進程式隊:收益 a_i → cost -a_i
    add_edge(i, Q, 1, -b[i]);    // 進體育隊:收益 b_i → cost -b_i
}
add_edge(P, T, p, 0);            // 程式隊恰 p 人
add_edge(Q, T, s, 0);            // 體育隊恰 s 人
// ans = -mincost(S, T);  方案 = 看 i→P / i→Q 哪條有流量
```
:::

### [CF546E. Soldier and Traveling](https://codeforces.com/problemset/problem/546/E)
`flow` `~2100`

::: info 題意
給定 $n\le 100$ 座城市、$m\le 200$ 條雙向道路,城 $i$ 現駐 $a_i$ 名士兵,並給定目標人數陣列 $b_i$。

每名士兵獨立行動:原地不動,或沿**至多一條邊**走到相鄰城市(不能走兩步以上)。

輸出:能否讓移動後城 $i$ 恰有 $b_i$ 人;可行印 YES 並輸出 $n\times n$ 矩陣(第 $(i,j)$ 格 $=$ 由城 $i$ 移往城 $j$ 的士兵數,對角線為留守數),不可行印 NO。

例:2 城 1 條邊,$a=[3,0]$, $b=[1,2]$ → 城 1 留 1 人、派 2 人過橋:矩陣第一列 $[1,2]$、第二列 $[0,0]$,YES;若拿掉那條邊,士兵動不了 → NO。
:::

::: tip 作法
先判 $\sum a_i=\sum b_i$;拆點二部圖:$S\to u_{left}$ cap $a_u$,$u_{left}\to v_{right}$($v\in\{u\}\cup adj(u)$)cap $\infty$,$v_{right}\to T$ cap $b_v$;滿流即可行,方案讀中間邊流量。
:::

### [CF498C. Array and Operations](https://codeforces.com/problemset/problem/498/C)
`flow` `~2100`

::: info 題意
給定 $n\le 100$ 個正整數 $a_i\le 10^9$,以及 $m\le 100$ 個「好對」$(i_k,j_k)$,保證 $i_k<j_k$ 且 $i_k+j_k$ 為**奇數**。

一次操作:任選一個好對與一個整數 $v>1$,要求 $v$ 同時整除 $a_{i_k}$ 與 $a_{j_k}$,然後把兩數同除以 $v$;同一好對可重複使用。

輸出:最多能連續執行的操作次數。

例:$a=[12,6]$、好對 $(1,2)$ → $12=2^2\cdot 3$、$6=2\cdot 3$:先 $v=2$ 得 $[6,3]$,再 $v=3$ 得 $[2,1]$,共 2 次;若一次用 $v=6$ 只算 1 次操作,反而虧。
:::

::: tip 作法
$i+j$ 為奇 → 下標奇偶天然二分圖。

**對每個質數 $p$ 獨立跑一次 maxflow**:容量 $=$ $a_i$ 中 $p$ 的冪次,答案 $=$ 各質數 maxflow 之和。

```cpp
// sketch:逐質數建圖跑流,容量 = 冪次
long long ans = 0;
for (int p : all_primes_appearing) {      // 出現在任一 a_i 的質因數
    Dinic G;
    for (int i = 1; i <= n; ++i) {
        int c = exp_of(a[i], p);          // a_i 中 p 的冪次
        if (i & 1) G.add(S, i, c);        // 奇下標當左部
        else       G.add(i, T, c);        // 偶下標當右部
    }
    for (auto [u, v] : good_pairs)        // u+v 為奇:必一奇一偶
        G.add(odd_of(u, v), even_of(u, v), INF);
    ans += G.maxflow(S, T);
}
```
:::

### [CF653D. Delivery Bears](https://codeforces.com/problemset/problem/653/D)
`flow` `~2200`

::: info 題意
給定有向圖 $n\le 50$ 點、$m\le 500$ 邊,每邊有載重容量 $\le 10^6$;有 $x\le 10^5$ 隻熊,每隻沿一條自選的 $1\to n$ 簡單路徑運貨,路徑可各自不同,但**每隻熊的載重必須完全相同**,且每條邊上所有經過該邊的熊之載重總和不得超過該邊容量。

輸出:可運送的最大總重($=x\times$ 單熊載重,實數,絕對/相對誤差 $10^{-6}$ 內)。

例:$n=2$,兩條 $1\to 2$ 平行邊容量 $3,5$,$x=2$ 隻熊 → 分走兩邊可取 $w=3$(容量換算 $\lfloor 3/3\rfloor+\lfloor 5/3\rfloor=2\ge x$),總重 $6$;兩熊擠同一條邊最多 $2w\le 5$,較差。
:::

::: tip 作法
**二分每隻熊載重 $w$**,邊容量換算成 $\min(\lfloor c_e/w\rfloor,\,x)$(對 $x$ 取 min 防溢位),Dinic 判 maxflow $\ge x$;答案 $=x\cdot w$。實數二分約 50–100 輪。

```cpp
// sketch:實數二分單熊載重 w
double lo = 0, hi = 1e6;
for (int it = 0; it < 100; ++it) {
    double w = (lo + hi) / 2;
    Dinic G;
    for (auto [u, v, c] : edges)
        G.add(u, v, min((long long)(c / w), (long long)x));  // 對 x 取 min 防溢位
    if (G.maxflow(1, n) >= x) lo = w;   // x 隻熊都能走到 n → w 可行
    else                      hi = w;
}
// ans = lo * x
```
:::

### [CF863F. Almost Permutation](https://codeforces.com/problemset/problem/863/F)
`flow` `~2200`

::: info 題意
有一個長 $n\le 50$、每個元素都在 $[1,n]$ 的整數陣列,給定 $q\le 100$ 條事實,每條形如「區間 $[l,r]$ 內所有 $a_x\ge v$」或「區間 $[l,r]$ 內所有 $a_x\le v$」。

定義陣列代價 $=\sum_{i=1}^{n} cnt(i)^2$,其中 $cnt(i)$ 為值 $i$ 的出現次數(越接近排列代價越小)。

輸出:滿足全部事實的陣列之最小代價;若無陣列能同時滿足,輸出 $-1$。

例:$n=2$ 無事實 → 取 $[1,2]$,代價 $1^2+1^2=2$;加一條「$[1,2]$ 內全 $\ge 2$」→ 只能取 $[2,2]$,代價 $0^2+2^2=4$。
:::

::: tip 作法
限制收緊每格值域 $[lo_i,hi_i]$(空則 $-1$);MCMF:$S\to$ 值 $v$ 用 $n$ 條 cost $1,3,5,\dots$ 平行邊(**凸費用拆邊**),值 $\to$ 格子(若 $v$ 在值域)cap 1,格子 $\to T$ cap 1,滿流費用即答案。

```cpp
// sketch:凸費用拆邊 —— 值 v 的第 k 次使用付 2k-1(前綴和 = cnt^2)
for (int v = 1; v <= n; ++v) {
    for (int k = 1; k <= n; ++k)
        G.add(S, val(v), 1, 2 * k - 1);   // cap 1, cost 1,3,5,...
    for (int i = 1; i <= n; ++i)
        if (lo[i] <= v && v <= hi[i])
            G.add(val(v), cell(i), 1, 0); // v 允許放進格子 i
}
for (int i = 1; i <= n; ++i) G.add(cell(i), T, 1, 0);
// 先驗每格 lo[i] <= hi[i] 否則 -1;滿流 (= n) 時 mincost 即答案
```
:::

### [CF510E. Fox And Dinner](https://codeforces.com/problemset/problem/510/E)
`flow` `~2300`

::: info 題意
給定 $n\le 200$ 隻狐狸的年齡 $a_i$($2\le a_i\le 10^4$),要把牠們分配到若干張圓桌:每隻狐狸恰坐一桌,每桌**至少 3 隻**,且每桌沿圓周相鄰的兩隻(含首尾相接)年齡和都是質數。

<svg viewBox="0 0 400 235" width="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="圓桌示意:偶數與奇數年齡交錯入座,相鄰年齡和皆為質數">
  <circle cx="200" cy="110" r="72" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
  <circle cx="200" cy="110" r="44" fill="var(--vp-c-default-soft)"/>
  <circle cx="200" cy="38" r="9" fill="var(--vp-c-brand-1)"/>
  <circle cx="272" cy="110" r="9" fill="currentColor" opacity="0.3"/>
  <circle cx="200" cy="182" r="9" fill="var(--vp-c-brand-1)"/>
  <circle cx="128" cy="110" r="9" fill="currentColor" opacity="0.3"/>
  <text x="200" y="24" text-anchor="middle" font-size="12" fill="currentColor">2</text>
  <text x="294" y="114" text-anchor="middle" font-size="12" fill="currentColor">3</text>
  <text x="200" y="205" text-anchor="middle" font-size="12" fill="currentColor">2</text>
  <text x="106" y="114" text-anchor="middle" font-size="12" fill="currentColor">5</text>
  <text x="267" y="47" text-anchor="middle" font-size="12" fill="currentColor">2+3=5</text>
  <text x="267" y="179" text-anchor="middle" font-size="12" fill="currentColor">3+2=5</text>
  <text x="133" y="179" text-anchor="middle" font-size="12" fill="currentColor">2+5=7</text>
  <text x="133" y="47" text-anchor="middle" font-size="12" fill="currentColor">5+2=7</text>
  <text x="200" y="228" text-anchor="middle" font-size="12" fill="currentColor">偶(實)奇(淡)交錯圍桌:相鄰和 5、5、7、7 皆質數</text>
</svg>

輸出:可行則印桌數,以及每桌的狐狸數與依順時針順序排列的狐狸編號;不可行印 Impossible。

例:$n=4$,年齡 $[2,3,2,5]$ → 依 $2,3,2,5$ 順時針圍成一桌(如圖):相鄰和 $5,5,7,7$ 全為質數,且 $4\ge 3$ 隻 → 輸出 1 桌。
:::

::: tip 作法
$a_i\ge 2$ 故質數和必為奇 → **一奇一偶交錯**,奇偶各半否則無解。

$S\to$ 偶 cap 2、偶 $\to$ 奇(和為質數)cap 1、奇 $\to T$ cap 2;滿流後每點度數 2,**二分圖保證環長為偶且 $\ge 4$**,每個環即一桌。
:::

### [CF1082G. Petya and Graph](https://codeforces.com/problemset/problem/1082/G)
`flow` `~2400`

::: info 題意
給定簡單無向圖($n,m\le 10^3$,無自環無重邊),點 $i$ 有點權 $a_i$、邊 $i$ 有邊權 $w_i$(均 $\le 10^9$)。

要選一個子圖(任選點集與邊集),限制:所選每條邊的兩端點都必須在所選點集內;子圖權重 $=\sum$ 所選邊權 $-\sum$ 所選點權。

輸出:子圖權重的最大值(可什麼都不選,故答案 $\ge 0$)。

例:2 點 $a=[3,1]$、1 條邊 $w=5$ → 全選得 $5-3-1=1$(mincut $=4$:割兩條點邊);改 $w=2$ 時全選只得 $-2$,不如全不選,答案 $0$(mincut $=2$:直接割 $S\to$ 邊)。
:::

::: tip 作法
**最大權閉合子圖**裸題:$S\to$ 邊節點 cap $w_e$,邊節點 $\to$ 兩端點 cap $\infty$,點 $\to T$ cap $a_v$;答案 $=\sum w_e - \text{mincut}$。
:::

### [CF277E. Binary Tree on Plane](https://codeforces.com/problemset/problem/277/E)
`flow` `~2400`

::: info 題意
給定平面上 $n\le 400$ 個相異點的整數座標。

要在點之間連有向弧,使其構成一棵有根 binary tree:每條弧 $u\to v$ 必須嚴格由高往低($y_u>y_v$),且每個點至多 2 條出弧(至多 2 個小孩)、恰有一條路徑從根到達每個其他點。

輸出:所有弧的總歐氏長度之最小值(誤差 $10^{-6}$ 內);若無法建出這樣的樹,輸出 $-1$。

例:三點 $(0,2),(-1,0),(1,0)$ → 兩個底點同高不能互連,只能都掛在頂點下,總長 $2\sqrt 5\approx 4.472$;若輸入只有兩個同高的點,一條弧都連不了,輸出 $-1$。
:::

::: tip 作法
MCMF:$S\to u$ cap 2 cost 0(至多 2 個小孩)、$u\to v$ cap 1 cost $=$ 歐氏距離(僅當 $y_u>y_v$)、$v\to T$ cap 1(至多 1 個爸)。

最小費用最大流,流量 $=n-1$ 時費用即答案,否則 $-1$。
:::
