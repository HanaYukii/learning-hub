import { defineConfig } from 'vitepress'

// Learning Hub —— 競程技巧 × 量化面試數學 個人知識庫
// 文件: https://vitepress.dev/reference/site-config
export default defineConfig({
  // GitHub Pages 專案站:https://hanayukii.github.io/learning-hub/
  base: '/learning-hub/',
  lang: 'zh-TW',
  title: 'Learning Hub',
  description: '競程技巧 × 量化面試數學 個人知識庫',
  lastUpdated: true,
  cleanUrls: true,
  // 範例筆記裡先放了一些尚未建立的連結,先別讓 build 因 dead link 失敗
  ignoreDeadLinks: true,

  markdown: {
    math: true,        // 需要 markdown-it-mathjax3,支援 $...$ 與 $$...$$
    lineNumbers: true,
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
          ],
        },
        {
          text: '比賽 digest',
          collapsed: false,
          items: [
            { text: 'digest 模板', link: '/cp/contests/template' },
            { text: 'AtCoder ARC 223', link: '/cp/contests/2026-06-28-ac-arc223' },
            { text: 'CF Round 1105 (Div.1)', link: '/cp/contests/2026-06-27-cf-round-1105-div1' },
            { text: 'AtCoder ABC 464', link: '/cp/contests/2026-06-27-ac-abc464' },
            { text: 'CF Round 1104 (Div.1+2)', link: '/cp/contests/2026-06-18-cf-1104' },
            { text: 'AtCoder ARC 222', link: '/cp/contests/2026-06-14-ac-arc222' },
            { text: 'Edu Round 191', link: '/cp/contests/2026-06-09-cf-edu191' },
            { text: '格式範例(示意)', link: '/cp/contests/2026-07-01-example' },
          ],
        },
        {
          text: '技巧卡',
          collapsed: false,
          items: [
            { text: '技巧卡模板', link: '/cp/template' },
            { text: '線段樹維護矩陣乘積', link: '/cp/techniques/segtree-matrix-product' },
          ],
        },
      ],
      '/quant/': [
        {
          text: '量化數學',
          items: [
            { text: '總覽與 checklist', link: '/quant/' },
            { text: 'item 模板', link: '/quant/template' },
          ],
        },
        {
          text: '機率',
          collapsed: false,
          items: [
            { text: '鞅與選擇停時(OST)', link: '/quant/probability/martingale-optional-stopping' },
          ],
        },
        {
          text: '艱深題庫',
          collapsed: false,
          items: [
            { text: '機率 brainteasers', link: '/quant/problems/prob-brainteasers' },
            { text: '鞅・隨機漫步・停時', link: '/quant/problems/martingale-walk' },
            { text: '隨機微積分・布朗運動', link: '/quant/problems/stochastic-calculus' },
            { text: '馬可夫鏈・吸收', link: '/quant/problems/markov-chains' },
            { text: '組合・計數期望', link: '/quant/problems/combinatorics' },
            { text: '線代・共變異數・隨機矩陣', link: '/quant/problems/linear-algebra' },
            { text: '選擇權・定價數學', link: '/quant/problems/pricing' },
          ],
        },
      ],
    },

    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本頁目錄' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最後更新',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切換淺色模式',
    darkModeSwitchTitle: '切換深色模式',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: '選單',
    docFooterText: 'Learning Hub',
  },
})
