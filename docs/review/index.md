# 複習佇列

「沒打比賽也能複習」靠的就是這頁。每則筆記的 frontmatter 都帶了三個欄位:

```yaml
reviewed: 2026-07-01      # 上次複習日期
review_interval: 7        # 建議幾天後再複習
mastery: learning         # learning | familiar | mastered
```

## 目前的複習流程(手動版)

1. 看下表「該複習」的項目(`reviewed + review_interval < 今天`)。
2. **不要只看筆記** —— 打開它的一道例題,蓋住模板,重做一遍。
3. 順手更新該筆記的 `reviewed` 日期,並按手感調整:
   - 一次就過 → `mastery` 升級、`review_interval` 加倍(7 → 14 → 30)。
   - 卡住 / 忘了 → `review_interval` 砍回 3~5 天,`mastery` 降回 `learning`。

> 建議間隔節奏(類 SM-2):`1d → 3d → 7d → 14d → 30d → 60d`,忘了就退回前一階。

## 待複習(範例)

| 筆記 | 上次複習 | 間隔 | 下次到期 | 掌握度 |
| --- | --- | --- | --- | --- |
| [DSU on Tree](/cp/techniques/dsu-on-tree) | 2026-07-01 | 7d | 2026-07-08 | learning |
| [鞅與選擇停時定理](/quant/probability/martingale-optional-stopping) | 2026-07-01 | 10d | 2026-07-11 | learning |

## 之後可自動化

這張表現在手動維護。下一步可以寫一個 VitePress 的 [data loader](https://vitepress.dev/guide/data-loading),掃描所有筆記的 frontmatter,**自動**產生「今天該複習」清單並依到期日排序——到時候這頁就會自己更新。要做的時候跟我說。
