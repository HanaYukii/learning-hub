# cp-quant

比賽 digest・量化面試題庫・C++ 筆記。[VitePress](https://vitepress.dev) 建置:Markdown 撰寫、全文搜尋(中文 bigram)、MathJax 數學,push `main` 自動部署 GitHub Pages → https://hanayukii.github.io/learning-hub/

## 開發

```bash
npm install
npm run dev        # 本地預覽
npm run build      # 建置(死鏈會直接讓 build 失敗)
npm run reviewed -- <docs 相對路徑> --ok|--fail   # 複習後更新間隔(自動 commit)
```

## 結構

```
docs/
├── .vitepress/
│   ├── config.mts            # 站台設定;sidebar 由掃描目錄自動生成
│   └── lib.ts                # shortContest / toISO / cjkTokenize 共用工具
├── index.md                  # 首頁
├── cp/                       # 競程
│   ├── index.md              # 收錄原則 + digest 索引(自動)+ 技巧卡索引
│   ├── tags.md               # 技巧 tag 聚合頁(自動)
│   ├── contests/*.md         # 比賽 digest(主要單位,一場一檔)
│   ├── techniques/*.md       # 技巧卡(反覆出現的 pattern 才升級)
│   └── topics/*.md           # 弱項專題(不等比賽,主動補)
├── quant/                    # 量化面試
│   ├── index.md              # checklist + 題庫索引
│   ├── problems/*.md         # 艱深題庫(題目+技巧+答案)
│   ├── probability/*.md      # 主題 item-sheet
│   └── hft-cpp/*.md          # HFT 低延遲 C++ 軌
└── review/index.md           # 複習佇列(data loader 自動產,勿手編)
```

## 新增內容

**比賽 digest**(最常見):放一個 `docs/cp/contests/<日期>-<賽>.md`,frontmatter 填 `contest / date / tags / url / editorial / source / verified / reviewed / review_interval`——側欄、索引表、tag 索引、複習佇列全部自動掛載,不用改其他檔案。格式照 `docs/cp/contests/template.md`(每題「技巧+作法 1–2 行」;tag 只能取自 `cp/index.md` 詞彙表;難度一律 CF-equivalent)。

**技巧卡 / 量化 item**:同理,放檔即掛載。模板見各區 `template.md`。

## 慣例

- 收錄判準:各難度都收主流可遷移的;偏門不收;~2700 上限、經典模板工具破例;「不收」留痕。
- `source: hints+code` = CF 散文題解抓不到、僅據官方 Hints+code 重建;`verified: false` = 尚未人工重解核對。
- commit 不加 Co-Authored-By。
