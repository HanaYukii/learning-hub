---
title: 有界資源維狀態擴充(多準則最短路 / Pareto)
tags: [最短路, 狀態擴充, 分層圖, dp]
why: 「主準則較差但資源較多」的狀態可能是必經之路——不能把每點折疊成單一 min 標籤
trigger: 最短路/DP 有第二個「有界」資源維(電量/油量/預算/容量),且慢但省資源的中間狀態可能才可行或最優
problems:
  - { name: "資源受限最短路 (RCSP) 型;近期某場 Q4 即此型", url: "", rating: 2500 }
reviewed: 2026-07-01
review_interval: 21
mastery: learning
---

# 有界資源維狀態擴充(多準則最短路 / Pareto)

- **觸發**:最短路/DP 有兩個準則,其中一個是**有界的消耗性資源** $B$(電量、油量、預算…),走邊要扣資源;或目標是字典序(先 min 時間、平手再 max 剩餘資源)。
- **核心**:把資源塞進狀態 —— `dp[node][res] = 最佳主成本`。**不能只留 `dp[node]=min時間`**:慢但省資源的狀態可能才付得起後面的貴邊,折疊成單一標籤會 WA。
- **複雜度**:$O((n+|E|)\cdot B)$,$B$ 要夠小(~$10^3$)。

## 兩種跑法

- **資源每步嚴格遞減**(每條邊消耗 $\ge 1$)→ `(node,res)` 是 **DAG(按 res 分層)**,直接照 res 由大到小 DP,**免 Dijkstra**。
- 資源非單調(有補給邊)→ 在 `(node,res)` 狀態圖上跑 **Dijkstra**(邊權非負)。

## 模板(DAG:資源嚴格遞減版)

```cpp
const long long INF = 4e18;
vector best(n, vector<long long>(B + 1, INF));   // best[u][p] = 到 u、剩資源 p 的最短時間
best[src][power] = 0;
for (int p = B; p >= 0; --p)                     // 嚴格遞減 → 高層先定,同層無邊
    for (int u = 0; u < n; ++u) if (best[u][p] < INF && p >= cost[u])
        for (auto [v, t] : g[u])
            best[v][p - cost[u]] = min(best[v][p - cost[u]], best[u][p] + t);
// 答案:字典序 (min time, 平手 max p)
long long T = INF; int keep = -1;
for (int p = 0; p <= B; ++p)
    if (best[tgt][p] < T || (best[tgt][p] == T && p > keep)) T = best[tgt][p], keep = p;
```

## 要點 / 易錯
- **別折疊成單標籤**——這是全題核心;`dp[node]=min時間` 會漏掉「慢但省資源」的必經狀態。
- 字典序目標:carry `(主成本, −次要)` 一起比,或先定主準則再回掃取最佳次要。
- DAG 版處理順序要對:轉移只往「更低資源」寫,故資源**由大到小**掃。
- $B$ 太大不能枚舉時 → 每點維護 `(主成本, 資源)` 的 **Pareto 前緣**(丟掉被支配的點),而非全枚舉。

## 例題 / 來源
- 標準家族:**資源受限最短路 (RCSP)**、**分層圖最短路**(把「還能用幾次某資源」當層)。
- 型:有向圖求「到終點最短時間;走邊消耗有界資源、資源不足不能走;平手取最大剩餘資源」。
