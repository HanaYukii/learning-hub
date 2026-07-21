---
title: Implicit Treap(按位置插入的動態序列)
tags: [資料結構, treap]
why: 「在第 k 個位置插入」會讓陣列 / BIT / 線段樹全滅——下標固定的結構撐不住中間插入;treap 用 split/merge 兩個原語把這件事變成 O(log n)
trigger: 動態序列要按 rank(第幾個)插入/刪除,同時維護前綴聚合(和、長度、max);或要做區間搬移 / 翻轉 / cut-paste
problems:
  - { name: "動態字串序列的起始位置(面試實戰型,本卡 worked example)", url: "", rating: 2000 }
  - { name: "洛谷 P3391 文藝平衡樹(區間翻轉)", url: "https://www.luogu.com.cn/problem/P3391", rating: 1800 }
reviewed: 2026-07-20
review_interval: 21
---

# Implicit Treap

**要解什麼**:維護一個會**在中間插入**的序列,還要邊插邊查聚合(前綴和、前綴長度、第 k 個元素…)。陣列插入要 O(n) 搬移;BIT / 線段樹的下標是蓋死的,中間一插全體位移就壞了。需要的是「**以 rank 為 key 的平衡樹**」——而比賽/面試現場最好手寫的就是 implicit treap。

**核心**:treap = BST + heap 的混血——inorder 順序就是序列順序(BST 性質),每個節點帶一個**隨機優先度**、往上維持 heap 性質。隨機優先度讓樹形跟「隨機插入順序的 BST」同分布,期望深度 $O(\log n)$。「implicit」指**不存 key**:要找第 $k$ 個元素,用左子樹的 `size` 導航即可,所以插入位置可以任意。一切操作由兩個原語拼出來:

- `split(t, k)`:把樹切成「前 $k$ 個」和「其餘」兩棵。
- `merge(a, b)`:把兩棵樹接起來($a$ 全體在 $b$ 前面),優先度大的當根。

## 入門模板題

> 維護序列,支援:`insert(k, x)`(在第 $k$ 個位置前插入)與 `prefix(k)`(前 $k$ 項總和)。

```cpp
struct Node {
    ll val, sum;                 // sum = 子樹聚合
    uint32_t pri;
    Node *l = nullptr, *r = nullptr;
    int cnt = 1;
    Node(ll v, uint32_t p) : val(v), sum(v), pri(p) {}
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

`erase(k)` 就是切兩刀丟中段;區間操作(取出 $[l,r]$ 打標記 / 搬走)也是切兩刀處理中段再接回——**所有需求都回到 split/merge 的組合**,這是 treap 好寫的原因。

## Worked example:動態字串序列的起始位置

> 維護一列字串,兩種操作:`add_pair(index, s)` 把 $s$ 插在第 `index` 個字串的位置(index 以**字串個數**計);`query(s)` 回傳把整列串接後,$s$ 的**起始字元位置**。(面試實戰型;字串不會被拆開。)

先建對應表,這題就變成上面的模板題:

| 題目概念 | treap 對應 |
| --- | --- |
| 字串在序列中的順序 | inorder 順序 |
| `index`(第幾個字串) | 左子樹 `cnt` 導航 |
| 串接後的字元位置 | 前面所有節點的 `len` 總和 |
| 中間插入 | `split(index)` + `merge` |

每個節點多維護 `len` = 子樹字串總長。插入即模板;麻煩在 `query(s)`:手上只有字串,要先找到節點(`unordered_map<string, Node*>`),**再算出「這個節點前面的總長」——但 handle 不知道自己的 rank**。解法是給節點加 `parent` 指標、由下往上走:

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

parent 的維護不必另寫邏輯:**在 `pull` 裡順手設 `t->l->p = t`、`t->r->p = t`**,split/merge 本來就會對每個改過的節點呼叫 pull。兩個操作都是期望 $O(\log n)$。

面試先問清楚的事:字串是否唯一(不唯一則 map 要存多個 handle)、`query` 的 s 是否保證是完整插入過的字串(否則變成 dynamic text indexing,完全另一題)、0-based 還是 1-based、有沒有 delete、總長會不會爆 int(前綴長度用 `long long`)。

## 要點 / 易錯

- **split 的兩個輸出根,parent 都要清**。常見寫法只清了 `b` 側——insert-only 流程會被後續 merge 蓋掉而僥倖沒事,一旦單獨使用 split(比如只查不改),stale parent 會讓向上走位走進舊樹,錯得很難查。乾脆在 split/merge 的出口把根的 `p` 一律設 null。
- 優先度用 `mt19937`,別用 `rand()`(RAND_MAX 太小、低熵,樹會退化)。
- 聚合(前綴長度、和)開 `long long`。
- 遞迴 split/merge 期望深度 $O(\log n)$,不用怕爆疊;多測記得整棵釋放或用 memory pool。
- 同型替代:splay(均攤,常數好但難寫對)、`__gnu_cxx::rope`(現成但客製聚合難)、序列線段樹。**現場手寫,implicit treap 的碼量/出錯率比最優**。

## 例題 / 變形

- **動態字串起始位置**(本卡 worked example)——動態序列 + 加權前綴和的原型。
- [洛谷 P3391 文藝平衡樹](https://www.luogu.com.cn/problem/P3391) `~1800` — **區間翻轉**:切兩刀取中段、打 lazy 翻轉標記(swap 左右子、下推),treap 的招牌能力。
- [Edu 192 F Summer Vacation](/cp/contests/2026-07-06-cf-edu192) `~2500` — 序列 **cut-paste** 疊轉移函數;取段要共享結構 → **持久化 treap**(split/merge 改寫成 copy-on-write)。
- **Rope / 文字編輯器**:大文本任意位置插入刪除,同一結構換皮。
- 進階:treap 也能按 key 當平衡 BST 用(split by value)、兩棵樹 merge(啟發式/finger),遇到再收。

（模板與 worked example 經隨機資料對照暴力驗證。)
