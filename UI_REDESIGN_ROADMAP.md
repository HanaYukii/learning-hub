# Learning Hub UI Redesign Roadmap

> 狀態：Phase 1 已完成；Phase 2 尚未開始
> 原則：先做可逆、影響最大的改善；不改學習內容與資料邏輯。每個 Phase 都能獨立驗收、停下來 review。

## 設計方向

整體採「Hanayukii 冷色夜景品牌 × Jabiko editorial 資訊層級」：暗色優先、長時間閱讀友善，使用清楚的 surface、metadata 與主行動。首頁定位為知識索引，不是營銷 landing page 或刷題站；推薦閱讀由站主精選，不使用到期演算法。

暫定區域色：

- 競程：teal
- 數學：sky
- C++：coral
- 推薦：gold
- 家教：rose

## Phase 1 — Dark-first 基礎與首頁

### Scope

- [x] 設定暗色為預設，保留主題切換。
- [x] 建立全站色彩、字體、間距、圓角、陰影 design tokens。
- [x] 重做緊湊首頁工作台：compact masthead、推薦閱讀、學習軌、近期內容與統計摘要從首屏開始出現。
- [x] 主導覽維持內容分類，不把複習排程放在一級入口。
- [x] 統一卡片、按鈕、連結、focus 與 hover 狀態。
- [x] 完成首頁手機版。
- [x] 收合非當前側欄群組，降低歷史內容造成的導覽噪音。

### Out of scope

- 不重寫 CP、Quant、C++ 內容。
- 不刪除既有 Review 工具或改動其資料格式，但不在首頁主推。
- 不逐篇調整文章。
- 不加入粒子、MouseGlow 或大型動畫。
- 不做滿版 Hero、封面插畫或廣告式大標題。
- 不在本階段重新命名網站品牌。

### Acceptance criteria

- [x] 首次進站預設暗色，仍可切換亮色並保留偏好。
- [x] 首頁能快速說明網站用途、三條學習路線與下一步行動。
- [x] 首頁提供三篇跨領域推薦文章，不顯示到期、逾期或每日任務狀態。
- [x] 390px、768px、1440px 無水平溢位或明顯版面破壞。
- [x] 主要文字、按鈕與 focus state 達到 WCAG AA 對比。
- [x] VitePress build 通過。

## Phase 2 — 內容入口與探索體驗

### Scope

- [ ] 將推薦文章抽成可維護的 curated metadata，不依賴 Review 排程。
- [ ] 重整 CP、Quant、C++ 首頁，讓每頁先回答「現在該學什麼」。
- [ ] 建立共用 `SectionHero`、`HubCard`、`StatStrip`、`ContentIndex`、`TagList`。
- [ ] 近期內容只露出有限筆數；完整歷史放在索引。
- [ ] 長表格在手機改成卡片或可讀的 responsive layout。

### Out of scope

- 不把 spaced repetition 或每日任務變成前台主流程。
- 不新增登入、跨裝置進度或資料庫。
- 不全面整理 tag taxonomy 或重寫舊文章。

### Acceptance criteria

- [ ] 首頁、CP、Quant、C++ 都有明確推薦起點與下一步。
- [ ] 推薦文章可由內容定位調整，不受 reviewed／due 欄位影響。
- [ ] 側欄 active state 明確，非當前群組不再全部展開。
- [ ] Hub 卡片的 metadata、狀態與點擊區域一致。
- [ ] 手機不需橫向捲動即可完成主要導覽。
- [ ] VitePress build 通過。

## Phase 3 — 閱讀頁精修與全站一致性

### Scope

- [ ] 調整正文寬度、字級、行高、標題節奏與 code block 間距。
- [ ] 改善表格、callout、標籤、文章 metadata、目錄與手機閱讀體驗。
- [ ] 以明確元件／class 取代依賴 DOM 位置的樣式 selector。
- [ ] 抽查首頁、Review、三個 Hub、Digest、一般長文的一致性。
- [ ] 完成鍵盤操作、focus、對比與 reduced-motion 檢查。

### Out of scope

- 不逐篇重新設計所有歷史 Markdown。
- 不更換搜尋後端或導入 CMS。
- 不做大型動畫與高度客製視覺。

### Acceptance criteria

- [ ] 一般正文維持舒適閱讀寬度，桌機與手機都沒有過長行寬。
- [ ] inline code 不會被誤套為 tag 或難度樣式。
- [ ] 表格、程式碼、公式與 callout 在代表性文章正常顯示。
- [ ] 所有主要互動可用鍵盤操作，focus 清楚可見。
- [ ] 代表頁面在 390px、768px、1440px 完成視覺抽查。
- [ ] VitePress build 通過。

## Deferred decisions

以下項目不阻擋 Phase 1；先使用保守預設，需改變內容定位時再討論。

| 決策 | Phase 1 預設 | 何時再討論 |
| --- | --- | --- |
| 首頁密度 | 緊湊工作索引，不做大型 Hero | 已由使用者決定；若未來改站點定位才重談 |
| 亮色主題投入 | 保持可用，不追求與暗色同等細節 | Dark-first 穩定後 |
| 字體來源 | 優先系統字體，不新增外部請求 | 品牌方向穩定、需要 self-host 時 |
| 推薦文章來源 | 先由站主精選三篇，不讀取 Review 到期排序 | 需要自動輪替或 CMS 時 |
| 品牌名稱與 tagline | 沿用現有站名與定位 | Phase 1 畫面成形後 |
| C++ 資訊架構 | 暫不搬動 `/quant/hft-cpp/` | Phase 2 重整入口時 |

## Phase log

### Phase 1

- Status：complete
- Started：2026-07-21
- Completed：2026-07-21
- Decision：首頁不是營銷站；採 compact working index，不做大封面（2026-07-21）
- Correction：知識庫不是刷題站；首頁以站主精選文章取代今日複習與到期狀態（2026-07-21）
- Files：
  - docs/.vitepress/config.mts
  - docs/.vitepress/theme/index.ts
  - docs/.vitepress/theme/tokens.css
  - docs/.vitepress/theme/components/HomeDashboard.vue
  - docs/index.md
  - UI_REDESIGN_ROADMAP.md
- Verification：
  - npm run build 通過（VitePress 1.6.4，177.85s）。
  - Browser 抽查 390px、768px、1440px，皆無水平溢位。
  - 暗色預設、亮暗切換與重新整理後偏好保留皆通過。
  - 小字最低對比修正為 light text-3 4.60:1、light feature 4.76:1；品牌按鈕與主要文字高於 AA。
  - Browser console 無 warning／error。
- Follow-ups：
  - Phase 2 再整理推薦閱讀、CP、Quant、C++ 入口與共用元件。
  - Build 仍有既有的 chunk-size warning；不阻擋本階段，後續若需效能優化再拆分。
