import { defineConfig, type DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-expect-error 無型別定義
import taskLists from 'markdown-it-task-lists'
import { shortContest, cjkTokenize } from './lib'

// Learning Hub —— 競程技巧 × 量化面試數學 個人知識庫
// 文件: https://vitepress.dev/reference/site-config

const docsDir = fileURLToPath(new URL('..', import.meta.url))

/** 從 markdown 原始碼撈單一 frontmatter 欄位(避免額外依賴) */
function fm(src: string, key: string): string {
  const m = src.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
}

/**
 * 掃描目錄自動生成 sidebar items —— frontmatter 是唯一資料源。
 * 加一場比賽/一張卡 = 只放一個 md 檔,不必再改本檔。
 */
function scanDir(
  rel: string,
  opts: { titleKeys?: string[]; sortByDate?: boolean; short?: boolean } = {},
): DefaultTheme.SidebarItem[] {
  const dir = path.join(docsDir, rel)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md' && f !== 'template.md' && !f.includes('example'))
    .map((f) => {
      const src = fs.readFileSync(path.join(dir, f), 'utf-8')
      let text = ''
      for (const k of opts.titleKeys ?? ['title']) {
        text = fm(src, k)
        if (text) break
      }
      if (!text) text = f.replace(/\.md$/, '')
      if (opts.short) text = shortContest(text)
      return { text, link: `/${rel}/${f.replace(/\.md$/, '')}`, date: fm(src, 'date') }
    })
    .sort((a, b) => (opts.sortByDate ? b.date.localeCompare(a.date) : a.text.localeCompare(b.text, 'zh-Hant')))
    .map(({ text, link }) => ({ text, link }))
}

/** 目錄存在才產生該 sidebar 群組(如日後的 quant/hft-cpp、cp/topics) */
function groupIf(text: string, rel: string, opts?: Parameters<typeof scanDir>[1]): DefaultTheme.SidebarItem[] {
  const items = scanDir(rel, opts)
  return items.length ? [{ text, collapsed: true, items }] : []
}

export default defineConfig({
  // 暫退回 GitHub Pages 專案站 https://hanayukii.github.io/learning-hub/
  // (cp-quant.hanayukii.dev 待 GitHub 憑證好、或改 Cloudflare 代理後再切回 base:'/')
  base: '/learning-hub/',
  lang: 'zh-TW',
  appearance: 'dark',
  // 模板檔是給作者的寫作參考,不對外部署
  srcExclude: ['**/template.md'],
  title: '花雪的競程筆記訓練場',
  description: '競程比賽的解題筆記與技巧卡、面試向數學、家教。花雪 HanaYukii — ICPC 區域賽金牌、前 Google 工程師、演算法海牛核心團隊成員。',
  lastUpdated: true,
  cleanUrls: true,
  // 死鏈守門:漏掛索引、改檔名忘改連結 → build 直接紅(#4)
  ignoreDeadLinks: false,

  markdown: {
    math: true, // markdown-it-mathjax3,支援 $...$ 與 $$...$$
    lineNumbers: false, // 模板碼是拿來抄的;個別長碼可用 ```cpp:line-numbers 局部開
    config: (md) => {
      md.use(taskLists) // quant checklist 的 - [ ] 勾選框
    },
  },

  themeConfig: {
    nav: [
      { text: '競程', link: '/cp/' },
      { text: '數學', link: '/quant/' },
      { text: 'C++', link: '/cpp/' },
      { text: '今日複習', link: '/review/' },
      { text: '家教', link: '/tutoring' },
      { text: '關於', link: '/about' },
    ],

    sidebar: {
      '/cp/': [
        {
          text: '競程技巧庫',
          items: [
            { text: '總覽與收錄原則', link: '/cp/' },
            { text: '技巧 tag 索引', link: '/cp/tags' },
          ],
        },
        {
          text: '比賽 digest',
          collapsed: true,
          items: scanDir('cp/contests', { titleKeys: ['contest'], sortByDate: true, short: true }),
        },
        {
          text: '技巧卡',
          collapsed: true,
          items: scanDir('cp/techniques'),
        },
        ...groupIf('弱項專題', 'cp/topics'),
        ...groupIf('LeetCode 月報', 'cp/leetcode', { sortByDate: true }),
      ],
      '/quant/': [
        {
          text: '數學學習區',
          items: [{ text: '總覽', link: '/quant/' }],
        },
        ...groupIf('機率', 'quant/probability'),
        ...groupIf('艱深題庫', 'quant/problems'),
        ...groupIf('HFT C++', 'quant/hft-cpp'),
      ],
      '/cpp/': [
        {
          text: 'C++ Modern & Low-Level',
          items: [{ text: '總覽與 checklist', link: '/cpp/' }],
        },
        ...groupIf('Modern', 'cpp/modern'),
        ...groupIf('Low-level', 'cpp/lowlevel'),
      ],
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: { tokenize: cjkTokenize },
          searchOptions: { tokenize: cjkTokenize },
        },
      },
    },
    outline: { level: [2, 3], label: '本頁目錄' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    footer: {
      message: '競程・數學・C++，持續整理。',
      copyright: '© 2026 花雪 HanaYukii',
    },
    lastUpdatedText: '最後更新',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切換淺色模式',
    darkModeSwitchTitle: '切換深色模式',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: '選單',
  },
})
