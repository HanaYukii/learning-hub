---
title: 數位 DP(記憶化 DFS 模板 + 乾淨狀態設計)
tags: [數位dp, dp]
why: 關鍵不在「怎麼填位」,而在「哪些維度進 memo key」——tight/lead 混進去會算錯或白清表
trigger: 求 [L, R] 內滿足某「數位條件」的數的個數,且 R 很大(常以字串讀入)
problems:
  - { name: "ABC465 E Digit Circus(mask 用過數字 × mod3 × 恰一條件)", url: "https://atcoder.jp/contests/abc465/tasks/abc465_e", rating: 1400 }
reviewed: 2026-07-19
review_interval: 21
---

# 數位 DP

- **觸發**:「$[L,R]$ 內滿足某**數位條件**(數字集合 / 各位和 / 相鄰位關係 / mod…)的數有幾個」,且 $R$ 很大(字串讀入)。答案 $=\mathrm{solve}(R)-\mathrm{solve}(L-1)$。
- **核心**:對「位置」由**高位→低位**做記憶化 DFS(先固定高位才能做 tight 比較)。條件通常**只在末端判**,過程只累積資訊。狀態分兩類:
  - **內容維度**(`pos` + 你追蹤的資訊,如 `mask` / `mod`)——真正定義子問題,**進 memo key**。
  - **唯一路徑維度**(`tight`=是否貼緊 $N$、`lead`=是否還在前導零)——**不進 key**,只當快取的 guard。
- **為何 tight / lead 不進 key**:貼緊 $N$ 的前綴只有一條(就是 $N$ 自己),前導零前綴也只有一條 → 這些狀態**各只被走到一次**,存進表永遠不會被重讀。而**自由狀態**(`!tight && !lead`)剩下每位都能填 $0\sim9$,答案只跟 `(pos, mask, mod)` 有關、與怎麼填到這裡無關 → 大量前綴撞在一起,memo 才真正省時間。
- **複雜度**:$O(\text{位數}\times|\text{狀態}|\times 10)$。

```cpp
// 通用骨架:計數 [1, N] 中滿足數位條件的數。d[0]=最高位(高→低)。
// 內容維度 state 進 key;tight/lead 只當 guard,讀寫要對稱。
ll dfs(int pos, int state, bool tight, bool lead) {
    if (pos == (int)d.size()) return accept(state, lead);       // 末端判條件
    if (!tight && !lead && vis[pos][state]) return memo[pos][state];   // 只快取自由狀態
    int hi = tight ? d[pos] : 9;
    ll res = 0;
    for (int nd = 0; nd <= hi; nd++) {
        bool nlead = lead && nd == 0;                           // 還在前導零?
        int nstate = transit(state, nd, nlead);                 // 前導零通常不更新 state
        res = (res + dfs(pos + 1, nstate, tight && nd == hi, nlead)) % MOD;
    }
    if (!tight && !lead) { vis[pos][state] = true; memo[pos][state] = res; }
    return res;
}
// 呼叫:dfs(0, 初始 state, /*tight=*/true, /*lead=*/true)
```

## 為什麼混用 tight/free 會算錯(不只是浪費)
自由狀態算「剩下 $0\sim9$ 隨便填」的方法數;貼緊狀態算「剩下被 $N$ 卡住」的方法數。**同一個 `(pos, state)`,這兩個答案不一樣**。例:$N=531$,走到最後一位——自由能填 $0\sim9$(10 種),貼緊只能填 $0\sim1$($\le$ 個位)。若共用同一格,自由先寫 10,貼緊來讀就錯拿 10。所以要嘛把 `tight` 放進 key(blog 常見寫法,但那半永遠寫一次沒人讀、還得每換 $N$ 清表),要嘛**用 `!tight` guard 把它擋在快取外**(精簡、省一半記憶體)。`lead` 同理。

## 要點 / 易錯
- **高位→低位、末端才判條件**;`accept()` 只看末端的 `state`。
- **guard 讀寫必須對稱**:`if(!tight && !lead)` 讀、也用同一條件寫;只擋一邊會錯。
- **前導零不算用過的數字**(當條件跟「用了哪些數字」有關時):`nlead` 為真時 `state` 保持初值,別把這個 `0` 算進去。否則「6」會被當「06」多算一個數字 0。
- **`lead` 常可被某個內容維度取代**:若有維度在「還沒放真數字」時剛好 $=$ 某定值,就用它判前導零、砍掉 `lead`。例:ABC465 E 用 `mask`(用過的數字集合),`mask==0 ⟺` 前導零(mask 只增不減,放任何真數字就 $\ne0$)。**反例**:只追蹤 `mod`,`mod==0` 分不出「前導零」還是「真的 3 的倍數」→ 必須留 `lead`。
- **多查詢 / `solve(R)−solve(L−1)`**:自由狀態答案**與 $N$ 無關** → 若用「**剩幾位**」而非絕對 `pos` 當索引,快取可跨不同 $N$、跨查詢共用、**永不清表**(tight 進 key 的版本每換 $N$ 都得 `memset`)。這是「tight 留在 key 外」最大的好處。

## 例題:ABC465 E Digit Circus
求 $1\le x\le N$($N<10^{500}$)中「恰滿足一條件」的個數 mod 998244353:(1) 3 的倍數;(2) 含數字 3;(3) 恰用 3 種相異數字。狀態 `mask`(用過數字 $2^{10}$)× `mod`(數字和 mod 3;因 $10\equiv1$)。用 `mask==0` 代 `lead`:

```cpp
const ll MOD = 998244353;
vector<int> d;                              // d[0]=最高位
ll memo[505][1024][3]; bool vis[505][1024][3];

ll dfs(int pos, int mask, int mod, bool tight) {          // 沒有 lead
    if (pos == (int)d.size()) {
        if (mask == 0) return 0;                          // mask==0 即 x=0,不計
        bool A = mod == 0, B = (mask >> 3) & 1, C = __builtin_popcount(mask) == 3;
        return A + B + C == 1;                            // 恰一條件成立
    }
    if (!tight && vis[pos][mask][mod]) return memo[pos][mask][mod];   // 只 guard tight
    int hi = tight ? d[pos] : 9;
    ll res = 0;
    for (int nd = 0; nd <= hi; nd++) {
        int nmask = (mask == 0 && nd == 0) ? 0 : (mask | (1 << nd));  // 前導零不算用過 0
        res = (res + dfs(pos + 1, nmask, (mod + nd) % 3, tight && nd == hi)) % MOD;
    }
    if (!tight) { vis[pos][mask][mod] = true; memo[pos][mask][mod] = res; }
    return res;
}
// solve: for (char c : s) d.push_back(c - '0');  cout << dfs(0, 0, 0, true);
```

（驗算:$N=13$ 時答案為 $4$——$6,9,12$ 只中「3 的倍數」、$13$ 只中「含 3」;$3$ 同時中兩條件故不計。)

## 更多變形
- **HDU 2089「不要 62」**:相鄰位關係(不含 4、不出現 62)——用 `pre`(前一位)當內容維度;無前導零問題,可不要 `lead`。
- **CF 1245F Daniel and Spring Cleaning**:同時對兩個上界跑,$a\oplus b=a+b$ 的計數。
- **各位數字和 / 數字出現次數 / 可被某數整除**:換 `state` 與 `accept()`,骨架不變。
