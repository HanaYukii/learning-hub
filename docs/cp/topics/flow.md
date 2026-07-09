---
title: 弱項專題:網路流(Dinic/最小割建模/費用流)
tags: [flow]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:網路流(Dinic/最小割建模/費用流)

> 弱項專題懶人包(不等比賽,主動補):每題「題意 + 核心作法」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **觸發辨識**:「二擇一/分組有衝突」「選 A 必須付 B 的代價」→ **最小割**;「每個 X 恰好/至多 $k$ 個配對」→ **二分圖流**;「代價隨使用次數遞增(凸)」→ **拆平行邊費用流**;「答案單調可行」→ **二分 + maxflow 判定**。
- **Dinic 模板三件套**:BFS **分層** + DFS **多路增廣** + **當前弧** `it[u]`。複雜度 $O(V^2E)$,**單位容量圖 $O(E\sqrt{V})$**。易錯:每輪忘記重置 `level/it`;反向邊成對存(`e ^ 1` 取反邊)。
- **最小割建模(最大權閉合子圖)**:答案 $=\sum(\text{收益}) - \text{mincut}$。收益項連 $S$(割掉=放棄收益),成本項連 $T$(割掉=支付成本),**依賴關係連 $\infty$ 邊**(不可割)。
- **費用流(MCMF)**:SPFA 增廣或 Johnson 位勢 + Dijkstra。**凸費用拆邊**:$c^2=\sum_{k=1}^{c}(2k-1)$ → 拆成 cap 1、cost $1,3,5,\dots$ 的平行邊。求最大收益 → 邊費用取負跑最小費用。
- **輸出方案**:邊上實際流量 $=$ 初始容量 $-$ 殘量;**最小割割集** $=$ 殘量網路上從 $S$ BFS 可達點集與其補集之間的原邊。
- **常見易錯**:總量不守恆先判 $\sum a_i \ne \sum b_i$ 直接無解;點容量要**拆點**($v_{in}\to v_{out}$);二分 + 流時容量對 target 取 $\min$ 防溢位。

## 題目

- **[CF730I. Olympiad in Programming and Sports](https://codeforces.com/problemset/problem/730/I)** `flow` `~2000`
  題意:$n\le 3000$ 個學生各有程式能力 $a_i$、體育能力 $b_i$,選互斥的程式隊恰 $p$ 人、體育隊恰 $s$ 人($p+s\le n$),最大化程式隊 $\sum a$ + 體育隊 $\sum b$。
  作法:MCMF:$S\to$ 人 cap 1,人 $\to$ 程式隊節點 cost $-a_i$、人 $\to$ 體育隊節點 cost $-b_i$,兩隊節點 $\to T$ cap 分別 $p,s$;最小費用取負即答案(也可反悔貪心對照)。

- **[CF546E. Soldier and Traveling](https://codeforces.com/problemset/problem/546/E)** `flow` `~2100`
  題意:$n\le 100$ 城、$m\le 200$ 條雙向路,城 $i$ 有 $a_i$ 名士兵,每人原地不動或沿**至多一條邊**移動;問能否使城 $i$ 恰剩 $b_i$ 人,並輸出城際移動人數矩陣。
  作法:先判 $\sum a_i=\sum b_i$;拆點二部圖:$S\to u_{left}$ cap $a_u$,$u_{left}\to v_{right}$($v\in\{u\}\cup adj(u)$)cap $\infty$,$v_{right}\to T$ cap $b_v$;滿流即可行,方案讀中間邊流量。

- **[CF498C. Array and Operations](https://codeforces.com/problemset/problem/498/C)** `flow` `~2100`
  題意:$n\le 100$ 個數($\le 10^9$)與 $m\le 100$ 個好對($i+j$ 為奇);每次操作選一好對與公因數 $v>1$,兩數同除以 $v$;求最多能操作幾次(同一對可重複用)。
  作法:$i+j$ 為奇 → 下標奇偶天然二分圖。**對每個質數 $p$ 獨立跑一次 maxflow**:容量 $=$ $a_i$ 中 $p$ 的冪次,答案 $=$ 各質數 maxflow 之和。

- **[CF653D. Delivery Bears](https://codeforces.com/problemset/problem/653/D)** `flow` `~2200`
  題意:有向圖 $n\le 50$、$m\le 500$,$x\le 10^5$ 隻熊各沿一條 $1\to n$ 路徑,每隻載重**必須相同**,每邊總載重 $\le$ 容量($\le 10^6$);最大化總載重(實數,誤差 $10^{-6}$)。
  作法:**二分每隻熊載重 $w$**,邊容量換算成 $\min(\lfloor c_e/w\rfloor,\,x)$(對 $x$ 取 min 防溢位),Dinic 判 maxflow $\ge x$;答案 $=x\cdot w$。實數二分約 50–100 輪。

- **[CF863F. Almost Permutation](https://codeforces.com/problemset/problem/863/F)** `flow` `~2200`
  題意:長 $n\le 50$、值域 $[1,n]$ 的陣列,$q\le 100$ 條「區間內每個 $a_x\ge v$ / $\le v$」限制;求 $\min\sum_i cnt(i)^2$($cnt(i)$ 為值 $i$ 出現次數),矛盾輸出 $-1$。
  作法:限制收緊每格值域 $[lo_i,hi_i]$(空則 $-1$);MCMF:$S\to$ 值 $v$ 用 $n$ 條 cost $1,3,5,\dots$ 平行邊(**凸費用拆邊**),值 $\to$ 格子(若 $v$ 在值域)cap 1,格子 $\to T$ cap 1,滿流費用即答案。

- **[CF510E. Fox And Dinner](https://codeforces.com/problemset/problem/510/E)** `flow` `~2300`
  題意:$n\le 200$ 隻狐狸、年齡 $a_i\ge 2$,分坐若干圓桌,每桌 $\ge 3$ 隻且**相鄰兩隻年齡和為質數**;構造方案或輸出 Impossible。
  作法:$a_i\ge 2$ 故質數和必為奇 → **一奇一偶交錯**,奇偶各半否則無解。$S\to$ 偶 cap 2、偶 $\to$ 奇(和為質數)cap 1、奇 $\to T$ cap 2;滿流後每點度數 2,**二分圖保證環長為偶且 $\ge 4$**,每個環即一桌。

- **[CF1082G. Petya and Graph](https://codeforces.com/problemset/problem/1082/G)** `flow` `~2400`
  題意:簡單圖 $n,m\le 10^3$,點權 $a_i$、邊權 $w_i$(均 $\le 10^9$);選子圖(選邊必含其兩端點),最大化 $\sum$ 邊權 $-\sum$ 點權。
  作法:**最大權閉合子圖**裸題:$S\to$ 邊節點 cap $w_e$,邊節點 $\to$ 兩端點 cap $\infty$,點 $\to T$ cap $a_v$;答案 $=\sum w_e - \text{mincut}$。

- **[CF277E. Binary Tree on Plane](https://codeforces.com/problemset/problem/277/E)** `flow` `~2400`
  題意:平面上 $n\le 400$ 個相異點,連成有根二元樹:每條弧須由高往低($y_u>y_v$)、每點至多 2 個小孩;最小化弧的總歐氏長度,建不出輸出 $-1$。
  作法:MCMF:$S\to u$ cap 2 cost 0(至多 2 個小孩)、$u\to v$ cap 1 cost $=$ 歐氏距離(僅當 $y_u>y_v$)、$v\to T$ cap 1(至多 1 個爸)。最小費用最大流,流量 $=n-1$ 時費用即答案,否則 $-1$。
