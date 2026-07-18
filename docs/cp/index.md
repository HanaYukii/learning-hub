---
title: 競程技巧庫
---

<script setup>
import { withBase } from 'vitepress'
import { data as contests } from './contests.data'
</script>

# 競程技巧庫

> **用途**:每場比賽後,快速記下「值得學的進步重點」。**主要給自己快速複習**,同時公開、可對外展示;內容與格式一律以「我自己學得到東西」為準。
> **收錄原則**:**各難度都收**(連 Div1 A/B 也要),只挑題型**主流、可遷移、學得起來**的。**丟**:偏門 gimmick(ad-hoc、一次性、吃靈光)。難度約 **~2700 為上限**——超過的只在「**經典模板工具**(HLD、ODT、線段樹分治、分治 NTT、BSGS、WHT… 可長期複用)」時破例。寧缺勿濫。
> **格式**:**題目懶人包** —— 每題「**題意(2–4 句,input/output 與約束明確,讀完能直接想題)+ 核心作法 1–2 行**」;**2000 分已懂的 common sense 跳過**。不用像[部落格](https://hanayukii.dev)那麼細(那是對外分享的深入版)。

## 兩種檔案

- **比賽 digest** — `contests/<日期>-<比賽>.md`,**主要單位**。一場一檔,每題列「技巧 + 作法」。([模板](/cp/contests/template))
- **技巧卡** — `techniques/<slug>.md`,只有**反覆出現或值得深挖**的 pattern 才升級成一張卡;也保持精簡(模板碼 + 易錯一兩句,不寫長篇)。([模板](/cp/template))
- **弱項專題** — `topics/<slug>.md`,**不等比賽、主動補弱項**:[幾何](/cp/topics/geometry)、[flow](/cp/topics/flow)、[矩陣](/cp/topics/matrix)、[數論組合](/cp/topics/ntc)。每份 = 核心模板 + 5–8 道 CF 2100–2500 經典題。

> 側欄、下方索引表、[tag 索引](/cp/tags)、[複習佇列](/review/)全部**自動生成**——加一場比賽 = 只放一個 md 檔(frontmatter 填好 `contest/date/tags/reviewed`)。

## 收錄判準

- [ ] 題型**主流**、之後**會再遇到**(非偏門一次性 gimmick)
- [ ] 有**可遷移**的 pattern / 觀察
- [ ] 難度 ≲ **~2700**(超標只在「經典模板工具」時破例)

各難度都收(簡單題記一句觀察就好);**ABC 例外:原則上 E 起、CF-equivalent ≳ ~1700 才收**(前段熱身在 header 一行帶過)。**偏門**或**超 2700 又非經典模板** → 不收(頁面上不列被篩掉的題)。

## tag 詞彙表(canonical)

**鐵則:tag 只能從這張表選;要新 tag,先把它加進這張表再用。**(同義詞不要另起:`greedy`→`貪心`、`期望/期望值`→`機率期望`、`狀態壓縮`→`狀壓`)

`dp` `數位dp` `區間dp` `狀壓` `背包` `貪心` `反悔貪心` `構造` `分類討論` `模擬` `數學` `圖論` `最短路` `flow` `樹` `HLD` `線段樹` `BIT` `線段樹分治` `可回滾DSU` `ODT` `資料結構` `數論` `組合計數` `容斥` `機率期望` `反射原理` `多項式` `NTT` `字串` `幾何` `矩陣` `博弈` `排列` `置換環` `逆序對` `位元` `XOR` `WHT` `BSGS` `MITM` `不變量` `貢獻` `差分` `離線` `掃描線` `根號` `二分` `分治` `互動` `bitset` `狀態擴充` `分層圖` `Pareto`

→ 按 tag 聚合的所有題目見 **[技巧 tag 索引](/cp/tags)**。

## 比賽 digest 索引(自動生成)

<table>
  <thead><tr><th>日期</th><th>比賽</th><th>重點 tag</th><th>複核</th></tr></thead>
  <tbody>
    <tr v-for="c in contests" :key="c.url">
      <td>{{ c.date }}</td>
      <td><a :href="withBase(c.url)">{{ c.short }}</a></td>
      <td>{{ c.tags.join('·') }}</td>
      <td>{{ c.verified ? '✅' : '⏳' }}</td>
    </tr>
  </tbody>
</table>

> 複核:digest 由 AI 依 editorial 產出;⏳ = 尚未人工重解核對。複習時重解過任一題且無誤 → 把該檔 frontmatter 的 `verified` 翻 `true`。

## 技巧卡索引

| 技巧 | tag | 為何值得 |
| --- | --- | --- |
| [線段樹維護矩陣乘積](/cp/techniques/segtree-matrix-product) | 線段樹·矩陣·dp | 「線性遞推 × 區間 × 點修改」通法;ICPC 印尼心結題 |
| [有界資源維狀態擴充](/cp/techniques/bounded-resource-state) | 最短路·狀態擴充·Pareto | 多準則最短路別折疊成單標籤 |
| [線段樹分治 + 可回滾 DSU](/cp/techniques/segtree-divide-rollback-dsu) | 線段樹分治·離線 | 離線動態連通性通法;CF1105 E 型,模板已編譯對拍 |
| [反悔貪心](/cp/techniques/regret-greedy) | 反悔貪心·貪心 | 「選 k 個互不相鄰」模板;ABC464 G / JOI Candies 型 |

## 技巧卡候選(digest 反覆出現的 pattern)

出現 ≥2 次或屬經典模板 → 升級成卡。寫 digest 時順手更新:

- `不變量`(CF1104 D、ARC222 F、ARC223 E)——已出現 3 場,偏思路難成卡,先觀察
- `值域線段樹 descent`(ABC467 G,親自推導)——kth-element 式 root→leaf 走位取代外層二分,經典模板,**候選**
