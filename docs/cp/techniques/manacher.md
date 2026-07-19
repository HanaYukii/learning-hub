---
title: Manacher(線性最長回文 / 每中心回文半徑)
tags: [字串, Manacher]
why: O(n) 求「每個中心的最長回文」;殼常包在整數陣列上、比較改成值相等——認出來就秒殺
trigger: 回文子串/子陣列相關;尤其「對每個中心要最長回文」或「回文子串計數」
problems:
  - { name: "LC WC509 Q4 Palindromic Subarray Sum(整數陣列 Manacher + 全正單調)", url: "https://leetcode.com/problems/palindromic-subarray-sum/", rating: 2202 }
---

# Manacher

- **觸發**:回文子串/子陣列;特別是**「對每個中心求最長回文」**或**回文子串計數**。殼常換皮成整數陣列(比較改 `==`)、或藏在「全正值 ⇒ 回文越長和越大」這類單調性後面。
- **核心**:插分隔符把奇偶回文統一成「每個中心一個半徑」。$t=[\,S,a_0,S,a_1,\dots,S\,]$(長 $2n+1$,$S$ 取一個**不在陣列裡**的值);$p[i]=$ 中心 $t$-index $i$ 的半徑。用當前最右回文 $(c,r)$ 的**鏡像** $p[i]\gets\min(r-i,\;p[2c-i])$ 起步再暴力擴,總 $O(n)$。
- **關鍵對應**:中心 $i$ 的**真實回文長度 $=p[i]$**;真實區間 $a[l,\,l+p[i])$,其中 $l=(i-p[i])/2$。奇回文的中心是真實元素($i$ 奇)、偶回文的中心是分隔符($i$ 偶),統一處理。
- **一次拿到**:最長回文 $=\max_i p[i]$;回文子串總數 $=\sum_i\lfloor (p[i]+1)/2\rfloor$;每中心最長回文 $=p[i]$ 直接用。

```cpp
// 通用 Manacher:回傳 p[],p[i]=中心 t-index i 的「真實回文長度」
// t = [SEP, a0, SEP, a1, ..., SEP](size 2n+1);SEP 取一個不在 a 裡的值
template <class T>
vector<int> manacher(const vector<T>& a, T SEP) {
    int n = a.size(), m = 2 * n + 1;
    vector<T> t(m, SEP);
    for (int i = 0; i < n; i++) t[2 * i + 1] = a[i];
    vector<int> p(m, 0);
    for (int i = 0, c = 0, r = 0; i < m; i++) {
        if (i < r) p[i] = min(r - i, p[2 * c - i]);                 // 鏡像起步
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < m
               && t[i - p[i] - 1] == t[i + p[i] + 1]) p[i]++;        // 暴力擴
        if (i + p[i] > r) c = i, r = i + p[i];                       // 更新最右回文
    }
    return p;   // 真實長度 = p[i];真實區間 a[l, l+p[i]),l = (i - p[i]) / 2
}
// 字串:manacher<char>(vector<char>(s.begin(),s.end()), '\1'); 用不出現的字元當 SEP
```

## 這題的變形(WC509 Q4 Palindromic Subarray Sum)
正整數陣列,求「本身是回文的連續子陣列」的最大元素和。

- **寶石:全正值 ⇒ 固定中心時回文半徑越大、區間和越大** → 每個中心只需它的**最長回文**,不必枚舉所有回文。於是問題塌成「對每中心取最長回文的區間和,取 max」,直接套 Manacher($O(n)$)。
- Manacher 跑在**整數陣列**上:比較從字元相等改成**值相等**(通用模板已支援);$S$ 取值域外的值(值 $\ge1$ 就用 $0$ 或 $-1$)。

```cpp
// pre = 原陣列前綴和;p = manacher(nums, 0)
long long best = 0;
for (int i = 0; i < (int)p.size(); i++)
    if (p[i]) {                                  // 中心 i 的最長回文
        int L = p[i], l = (i - L) / 2;           // 真實區間 nums[l, l+L)
        best = max(best, pre[l + L] - pre[l]);
    }
// best = 最大回文子陣列和
```

## 替代解:hash + 二分(不會 Manacher 也能過,$O(n\log n)$)
每個中心「是回文」對半徑**單調**(長回文的內層也是回文)→ 對每中心二分最大半徑,用正反雙雜湊 $O(1)$ 判等。

```cpp
// H 正向、Hr 反向多項式雜湊;odd(i)=以 i 為中心的最長奇回文半徑
int lo = 0, hi = min(i, n - 1 - i);
while (lo < hi) {                                 // 找最大 rad 使 [i-rad, i+rad] 為回文
    int rad = (lo + hi + 1) / 2;
    if (sub(i - rad, i + rad) == subRev(i - rad, i + rad)) lo = rad; else hi = rad - 1;
}
// 偶回文中心在 (i, i+1) 之間,另跑一輪;比 Manacher 多一個 log,但好寫、可重用雜湊
```

## 要點 / 易錯
- **$S$ 必須不在陣列裡**:整數陣列別隨手用 $0$/$-1$——確認值域外才行(WC509 值 $\ge1$ 用 $0$ 安全)。
- **真實長度就是 $p[i]$、$l=(i-p[i])/2$**:別和「$t$ 上的半徑」搞混;偶回文中心落在分隔符($i$ 偶)。
- **計數公式** $\sum\lfloor(p[i]+1)/2\rfloor$ 是**回文子串總數**(含長度 1);要「相異回文」得配回文樹(PAM),Manacher 不管相異。
- **擴張要檢查邊界** `i-p-1>=0 && i+p+1<m`(本模板用顯式邊界檢查取代 `^…$` 端哨兵)。
- 只要「每中心最長回文」而值有**單調性**(全正、或求最長)時 Manacher 最省;若要「每個回文都枚舉」則另配前綴和/計數。

## 例題 / 變形
- [LC WC509 Q4 Palindromic Subarray Sum](https://leetcode.com/problems/palindromic-subarray-sum/) `LC~2202` — 全正單調 + 整數 Manacher。見 [7 月月報](/cp/leetcode/2026-07)。
- **最長回文子串 / 回文子串計數**:$\max p[i]$ / $\sum\lfloor(p[i]+1)/2\rfloor$。
- **相異回文個數、每回文出現次數**:改用**回文樹 PAM**(Manacher 不做相異);兩者常互補。
