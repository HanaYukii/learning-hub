---
layout: home

hero:
  name: Learning Hub
  text: 競程技巧 × 量化數學
  tagline: 沒打比賽,也能快速複習、持續進步
  actions:
    - theme: brand
      text: 競程技巧庫
      link: /cp/
    - theme: alt
      text: 量化面試數學
      link: /quant/
    - theme: alt
      text: 複習佇列
      link: /review/

features:
  - icon: 🎯
    title: 觸發導向
    details: 每則技巧先寫「什麼題型會用到」,訓練 pattern recognition,而不是只抄題解。
  - icon: 🧩
    title: 可複用模板
    details: 每招都有乾淨、貼上即用的模板碼,比賽時不用重寫、不再卡細節。
  - icon: 🔁
    title: 間隔複習
    details: 用 frontmatter 記錄掌握度與複習日期,排出 review queue,定期回顧不遺忘。
  - icon: 🤝
    title: 研究 + 定稿
    details: 由 Claude 研究 editorial、抽取技巧、產生範例,你只需審閱修訂即可入庫。
---

## 這個庫怎麼用

1. **打完(或看完)一場比賽** → 把值得記的招丟給 Claude,我用 editorial / 社群題解整理成一則筆記草稿。
2. **你審閱定稿** → 確認觸發條件、模板、易錯點正確後入庫。
3. **平時複習** → 看 [複習佇列](/review/),挑「該複習」的技巧重做一題例題。

兩條主線:

- **[競程技巧庫](/cp/)** —— Codeforces / AtCoder 等比賽的高槓桿技巧,聚焦 2000 → 2400+ 的 pattern 辨識與模板。
- **[量化面試數學](/quant/)** —— 機率、統計、隨機過程、線代、定價、brainteaser,面試前快速複習。

> 範例:CP 的 [比賽 digest 格式](/cp/contests/2026-07-01-example) 與 [線段樹維護矩陣乘積](/cp/techniques/segtree-matrix-product) 技巧卡、量化的 [鞅與選擇停時](/quant/probability/martingale-optional-stopping) item-sheet。都走條列式;先看格式對不對胃口,再大量灌內容。
