---
title: 弱項專題:網路流(Dinic/最小割建模/費用流)
tags: [flow]
verified: false
reviewed: 2026-07-02
review_interval: 14
---

# 弱項專題:網路流(Dinic/最小割建模/費用流)

> 弱項專題懶人包(不等比賽,主動補):每題「技巧 + 作法 1–2 行」。題目選自 CF problemset(rating 2100–2500 為主)。`verified: false`=作法尚未人工複核。

## 核心模板 / 觸發

- **觸發辨識**:「二擇一/分組有衝突」「選 A 必須付 B 的代價」→ **最小割**;「每個 X 恰好/至多 $k$ 個配對」→ **二分圖流**;「代價隨使用次數遞增(凸)」→ **拆平行邊費用流**;「答案單調可行」→ **二分 + maxflow 判定**。
- **Dinic 模板三件套**:BFS **分層**(只走 $level_v = level_u+1$)+ DFS **多路增廣** + **當前弧** `it[u]`(回溯時不重掃已飽和邊)。複雜度 $O(V^2E)$,**單位容量圖 $O(E\sqrt{V})$**。易錯:每輪忘記重置 `level/it`;反向邊要成對存(`e ^ 1` 取反邊)。
- **最小割建模(最大權閉合子圖)**:答案 $=\sum(\text{收益}) - \text{mincut}$。收益項連 $S$(割掉=放棄收益),成本項連 $T$(割掉=支付成本),**依賴關係連 $\infty$ 邊**(不可割)。
- **費用流(MCMF)**:SPFA 增廣或 Johnson 位勢 + Dijkstra。**凸費用拆邊**:第 $k$ 次使用花費 $2k-1$(因 $c^2=\sum_{k=1}^{c}(2k-1)$),拆成 cap 1、cost $1,3,5,\dots$ 的平行邊。求最大收益 → 邊費用取負跑最小費用。
- **輸出方案**:邊上實際流量 $=$ 初始容量 $-$ 殘量;**最小割割集** $=$ 殘量網路上從 $S$ BFS 可達點集與其補集之間的原邊。
- **常見易錯**:總量不守恆先判 $\sum a_i \ne \sum b_i$ 直接無解;點容量要**拆點**($v_{in}\to v_{out}$);二分 + 流時容量記得對 target 取 $\min$ 防溢位。

## 題目

- **[Olympiad in Programming and Sports (CF730I)](https://codeforces.com/problemset/problem/730/I)** `flow` `~2000`
  作法:每人拆「入隊」一單位流:$S\to$ 人(cap 1)、人 $\to$ 程式隊節點(cost $-a_i$)、人 $\to$ 體育隊節點(cost $-b_i$),兩隊節點 $\to T$ cap 分別為 $p,s$;跑 MCMF 取負即最大總和(也可反悔貪心對照)。

- **[Soldier and Traveling (CF546E)](https://codeforces.com/problemset/problem/546/E)** `flow` `~2100`
  作法:可行流判定。先判 $\sum a_i=\sum b_i$;拆點成二部圖:$S\to u_{left}$ cap $a_u$,$u_{left}\to v_{right}$($v\in\{u\}\cup adj(u)$)cap $\infty$,$v_{right}\to T$ cap $b_v$;maxflow $=\sum a_i$ 則可行,方案讀中間邊流量。

- **[Array and Operations (CF498C)](https://codeforces.com/problemset/problem/498/C)** `flow` `~2100`
  作法:pair 條件 $i+j$ 為奇 → 按下標奇偶天然二分圖。**對每個質數 $p$ 獨立跑一次 maxflow**:點容量 = $a_i$ 中 $p$ 的次數(拆點或直接 $S/T$ 邊),答案 = 各質數 maxflow 之和。

- **[Delivery Bears (CF653D)](https://codeforces.com/problemset/problem/653/D)** `flow` `~2200`
  作法:**二分每隻熊載重 $w$**,邊容量換算成 $\min(\lfloor c_e/w\rfloor,\,x)$(對 $x$ 取 min 防溢位),Dinic 判 maxflow $\ge x$;答案 $=x\cdot w$。實數二分約 50–100 輪。

- **[Almost Permutation (CF863F)](https://codeforces.com/problemset/problem/863/F)** `flow` `~2200`
  作法:約束收緊每格值域 $[lo_i,hi_i]$(矛盾則 $-1$);MCMF:$S\to$ 值 $v$ 用 $n$ 條平行邊 cost $1,3,5,\dots$(**凸費用拆邊**,$cnt^2=\sum$ 奇數),值 $\to$ 格子(若 $v$ 在值域)cap 1,格子 $\to T$ cap 1,滿流費用即答案。

- **[Fox And Dinner (CF510E)](https://codeforces.com/problemset/problem/510/E)** `flow` `~2300`
  作法:$a_i\ge 2$ 故相鄰和為質數必為奇 → **一奇一偶交錯**,奇偶各半否則無解。$S\to$ 偶 cap 2、偶 $\to$ 奇(和為質數)cap 1、奇 $\to T$ cap 2;滿流後每點度數 2,**二分圖保證環長為偶且 $\ge 4$**,每個環即一桌。

- **[Petya and Graph (CF1082G)](https://codeforces.com/problemset/problem/1082/G)** `flow` `~2400`
  作法:**最大權閉合子圖**裸題:選邊得 $w_e$ 但須付兩端點 $a_v$。$S\to$ 邊節點 cap $w_e$,邊節點 $\to$ 兩端點 cap $\infty$,點 $\to T$ cap $a_v$;答案 $=\sum w_e - \text{mincut}$。

- **[Binary Tree on Plane (CF277E)](https://codeforces.com/problemset/problem/277/E)** `flow` `~2400`
  作法:MCMF 建樹:$S\to u$ cap 2 cost 0(至多 2 個小孩)、$u\to v$ cap 1 cost $=$ 歐氏距離(僅當 $y_u>y_v$)、$v\to T$ cap 1(至多 1 個爸)。最小費用最大流,流量 $=n-1$ 時費用即答案,否則 $-1$。
