---
title: 競程技巧庫
---

<script setup>
import { withBase } from 'vitepress'
import { data as contests } from './contests.data'
</script>

# 競程技巧庫

> 拆解每場比賽值得學的**解題思路**:題意、關鍵觀察、正確實作、能遷移到哪。重點不在題號,而在「看到什麼線索 → 想到什麼方法」。

## 這裡有什麼

- **比賽 digest** — 每場 Codeforces / AtCoder 一份,逐題「題意 + 核心作法」,附驗算小例與關鍵 code。
- **[LeetCode 月報](/cp/leetcode/2026-07)** — 以月為單位,每場收 Q4(偶爾有亮點的 Q3)。
- **技巧卡** — 反覆出現、值得深挖的 pattern,收成可複用的模板 + 易錯點。
- **弱項專題** — 成套補的主題:[幾何](/cp/topics/geometry)、[flow](/cp/topics/flow)、[矩陣](/cp/topics/matrix)、[數論組合](/cp/topics/ntc)。

難度大致涵蓋到 CF `~2700` / AtCoder `AtC~2300`,更高的只收長期可複用的經典模板。按技巧聚合見 **[技巧 tag 索引](/cp/tags)**。

## 技巧 tag

`dp` `數位dp` `區間dp` `狀壓` `背包` `貪心` `反悔貪心` `構造` `分類討論` `模擬` `數學` `圖論` `最短路` `flow` `樹` `HLD` `線段樹` `BIT` `線段樹分治` `可回滾DSU` `ODT` `treap` `資料結構` `數論` `組合計數` `容斥` `莫比烏斯` `歐拉函數` `機率期望` `反射原理` `多項式` `NTT` `字串` `Manacher` `幾何` `矩陣` `博弈` `排列` `置換環` `逆序對` `位元` `XOR` `WHT` `BSGS` `MITM` `不變量` `貢獻` `差分` `離線` `掃描線` `根號` `二分` `分治` `互動` `bitset` `狀態擴充` `分層圖` `Pareto`

## 比賽 digest 索引

<table>
  <thead><tr><th>日期</th><th>比賽</th><th>重點 tag</th></tr></thead>
  <tbody>
    <tr v-for="c in contests" :key="c.url">
      <td>{{ c.date }}</td>
      <td><a :href="withBase(c.url)">{{ c.short }}</a></td>
      <td>{{ c.tags.join('·') }}</td>
    </tr>
  </tbody>
</table>

## 技巧卡

| 技巧 | tag | 用在哪 |
| --- | --- | --- |
| [線段樹維護矩陣乘積](/cp/techniques/segtree-matrix-product) | 線段樹·矩陣·dp | 「線性遞推 × 區間 × 點修改」通法 |
| [有界資源維狀態擴充](/cp/techniques/bounded-resource-state) | 最短路·狀態擴充·Pareto | 多準則最短路:資源維別折疊成單標籤 |
| [線段樹分治 + 可回滾 DSU](/cp/techniques/segtree-divide-rollback-dsu) | 線段樹分治·離線 | 離線動態連通性通法(CF1105 E 型) |
| [反悔貪心](/cp/techniques/regret-greedy) | 反悔貪心·貪心 | 「選 k 個互不相鄰」模板(ABC464 G / JOI Candies) |
| [莫比烏斯反演 / μ 除數篩](/cp/techniques/mobius-inversion) | 數論·容斥·莫比烏斯 | 互質 / 共質因子計數的批次通法 |
| [歐拉函數 φ / 積性函數線性篩](/cp/techniques/euler-totient) | 數論·歐拉函數·莫比烏斯 | gcd 求和 / 互質計數 / 模冪降次 |
| [Manacher](/cp/techniques/manacher) | 字串·Manacher | O(n) 每中心最長回文(含整數陣列變形) |
| [數位 DP](/cp/techniques/digit-dp) | 數位dp·dp | [L,R] 數位條件計數;tight/lead 不進 memo key |
| [Implicit Treap](/cp/techniques/implicit-treap) | 資料結構·treap | 按位置插入的動態序列 + 前綴聚合;split/merge 兩原語;模板已對拍 |
