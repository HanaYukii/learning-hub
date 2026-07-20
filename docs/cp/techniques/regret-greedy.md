---
title: 反悔貪心(pq + 雙向鏈結串列)
tags: [反悔貪心, 貪心]
why: 「選 k 個互不相鄰、和最優」的經典模板;ABC464 G 歸約到此型(JOI Candies)
trigger: 選 k 個元素最大/最小化總和,且相鄰互斥(選了 i 就不能選 i±1);或可轉成此形的配對/區間問題
problems:
  - { name: ABC464 G, url: https://atcoder.jp/contests/abc464/tasks/abc464_g, rating: 2500 }
  - { name: JOI 2018 Final - Candies, url: https://atcoder.jp/contests/joi2018ho/tasks/joi2018ho_c, rating: 2200 }
  - { name: CF 958 E2 Guard Duty (medium), url: https://codeforces.com/problemset/problem/958/E2, rating: 2200 }
reviewed: 2026-07-03
review_interval: 21
---

# 反悔貪心(pq + 雙向鏈結串列)

- **觸發**:「選恰好/至多 k 個、相鄰互斥、總和最優」,或可排序/差分後轉成此形的配對問題。
- **核心**:每次取當前最優 v(位置 i),把 i−1, i, i+1 合併成值 `left+right−v` 的反悔元素放回堆——之後取它等價於撤銷 v 改選兩側;整體即模擬費用流,f(k) 為凹。
- **複雜度**:O(n log n)(堆進出總量 O(n+k))。

## 模板

```cpp
// 貼上即用(C++17,已對暴力 stress test)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const ll NEG = -(ll)1e18;  // 哨兵值「此處不可反悔」;需遠小於一切真實值

// 序列 a[0..n-1] 選「恰好 k 個」互不相鄰元素,總和最大(需 k <= (n+1)/2)
// 「至多 k 個」:f(k) 為凹,取出後 v < 0 即 break;最小化:整體取反再套
ll regretGreedy(const vector<ll>& a, int k) {
    int n = (int)a.size(), m = n + 2;           // 節點 1..n 為實元素,0 / n+1 為哨兵
    vector<ll> val(m);
    vector<int> prv(m), nxt(m);
    vector<char> del(m, 0);
    val[0] = val[m - 1] = NEG;
    for (int i = 1; i <= n; i++) val[i] = a[i - 1];
    for (int i = 0; i < m; i++) prv[i] = i - 1, nxt[i] = i + 1;
    nxt[m - 1] = -1;                            // prv[0] 已是 -1

    priority_queue<pair<ll, int>> pq;           // {當前值, 節點編號}
    for (int i = 1; i <= n; i++) pq.push({val[i], i});

    ll ans = 0;
    while (k--) {
        // 懶刪除:pop 時檢查已刪標記,並用「值是否過期」當版本號
        while (!pq.empty() && (del[pq.top().second] || pq.top().first != val[pq.top().second]))
            pq.pop();
        if (pq.empty() || pq.top().first < NEG / 2) break;   // k 超過最大可選數 ⌈n/2⌉
        auto [v, i] = pq.top(); pq.pop();
        ans += v;                                // 至多 k 個:先 if (v < 0) break; 再累加
        int L = prv[i], R = nxt[i];              // 哨兵保證 L、R 必存在
        val[i] = max(val[L] + val[R] - v, NEG);  // 反悔元素:之後取它 = 撤銷 v 改選兩側
        del[L] = del[R] = 1;
        prv[i] = prv[L]; if (prv[i] != -1) nxt[prv[i]] = i;
        nxt[i] = nxt[R]; if (nxt[i] != -1) prv[nxt[i]] = i;
        pq.push({val[i], i});
    }
    return ans;
}
```

## 要點 / 易錯
- **邊界用哨兵,別手寫分支**:兩端補 `-INF` 哨兵後,取到端點時合併值自然變成不可再選(端點沒有「兩側」可反悔);手寫 `L==-1/R==-1` 分支極易漏。環形則無邊界,直接把鏈結串列接成環。
- **懶刪除在取堆頂時檢查,兩條件缺一不可**:`del` 抓「被當作鄰居合併掉」的節點——其 `val` 從未改動,光比值抓不到;「堆內值 ≠ 當前 `val`」抓被原地更新的反悔節點的舊項。
- **k 的上限**:恰好 k 需 `k ≤ ⌈n/2⌉`,超過時堆頂只剩哨兵值,務必 break(模板中 `< NEG/2` 判斷);哨兵合併後用 `max(·, NEG)` 夾住防下溢。
- **恰好 vs 至多**:恰好 k 時負值也照取(模板預設);至多 k 時因 f(k) 凹、增量遞減,堆頂 < 0 即可提前停。

## 例題
- **ABC464 G**:SR 字串歸約後恰為「選 k 個互不相鄰、和最大」型,直接套模板。
- **JOI 2018 Final - Candies**:裸題,對每個 k=1..⌈n/2⌉ 輸出恰好 k 個的最大和(f(k) 凹,主迴圈逐步累加即得全部答案)。
- **CF 958 E2 Guard Duty (medium)**:排序後配對必取相鄰差,轉成「相鄰差序列選 k 個互不相鄰、和最小」——取反套模板。
