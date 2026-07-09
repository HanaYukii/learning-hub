---
name: contest-digest
description: 把一場 Codeforces/AtCoder 比賽整理成「題目懶人包」digest,加進 learning-hub 並部署。當使用者說「做一場 digest」「加最新一場比賽」「整理某場 CF/AtCoder」或用 /contest-digest <url|最新> 時使用。
---

# contest-digest

把一場競賽整理成**懶人包 digest**(每題「技巧 + 作法 1–2 行」),寫進 `docs/cp/contests/`,**停下來給使用者過目**,核可後才 commit + push(自動部署;側欄/索引/複習佇列/tag 頁全部自動掛載,不必手動改)。

受眾是 **CF 巔峰 IM 2347、ICPC 金牌**的使用者——只收對他有學習價值的,老套秒殺的一句話帶過或不收。

> 所有 CF/AtCoder 網路存取都走 `python .claude/skills/contest-digest/tools.py`,已把已知陷阱寫死(CF 需 curl+瀏覽器 UA 否則 403、CF 散文題解在 JS spoiler 只剩 Hints+code、AtCoder 難度查 kenkoooo)。ed.txt 這類中間檔寫到暫存路徑,別 commit。

## 步驟

### 1) 定位比賽
- 「最新一場」→ 先 `python tools.py cf-recent` 與 `ac-recent` 看清單。**挑有 2300+ 難題的賽**:CF 取 Div1 / Div1+2 / Educational(Div3、純 Div2、AtCoder 純 ABC 前段對 IM 全是熱身,通常不值得整場做);AtCoder 取 ARC / AGC / 較硬的 ABC。若使用者已給 URL / id / slug 就直接用。
- 一場 digest 一個檔;Div1+Div2 合併賽用 Div1 題號。

### 2) 抓 editorial
```
# CF
python .claude/skills/contest-digest/tools.py cf-editorial-url <contestId>          # 自動找 editorial 連結
python .claude/skills/contest-digest/tools.py cf-editorial <entryUrl> <contestId> <TMP>/ed.txt
#   若 cf-editorial-url 回 NOT_FOUND → WebSearch「Codeforces Round <N> editorial」取 blog entry 連結

# AtCoder(ed.txt 已含每題 CF-equivalent 難度)
python .claude/skills/contest-digest/tools.py ac-editorial <slug> <TMP>/ed.txt
```
Read `<TMP>/ed.txt`。**CF 只有 Hints + 參考 code**(散文題解抓不到)——據此重建思路,並在 frontmatter 標 `source: hints+code`;AtCoder 是英文官方解說,標 `source: editorial`。

### 3) 逐題「題意 + 核心作法」,套收錄判準
**每個收錄的題要先抓題面寫一行「題意」**(不可從 editorial 反推腦補):
```
python .claude/skills/contest-digest/tools.py cf-statement <contestId> <題號>   # CF
python .claude/skills/contest-digest/tools.py ac-statement <slug> <小寫題號>    # AtCoder(英文)
```
題意 = 一句話把問題講清楚(含關鍵約束/範圍)。作法 1–2 行,**2000 分選手已懂的 common sense 跳過**(不解釋前綴和/Kadane/Dijkstra 是什麼),字數留給非顯然的關鍵步。
**收錄(甜蜜區,兩端思考,難度本身不是排除理由):**
- 各難度都收(含 A/B),只要題型**主流、可遷移、學得起來**;簡單題給一句關鍵觀察即可。
- **丟**:偏門 gimmick(ad-hoc / 一次性 / 吃靈光,之後幾乎用不到)。
- 難度 **~2700 為上限**;超過的**只在經典模板工具**(HLD、ODT、線段樹分治、可回滾DSU、分治NTT、BSGS、WHT…)時破例,否則移到「不收」或只留標題。
- 「不收」的題**留痕**:`**不收**:~~題~~ → 一句原因`。

**難度**:一律 **CF-equivalent**。AtCoder 用 ed.txt 裡的 `CF~` 值。標 `~`。

**tag**:只能取自 `docs/cp/index.md` 的 **tag 詞彙表**(canonical)。要用新 tag → 先把它加進該詞彙表再用。別用同義詞(greedy→貪心、期望→機率期望、狀態壓縮→狀壓)。

正確性:作法必須有 editorial 依據,不臆測;看不懂就標「(待補)」或不收。**寧缺勿濫**。

### 4) 產草稿檔 `docs/cp/contests/<YYYY-MM-DD>-<slug>.md`
slug 例:`cf-1108-div1`、`ac-arc224`。格式嚴格照 `docs/cp/contests/template.md`:
```
---
contest: <官方全名>
date: <YYYY-MM-DD>
tags: [<場級 3–5 個代表 tag,取自詞彙表>]
url: <比賽連結>
editorial: <editorial 連結>
source: editorial | hints+code
verified: false
aside: false
reviewed: <今天>
review_interval: 14
---

# <官方全名> — 學習重點

> 懶人包:每題「題意 + 核心作法」。各難度都收主流可遷移的;偏門/太難略過。難度 `~` 為 CF-equivalent。

- **[<題號>. <題名>](<題目連結>)** `tag` `tag` `~rating`
  題意:<一句話講清楚問題,含關鍵約束>。
  作法:<1–2 行核心;寶石觀察用 **粗體**;common sense 跳過>。

**不收**:~~<題號>. <題名>~~ → <原因>。
```

### 5) 審閱閘(重要)
把草稿檔路徑 + 收/丟摘要回報給使用者,**停下來**。不要自動 commit。等使用者說 OK / 要改哪裡。

### 6) 核可後上線
```
cd <repo> && npm run build        # 死鏈 / 語法守門;綠了才推
git add docs/cp/contests/<檔>
git commit -m "digest: <比賽短名>"   # 不要加 Co-Authored-By
git push origin main               # Actions 自動部署;側欄/索引/複習佇列/tag 頁自動掛載
```
回報線上連結。若 build 抓到問題就修好再推。

## 檢查點
- [ ] 難度全 CF-equivalent、tag 全在詞彙表內
- [ ] source / verified / aside / tags frontmatter 齊全
- [ ] 「不收」有留痕、超 2700 非經典模板的已移除
- [ ] 審閱閘有停、commit 無 Co-Authored-By
