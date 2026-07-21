---
title: Implicit Treap：按位置插入的動態序列
tags: [資料結構, treap]
why: 動態序列需要在中間插入/刪除，又要查前綴聚合；一般陣列、BIT、線段樹都不適合直接套。implicit treap 用 split/merge 把操作維持在期望 O(log n)
trigger: 按 rank(第幾個)插入/刪除，同時維護和、長度、max 等子樹資訊；或需要區間搬移、翻轉、cut-paste
problems:
  - { name: "動態字串序列的起始位置(本文例子)", url: "", rating: 2000 }
  - { name: "洛谷 P3391 文藝平衡樹(區間翻轉)", url: "https://www.luogu.com.cn/problem/P3391", rating: 1800 }
reviewed: 2026-07-20
review_interval: 21
lastUpdated: false
---

# Implicit Treap

遇到要在序列中間插入、又要查前綴聚合時，普通陣列會卡在 $O(n)$ 搬移；BIT 和一般線段樹也綁著固定下標，不適合直接套。

Implicit treap 直接把 inorder 當成序列。節點不存 key，只靠左子樹的 `cnt` 判斷 rank；另外用隨機 priority 維持 heap，樹高期望是 $O(\log n)$。平常只需要兩個操作：

- `split(t, k)`:把樹切成「前 $k$ 個」和「其餘」兩棵。
- `merge(a, b)`:把兩棵樹接起來($a$ 全體在 $b$ 前面),優先度大的當根。

## split / merge 模板

> 以下都用 0-based。`insert(k, x)` 表示插入後 $x$ 前面恰好有 $k$ 個元素($0\le k\le n$)；`prefix(k)` 回傳前 $k$ 項總和。

```cpp
struct Node {
    ll val, sum;                 // sum = 子樹聚合
    uint64_t pri;
    Node *l = nullptr, *r = nullptr;
    int cnt = 1;
    Node(ll v, uint64_t p) : val(v), sum(v), pri(p) {}
};
int cnt(Node* t) { return t ? t->cnt : 0; }
ll sum(Node* t) { return t ? t->sum : 0; }
void pull(Node* t) {
    t->cnt = 1 + cnt(t->l) + cnt(t->r);
    t->sum = t->val + sum(t->l) + sum(t->r);
}

void split(Node* t, int k, Node*& a, Node*& b) {     // 前 k 個進 a
    if (!t) { a = b = nullptr; return; }
    if (cnt(t->l) >= k) { split(t->l, k, a, t->l); pull(t); b = t; }
    else { split(t->r, k - cnt(t->l) - 1, t->r, b); pull(t); a = t; }
}
Node* merge(Node* a, Node* b) {
    if (!a || !b) return a ? a : b;
    if (a->pri > b->pri) { a->r = merge(a->r, b); pull(a); return a; }
    b->l = merge(a, b->l);   pull(b); return b;
}

// insert(k, x):切一刀、夾進去
void insert(Node*& root, int k, ll x) {
    Node *a, *b;
    split(root, k, a, b);
    root = merge(merge(a, new Node(x, rng())), b);
}
// prefix(k):切一刀讀聚合、接回去(也可不切、沿樹下降)
ll prefix(Node*& root, int k) {
    Node *a, *b;
    split(root, k, a, b);
    ll res = sum(a);
    root = merge(a, b);
    return res;
}
```

`erase(k)` 會切出 $[k,k+1)$ 丟掉，只接回左右兩側；其他區間操作則切出 $[l,r)$，處理完再 merge 回去。

## 例子：動態字串序列的起始位置

這題來自一次面試，以下只留去識別化後的資料結構核心。當下我有看出中間插入會讓 BIT 和一般線段樹的 index 失效，但沒有想到 implicit treap，最後只寫了前綴和版本。

> 維護一列不重複的字串。`insert(index, s)` 插入 $s$，使它前面恰有 `index` 個字串；`query(s)` 回傳整列串接後，$s$ 的 0-based 起始字元位置。字串本身不會被拆開。

面試後跟朋友重新討論，解法可以拆成兩層：treap 管序列順序，hash map 管字串到節點的查找。每個節點另外維護子樹字串數 `cnt` 和總字元數 `len`：

| 需求 | 做法 |
| --- | --- |
| 維護字串順序 | treap 的 inorder |
| 在第 `index` 個 gap 插入 | 依 `cnt` 做 `split(index)` |
| 查字串對應節點 | `unordered_map<string, Node*>` |
| 算起始字元位置 | 累加節點左側的 `len` |

插入照前面的模板做。查詢時先從 map 找到 `Node*`，再靠 `parent` 指標一路往根走，算出這個節點前面共有多少字元：

```cpp
// 起始位置 = 左子樹總長,一路向上:每當自己是 parent 的右兒子,
// 前面就多了「parent 的左子樹 + parent 自己」
ll startIndex(Node* v) {
    ll ans = len(v->l);
    for (; v->p; v = v->p)
        if (v == v->p->r) ans += len(v->p->l) + (ll)v->p->s.size();
    return ans;
}
```

含 `parent` 的版本要在 `pull` 裡更新非空 child 的 `p`。另外，split 的兩個輸出根與 merge 的最終根都要明確設成 `p = nullptr`；merge 的 base case 不會經過 `pull`。

split / merge 只改節點之間的連結，不會搬動 Node 本身。只要配置方式能保持位址穩定、節點也還沒被刪除，map 裡的 `Node*` 就能繼續用。treap 的結構操作期望 $O(\log n)$；把字串雜湊算進去，insert / query 平均是 $O(|s|+\log n)$。

這裡只有完整字串查找，`unordered_map` 就夠；需要 prefix query 時再考慮 Trie。

這個版本假設字串唯一。若允許重複，最好替每筆插入資料配 ID，否則 `query(s)` 本身就不清楚要找哪一次出現。index 與答案都用 0-based，總字元數用 `long long`。

## 實作時會踩的坑

- map 存的是裸指標，Node 不能放進可能 reallocate 的 `vector<Node>`；用 `new`、`deque<Node>` 或位址穩定的 memory pool。
- priority 建議用 `uint64_t` 配 `mt19937_64`，降低碰撞，也不要依賴不同平台品質不一的 `rand()`。
- 聚合值(例如總長、總和)用 `long long`。
- 區間翻轉要在 split / merge 往下前先 `push`；`applyRev` 需要交換左右子並切換 lazy tag。若聚合與順序有關(字串 hash、矩陣乘積)，還要同時維護正反兩個方向；若也保留 parent handle，查詢前要先把 root 到該節點路徑上的 lazy tag 推下去。
- 遞迴深度期望是 $O(\log n)$，但最壞仍可能到 $O(n)$。多測時記得回收節點，或直接用 pool。
- 其他可選結構有 splay、rope 或依題目限制設計的序列線段樹；這裡選 treap 是因為 split / merge 比較直接。

## 例題 / 變形

- [洛谷 P3391 文藝平衡樹](https://www.luogu.com.cn/problem/P3391) `~1800` — 區間翻轉的標準題：切出區間、掛 lazy tag，再接回去。
- [Edu 192 F Summer Vacation](/cp/contests/2026-07-06-cf-edu192) `~2500` — cut-paste 加轉移函數；需要共享結構時改成 copy-on-write 的持久化 treap。持久化版本不能沿用單一 `parent` 指標。
- Rope / 文字編輯器：大文本中間插入、刪除與搬移。
- Treap 也能按實際 key 當平衡 BST 用；那是另一種 split 條件，不是本文的 implicit rank。
