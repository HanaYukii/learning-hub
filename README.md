# Learning Hub

競程技巧 × 量化面試數學 的個人知識庫。用 [VitePress](https://vitepress.dev) 建置:Markdown 撰寫、全文搜尋、KaTeX 數學、可一鍵發布到 GitHub Pages。

## 開發

```bash
npm install        # 安裝依賴
npm run dev        # 本地預覽 http://localhost:5173
npm run build      # 產生靜態站到 docs/.vitepress/dist
npm run preview    # 預覽 build 結果
```

## 結構

```
docs/
├── .vitepress/config.mts     # 站台設定(nav / sidebar / 搜尋 / 數學)
├── index.md                  # 首頁
├── cp/                       # 競程技巧庫
│   ├── index.md              # 總覽 + 技巧分類骨架 + 索引
│   ├── template.md           # 筆記模板
│   └── techniques/*.md       # 一招一檔
├── quant/                    # 量化面試數學
│   ├── index.md              # 總覽 + 主題分類骨架 + 索引
│   ├── template.md           # 筆記模板
│   └── <分類>/*.md           # 一主題一檔
└── review/index.md           # 間隔複習佇列
```

## 新增一則筆記

1. 複製對應的 `template.md` 到目標資料夾,改檔名為 `<slug>.md`。
2. 填好 frontmatter(尤其 `trigger` / `reviewed` / `review_interval` / `mastery`)。
3. 到 `docs/.vitepress/config.mts` 的 sidebar 掛上連結。
4. 更新對應 `index.md` 的索引表。

## 工作流

打完一場比賽 → 把值得記的招交給 Claude → 由 Claude 研究 editorial / 題解產生草稿 → 你審閱定稿入庫 → 平時看 `review/` 複習。
