---
title: 線段樹分治 + 可回滾 DSU(離線動態連通性)
tags: [線段樹分治, 可回滾DSU, 離線]
why: 「邊只在一段時間存活」的連通性/合併查詢通法;CF1105 E 即此型
trigger: 元素(邊/物件)只在已知時間或參數區間內有效,查詢可離線,需要連通性或可合併統計
problems:
  - { name: "CF Round 1105 Div1 E — The end of this world, (2239E)", url: "https://codeforces.com/contest/2239/problem/E", rating: 3300 }
  - { name: "CF813F Bipartite Checking", url: "https://codeforces.com/problemset/problem/813/F", rating: 2500 }
  - { name: "洛谷 P5787 二分圖 /【模板】線段樹分治", url: "https://www.luogu.com.cn/problem/P5787", rating: 2400 }
reviewed: 2026-07-03
review_interval: 21
---

# 線段樹分治 + 可回滾 DSU(離線動態連通性)

- **觸發**:邊(或任意可合併物件)只在已知的時間/參數區間內存活,查詢可離線——問連通性或連通塊統計(size/max/奇偶)。
- **核心**:把每條邊掛到「時間軸線段樹」上覆蓋其存活區間的 O(log T) 個節點;DFS 整棵樹,進節點時 union 該節點掛的邊、離開時按棧回滾到進入前的快照,葉子處回答該時刻的查詢。
- **複雜度**:O((m+q) log T · log n)——每條邊拆成 O(log T) 份、每份一次 union;無路徑壓縮所以 find 是 O(log n) 而非 α。

## 模板

```cpp
// 貼上即用(g++ -std=c++17 -O2 編譯通過,已與暴力隨機對拍)
#include <bits/stdc++.h>
using namespace std;

// ---------- 可回滾 DSU:按 size 合併,絕不路徑壓縮 ----------
struct RollbackDSU {
    vector<int> par, sz;
    vector<int> stk;                    // 操作棧:記錄被合併掉的根
    int comps;                          // 連通塊數
    RollbackDSU(int n = 0) { init(n); }
    void init(int n) {
        par.resize(n); iota(par.begin(), par.end(), 0);
        sz.assign(n, 1); stk.clear(); comps = n;
    }
    int find(int x) const {             // O(log n)。不做路徑壓縮!
        while (par[x] != x) x = par[x];
        return x;
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);  // 小掛大
        par[b] = a; sz[a] += sz[b]; comps--;
        stk.push_back(b);               // 只需記 b,par/sz 皆可逆推
        return true;
    }
    int snapshot() const { return (int)stk.size(); }
    void rollback(int snap) {           // 嚴格 LIFO,回滾到快照
        while ((int)stk.size() > snap) {
            int b = stk.back(); stk.pop_back();
            sz[par[b]] -= sz[b]; par[b] = b; comps++;
        }
    }
};

// ---------- 線段樹分治:時間軸 [0, T-1],閉區間掛邊 ----------
struct SegDivide {
    int T;
    vector<vector<pair<int,int>>> bucket;   // 每個線段樹節點掛的邊
    RollbackDSU dsu;
    function<void(int)> answer;             // 葉子 t:回答時刻 t 的查詢

    SegDivide(int T_, int n) : T(max(T_, 1)), bucket(4 * max(T_, 1)), dsu(n) {}

    void insert(int l, int r, pair<int,int> e) {  // 邊 e 存活於時刻 [l, r](閉)
        if (l > r) return;
        insert(1, 0, T - 1, l, r, e);
    }
    void run() { dfs(1, 0, T - 1); }

private:
    void insert(int o, int l, int r, int ql, int qr, pair<int,int> e) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) { bucket[o].push_back(e); return; }
        int m = (l + r) >> 1;
        insert(o << 1, l, m, ql, qr, e);
        insert(o << 1 | 1, m + 1, r, ql, qr, e);
    }
    void dfs(int o, int l, int r) {
        int snap = dsu.snapshot();                       // 進節點:存快照
        for (auto& [u, v] : bucket[o]) dsu.unite(u, v);  // union 掛著的邊
        if (l == r) answer(l);
        else {
            int m = (l + r) >> 1;
            dfs(o << 1, l, m);
            dfs(o << 1 | 1, m + 1, r);
        }
        dsu.rollback(snap);                              // 離開:回滾
    }
};

// ---------- 用法示例:離線動態連通性 ----------
// 輸入 n q,接著 q 行:"+ u v" 加邊 / "- u v" 刪邊 / "? u v" 問連通(1-indexed)
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<char> op(q);
    vector<pair<int,int>> qe(q);
    map<pair<int,int>, int> openAt;   // 目前存活的邊 -> 加入時刻
    SegDivide sd(q, n);
    for (int i = 0; i < q; i++) {
        char c; int u, v;
        cin >> c >> u >> v; --u; --v;
        if (u > v) swap(u, v);
        op[i] = c; qe[i] = {u, v};
        if (c == '+') openAt[{u, v}] = i;
        else if (c == '-') {                       // 存活區間 = [加入時刻, 刪除時刻-1]
            sd.insert(openAt[{u, v}], i - 1, {u, v});
            openAt.erase({u, v});
        }
    }
    for (auto& [e, l] : openAt) sd.insert(l, q - 1, e);  // 未刪的邊活到最後
    sd.answer = [&](int t) {
        if (op[t] == '?')
            cout << (sd.dsu.find(qe[t].first) == sd.dsu.find(qe[t].second) ? "YES" : "NO") << '\n';
    };
    sd.run();
    return 0;
}
```

## 要點 / 易錯
- **絕不路徑壓縮**:壓縮改寫父指標、破壞歷史結構,回滾即錯;只按 size/rank 合併,find 退化為 O(log n)。
- **回滾嚴格 LIFO**:只能整段退回到某個 `snapshot()`,不能撤銷中間任意一次 union;所有撤銷點都與快照成對出現(dfs 進/出天然配對)。
- **端點半開/閉要一致**:本模板全閉區間,邊存活 `[加入時刻, 刪除時刻-1]`(刪除那一刻已無此邊);混用半開是最常見 off-by-one。
- **附加量一併進回滾棧**:維護連通塊 max/size/答案計數/二分圖奇偶等,unite 時把舊值壓棧、rollback 時還原(本模板的 `sz`、`comps` 即示範);二分圖用帶權 DSU 存「到根奇偶」p,加邊 (u,v) 合併時被掛根的奇偶設為 p(u)^p(v)^1。
- **重邊**:示例用 `map<邊, 加入時刻>` 追蹤存活,同一條邊同時存活多份會互相覆蓋;題目允許重邊時改 `map<邊, vector<int>>` 按次配對。

## 例題
- **CF Round 1105 Div1 E「The end of this world,」(2239E,*3300)**——每條邊存活於參數區間 [low, w]:把參數軸當時間軸掛邊,分治骨架照搬,葉子做題目統計。(注意:problemset 舊題 1105E 無關,連結認 2239E。)
- **離線刪邊連通性(SPOJ DYNACON1 型)**——全程操作已知時,是「倒序加邊」以外的另一通解;且支援加刪任意交錯,不像倒序法要求純刪邊。
- **CF813F Bipartite Checking(*2500)/ 洛谷 P5787(模板)**——隨時間加刪邊判二分圖:帶權 DSU(到根奇偶)+ 回滾;加邊 (u,v) 產生奇環 ⇔ 已同塊且兩點奇偶相同。
