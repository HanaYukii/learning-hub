---
title: 技巧 tag 索引
outline: false
aside: false
---

<script setup>
import { withBase } from 'vitepress'
import { data as groups } from './tags.data'
</script>

# 技巧 tag 索引

「我想複習所有 XX 題」看這頁——**自動**聚合所有 digest 的題目與技巧卡,依 tag 分組(出現次數排序)。

<p>
  <a v-for="g in groups" :key="'a' + g.tag" :href="'#' + g.tag" style="display:inline-block;margin:2px 6px 2px 0;">
    <code>{{ g.tag }}</code><small> ×{{ g.items.length }}</small>
  </a>
</p>

<section v-for="g in groups" :key="g.tag">
  <h2 :id="g.tag">{{ g.tag }} <small>({{ g.items.length }})</small></h2>
  <table>
    <thead><tr><th>題目 / 卡</th><th>出處</th><th>難度</th></tr></thead>
    <tbody>
      <tr v-for="(i, idx) in g.items" :key="g.tag + idx">
        <td><a :href="i.purl" target="_blank" rel="noreferrer">{{ i.problem }}</a></td>
        <td><a :href="withBase(i.fromUrl)">{{ i.from }}</a></td>
        <td>{{ i.rating }}</td>
      </tr>
    </tbody>
  </table>
</section>
