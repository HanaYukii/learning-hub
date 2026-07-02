import { defineConfig, type DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
  return items.length ? [{ text, collapsed: false, items }] : []
}

export default defineConfig({
  // GitHub Pages 專案站:https://hanayukii.github.io/learning-hub/
  base: '/learning-hub/',
  lang: 'zh-TW',
  title: 'Learning Hub',
  description: '競程技巧 × 量化面試數學 個人知識庫',
  lastUpdated: true,
  cleanUrls: true,
  // TODO(#4):修完既有死鏈後改為 false,讓 build 當守門員
  ignoreDeadLinks: true,

  markdown: {
    math: true, // markdown-it-mathjax3,支援 $...$ 與 $$...$$
    lineNumbers: false, // 模板碼是拿來抄的;個別長碼可用 ```cpp:line-numbers 局部開
  },

  themeConfig: {
    nav: [
      { text: '首頁', link: '/' },
      { text: '競程技巧', link: '/cp/' },
      { text: '量化數學', link: '/quant/' },
      { text: '複習佇列', link: '/review/' },
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
          collapsed: false,
          items: [
            { text: 'digest 模板', link: '/cp/contests/template' },
            ...scanDir('cp/contests', { titleKeys: ['contest'], sortByDate: true, short: true }),
          ],
        },
        {
          text: '技巧卡',
          collapsed: false,
          items: [{ text: '技巧卡模板', link: '/cp/template' }, ...scanDir('cp/techniques')],
        },
        ...groupIf('弱項專題', 'cp/topics'),
      ],
      '/quant/': [
        {
          text: '量化數學',
          items: [
            { text: '總覽與 checklist', link: '/quant/' },
            { text: 'item 模板', link: '/quant/template' },
          ],
        },
        ...groupIf('機率', 'quant/probability'),
        ...groupIf('艱深題庫', 'quant/problems'),
        ...groupIf('HFT C++', 'quant/hft-cpp'),
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
    lastUpdatedText: '最後更新',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切換淺色模式',
    darkModeSwitchTitle: '切換深色模式',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: '選單',
  },
})
