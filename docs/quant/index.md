# 量化面試數學

> **用途**:量化/HFT 面試準備的 item 清單。主要自用、快速複習;同時公開可展示。**條列式**,密集可掃。
> 兩軌:**research/trading**(數學)、**dev**(低延遲 C++)。面試準備求**覆蓋**,標準結果也列成 checklist,但一樣精簡條列。
> 題庫每題「題目 → <small>技巧+答案(摺疊)</small>」——先自己想,再點開對答案。

## 艱深題庫(面試硬題)

答案經對抗式校對;側欄與[複習佇列](/review/)自動掛載。

| 題庫 | 涵蓋 |
| --- | --- |
| [機率 & 期望 brainteasers](/quant/problems/prob-brainteasers) | 幾何機率、等待時間、順序統計、**貝氏/條件機率、Poisson/指數**、悖論 |
| [鞅・隨機漫步・停時](/quant/problems/martingale-walk) | 賭徒破產、Conway/ABRACADABRA、反射、Pólya |
| [隨機微積分・布朗運動](/quant/problems/stochastic-calculus) | Itô、反射原理、首達、arcsine、OU |
| [馬可夫鏈・吸收](/quant/problems/markov-chains) | 基本矩陣、吸收時間、hitting/commute time |
| [組合・計數期望](/quant/problems/combinatorics) | Catalan、錯排、$H_n$、生成函數 |
| [線代・共變異數・隨機矩陣](/quant/problems/linear-algebra) | PSD、相關係數界、PCA、Marchenko–Pastur |
| [選擇權・定價數學](/quant/problems/pricing) | 複製、風險中性、BS PDE、Greeks |
| [Kelly・賭注 sizing・做市 EV](/quant/problems/betting-games) | Kelly/fractional、骰子重擲、make a market、adverse selection |
| [統計推論・回歸](/quant/problems/statistics-regression) | OLS 幾何、Gauss–Markov、三大 bias、MLE/MoM |

## 數學軌 checklist

`[x]` = 已有題庫/item-sheet 覆蓋(掌握度看[複習佇列](/review/)的間隔)。

**機率**
- [x] [鞅與選擇停時(OST)](/quant/probability/martingale-optional-stopping) + [題庫](/quant/problems/martingale-walk)
- [x] [條件機率 / 貝氏 / 三門 / 病檢偽陽](/quant/problems/prob-brainteasers)
- [x] [Poisson / 指數 / inspection paradox](/quant/problems/prob-brainteasers)
- [x] [隨機漫步、賭徒破產、首達時間](/quant/problems/martingale-walk)
- [x] [馬可夫鏈:平穩、吸收機率 / 時間](/quant/problems/markov-chains)
- [x] [順序統計量、均勻分布期望](/quant/problems/prob-brainteasers)

**統計**
- [x] [估計量 / MLE / MoM、回歸、Gauss–Markov、bias 系列](/quant/problems/statistics-regression)
- [ ] 假設檢定細節、bootstrap / 交叉驗證(待補)
- [ ] 時間序列:AR/MA、平穩性、單位根(待寫)

**隨機過程 / 定價**
- [x] [布朗運動、Itô、GBM、風險中性](/quant/problems/stochastic-calculus)
- [x] [無套利、複製、Black–Scholes、Greeks](/quant/problems/pricing)

**線代 / 最佳化 / 賽局**
- [x] [特徵值、PSD、PCA / SVD、隨機矩陣](/quant/problems/linear-algebra)
- [x] [Kelly、bet sizing、做市 EV、adverse selection](/quant/problems/betting-games)
- [ ] 凸最佳化 / KKT / Markowitz 專章(部分散在線代與定價,待整併)
- [ ] ML 數學:bias-variance、正則化=先驗、logistic(待寫)

## HFT C++ 軌

蒸餾自[部落格](https://hanayukii.dev)親身面試紀錄的 item-sheet:

- [x] [參數傳遞與 string 成本](/quant/hft-cpp/parameter-passing) — const& vs value vs string_view、SSO、NRVO、lambda/std::function
- [x] [記憶體佈局成本](/quant/hft-cpp/memory-layout-costs) — padding、vtable、shared_ptr 原子、false sharing、Order Book 選型
- [x] [手寫 inplace_vector](/quant/hft-cpp/inplace-vector) — aligned storage、placement new、Rule of Five、exception safety

**Backlog(待寫;★ = 部落格有底稿)**
- [ ] lock-free / memory ordering(acquire-release、seq_cst 成本)
- [ ] SPSC ring buffer、memory pool / 自訂 allocator
- [ ] CRTP 消 virtual ★(cpp-polymorphism)
- [ ] noexcept 與例外成本、`[[likely]]`、branch prediction
- [ ] 量測方法:rdtsc、benchmark 陷阱
- [ ] NUMA / 大頁 / cache 層級
