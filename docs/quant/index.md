# 量化面試數學

> **用途**:量化/HFT 面試準備的 item 清單。主要自用、快速複習;同時公開可展示。**條列式**,密集可掃。
> 兩軌:**research/trading**(數學)、**dev**(低延遲 C++)。與 CP 不同:面試準備求**覆蓋**,標準結果也值得列成 checklist,但一樣精簡條列、不寫長篇。

## 結構

- 數學軌:`probability/` `statistics/` `stochastic/` `linalg/` `optimization/` `pricing/` `brainteaser/`
- C++ 軌:`hft-cpp/`(低延遲)

每主題一張 item-sheet([模板](/quant/template)):條列「核心結果 / 經典題答案 / 易錯」。

## 數學軌 checklist

**機率**
- [x] [鞅與選擇停時(OST)](/quant/probability/martingale-optional-stopping)
- [ ] 條件機率 / 貝氏 / 三門 / 病檢偽陽
- [ ] 期望線性、indicator、tail-sum $E[X]=\sum_{k\ge1}P(X\ge k)$
- [ ] 隨機漫步、賭徒破產、首達時間
- [ ] 馬可夫鏈:平穩分布、吸收機率 / 時間
- [ ] 順序統計量、均勻分布期望

**統計**
- [ ] 估計量(不偏 / 一致 / MLE / MoM)、變異數共變異數
- [ ] 線性回歸、最小平方、Gauss–Markov
- [ ] 假設檢定 / 信賴區間 / p-value 直覺

**隨機過程**
- [ ] 布朗運動、二次變差、Itô、GBM、風險中性測度

**線代 / 最佳化 / 定價**
- [ ] 特徵值、正定、PCA / SVD
- [ ] 凸性、Jensen、Lagrange / KKT、均值-變異數
- [ ] 無套利、複製、Black–Scholes、Greeks

## HFT C++ 軌 checklist

- [ ] 參數傳遞:`const&` vs value vs `string_view`;SSO 下何時 copy 反而快
- [ ] lambda 捕獲成本、`std::function` 型別抹除開銷
- [ ] Order Book 資料結構選型、cache locality
- [ ] 手寫 inplace_vector:aligned storage / placement new / Rule of Five
- [ ] padding / 對齊、vtable、`shared_ptr` 原子開銷
- [ ] false sharing、branch prediction、`[[likely]]` / `[[unlikely]]`

> C++ 軌大多 [部落格](https://hanayukii.dev) 已有文,可直接蒸餾成卡。

## 索引

| 主題 | 軌 | 掌握度 |
| --- | --- | --- |
| [鞅與選擇停時](/quant/probability/martingale-optional-stopping) | 機率 | learning |
