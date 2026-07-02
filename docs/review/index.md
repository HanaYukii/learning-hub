---
title: 複習佇列
outline: false
---

<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as items } from './review.data'

// 「今天」必須在 client 端算:GitHub Pages 只在 push 時 rebuild,
// build-time 的今天隔幾天就過期;也避免 SSR/client hydration 不一致。
const today = ref('')
onMounted(() => {
  const n = new Date()
  today.value = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
})
const overdueDays = (d) => Math.floor((new Date(today.value) - new Date(d)) / 86400000)
const overdue = computed(() => (today.value ? items.filter((i) => i.due <= today.value) : []))
const upcoming = computed(() => (today.value ? items.filter((i) => i.due > today.value).slice(0, 10) : []))
const recent = computed(() =>
  items.filter((i) => i.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
)
</script>

# 複習佇列

本頁**自動**掃描全站筆記的 frontmatter(`reviewed` + `review_interval`)產生,新內容入庫即自動排程,不需手動維護。

## 🔔 已到期

<p v-if="today && overdue.length === 0">✅ 目前沒有到期項目。</p>
<table v-if="overdue.length">
  <thead><tr><th>筆記</th><th>區</th><th>上次複習</th><th>間隔</th><th>逾期</th></tr></thead>
  <tbody>
    <tr v-for="i in overdue" :key="i.url">
      <td><a :href="withBase(i.url)">{{ i.title }}</a></td>
      <td>{{ i.section }}</td>
      <td>{{ i.reviewed }}</td>
      <td>{{ i.interval }}d</td>
      <td>{{ overdueDays(i.due) }} 天</td>
    </tr>
  </tbody>
</table>

## 📅 即將到期

<table v-if="upcoming.length">
  <thead><tr><th>筆記</th><th>區</th><th>到期日</th><th>間隔</th></tr></thead>
  <tbody>
    <tr v-for="i in upcoming" :key="i.url">
      <td><a :href="withBase(i.url)">{{ i.title }}</a></td>
      <td>{{ i.section }}</td>
      <td>{{ i.due }}</td>
      <td>{{ i.interval }}d</td>
    </tr>
  </tbody>
</table>

## ⚡ 最近比賽快掃(零維護的降級模式)

不想跟排程,直接倒序重掃最近的 digest 也是有效複習:

<ul>
  <li v-for="i in recent" :key="i.url"><a :href="withBase(i.url)">{{ i.title }}</a>({{ i.date }})</li>
</ul>

## 怎麼複習

1. **不要只看筆記** —— 打開該題/該卡的一道例題,蓋住作法與模板,重做一遍。
2. 複習完,一行指令更新狀態(改 frontmatter + 自動 commit):

```bash
npm run reviewed -- cp/contests/2026-06-27-cf-round-1105-div1 --ok    # 一次過:間隔加倍(封頂 60d)
npm run reviewed -- quant/problems/prob-brainteasers --fail           # 卡住:間隔砍回 3d
```

3. `push` 之後本頁自動更新。

> 間隔即掌握度:`3–7d` = 還在學,`14–30d` = 熟悉,`60d` = 已掌握。忘了就 `--fail` 退階。
