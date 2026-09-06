#!/usr/bin/env python3
"""LeetCode 月報的抓取 / 組裝工具(重建自舊機器上的 assemble_lc.py;所有 LeetCode 網路存取集中在此)。

用法:
  python3 lc_tools.py lc-recent                       # 近期比賽(slug / 日期 UTC+8 / 名稱)
  python3 lc_tools.py lc-contest <contestSlug>        # 該場 Q1–Q4:題名 / slug / zerotrac rating
  python3 lc_tools.py lc-month <YYYY-MM>              # 該月所有場次 + 四題 + rating(月報骨架用)
  python3 lc_tools.py lc-statement <titleSlug>        # 題面(去 HTML 純文字,含 Examples / Constraints)
  python3 lc_tools.py lc-dump <YYYY-MM> <outdir>      # 該月每場 Q3/Q4 題面各存一檔(寫月報前先讀)
  python3 lc_tools.py lc-format <file.md>             # 對 md 內 ```cpp 區塊套 clang-format(乾淨可讀風格)

已知陷阱(寫死在此,不必每次重踩):
  - leetcode.com / leetcode.cn 的 HTML 頁與 /contest/api/info/ 都被 Cloudflare 擋(curl 拿到 "Just a moment");
    但 https://leetcode.com/graphql 帶瀏覽器 UA 可直接 POST,contest(titleSlug) / pastContests / question(titleSlug) 都拿得到。
  - 難度用 zerotrac rating(https://zerotrac.github.io/leetcode_problem_rating/data.json),標 `LC~NNNN`;
    新場次 zerotrac 尚未收錄 → 標 `LC~est` 自估。
  - 比賽日期用 UTC+8(Weekly 週日 10:30、Biweekly 週六 22:30),月報依此分月。
  - clang-format 不一定在 PATH:macOS 有 CommandLineTools 版,見 CLANG_FORMAT 候選路徑。
"""
import datetime
import html
import json
import os
import re
import shutil
import subprocess
import sys

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
GQL = "https://leetcode.com/graphql"
ZEROTRAC = "https://zerotrac.github.io/leetcode_problem_rating/data.json"
TZ8 = datetime.timezone(datetime.timedelta(hours=8))
CLANG_FORMAT_CANDIDATES = [
    shutil.which("clang-format") or "",
    "/Library/Developer/CommandLineTools/usr/bin/clang-format",
    "/opt/homebrew/opt/llvm/bin/clang-format",
    "/usr/local/bin/clang-format",
]
CLANG_STYLE = "{BasedOnStyle: Google, IndentWidth: 4, ColumnLimit: 0, SpacesBeforeTrailingComments: 2}"


def curl(url, data=None, extra=None):
    args = ["curl", "-s", "-L", "--compressed", "-A", UA, "-H", "Accept-Language: en"]
    if data is not None:
        args += ["-H", "Content-Type: application/json", "-H", "Referer: https://leetcode.com/contest/",
                 "-X", "POST", "-d", json.dumps(data)]
    if extra:
        args += extra
    args.append(url)
    return subprocess.run(args, capture_output=True, timeout=60).stdout.decode("utf-8", "ignore")


def gql(query, variables=None):
    out = curl(GQL, {"query": query, "variables": variables or {}})
    try:
        d = json.loads(out)
    except json.JSONDecodeError:
        sys.exit("ERROR: GraphQL 回應不是 JSON(可能被 Cloudflare 擋):\n" + out[:300])
    if "errors" in d:
        sys.exit("ERROR: GraphQL errors: " + json.dumps(d["errors"])[:500])
    return d["data"]


def strip_html(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h, flags=re.S)
    h = re.sub(r"<sup>(.*?)</sup>", r"^\1", h, flags=re.S)
    h = re.sub(r"<sub>(.*?)</sub>", r"_\1", h, flags=re.S)
    h = re.sub(r"<br\s*/?>", "\n", h)
    h = re.sub(r"</p>|</div>|</li>|</pre>", "\n", h)
    h = re.sub(r"<li>", " - ", h)
    h = re.sub(r"<strong[^>]*>(.*?)</strong>", r"\1", h, flags=re.S)
    t = re.sub(r"<[^>]+>", "", h)
    t = html.unescape(t).replace("\xa0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n[ \t]+", "\n", t)
    t = re.sub(r"\n\s*\n\s*\n+", "\n\n", t)
    return t.strip()


# ---------------- zerotrac ratings ----------------
_ratings = None


def ratings():
    """titleSlug -> (rating, contestSlug, problemIndex)。快取在 ~/.cache/lc_zerotrac.json(一天內重用)。"""
    global _ratings
    if _ratings is not None:
        return _ratings
    cache = os.path.expanduser("~/.cache/lc_zerotrac.json")
    fresh = os.path.exists(cache) and (datetime.datetime.now().timestamp() - os.path.getmtime(cache) < 86400)
    if fresh:
        raw = open(cache, encoding="utf-8").read()
    else:
        raw = curl(ZEROTRAC)
        try:
            json.loads(raw)
            os.makedirs(os.path.dirname(cache), exist_ok=True)
            open(cache, "w", encoding="utf-8").write(raw)
        except json.JSONDecodeError:
            raw = open(cache, encoding="utf-8").read() if os.path.exists(cache) else "[]"
    _ratings = {x["TitleSlug"]: (round(x["Rating"]), x["ContestSlug"], x["ProblemIndex"]) for x in json.loads(raw)}
    return _ratings


def rating_tag(slug):
    r = ratings().get(slug)
    return f"LC~{r[0]}" if r else "LC~est"


# ---------------- contests ----------------
def past_contests(pages=2, per=12):
    out = []
    for p in range(1, pages + 1):
        d = gql("query($p:Int!,$n:Int!){ pastContests(pageNo:$p, numPerPage:$n){ data{ title titleSlug startTime } } }",
                {"p": p, "n": per})
        out += d["pastContests"]["data"]
    return out


def contest_date(ts):
    return datetime.datetime.fromtimestamp(ts, TZ8).strftime("%Y-%m-%d")


def lc_recent():
    for c in past_contests(pages=1, per=15):
        print(f"{c['titleSlug']}\t{contest_date(c['startTime'])}\t{c['title']}")


def contest_questions(slug):
    d = gql("query($s:String!){ contest(titleSlug:$s){ title startTime questions{ title titleSlug credit } } }",
            {"s": slug})
    return d["contest"]


def lc_contest(slug):
    c = contest_questions(slug)
    print(f"{c['title']}  ·  {contest_date(c['startTime'])}")
    for i, q in enumerate(c["questions"], 1):
        print(f"  Q{i}\t{rating_tag(q['titleSlug'])}\t{q['title']}\t[{q['titleSlug']}]")


def month_contests(ym):
    """該月(UTC+8)的比賽,舊→新。往回翻 pastContests 直到日期早於該月。"""
    res = []
    for c in past_contests(pages=6, per=12):
        d = contest_date(c["startTime"])
        if d.startswith(ym):
            res.append(c)
        elif d < ym:
            break
    return sorted(res, key=lambda c: c["startTime"])


def short_name(title):
    m = re.match(r"(Weekly|Biweekly) Contest (\d+)", title)
    return f"{m.group(1)} {m.group(2)}" if m else title


def lc_month(ym):
    for c in month_contests(ym):
        cq = contest_questions(c["titleSlug"])
        print(f"## {short_name(c['title'])} · {contest_date(c['startTime'])}   [{c['titleSlug']}]")
        for i, q in enumerate(cq["questions"], 1):
            print(f"  Q{i}\t{rating_tag(q['titleSlug'])}\t{q['title']}\t[{q['titleSlug']}]")


# ---------------- statements ----------------
def question(slug):
    d = gql("query($s:String!){ question(titleSlug:$s){ questionFrontendId title difficulty content "
            "exampleTestcases hints topicTags{ name } } }", {"s": slug})
    return d["question"]


def statement_text(slug):
    q = question(slug)
    if not q:
        return f"NOT_FOUND {slug}"
    body = strip_html(q["content"] or "")
    tags = ", ".join(t["name"] for t in q.get("topicTags") or [])
    hints = "\n".join(f"  - {strip_html(h)}" for h in (q.get("hints") or []))
    return (f"#{q['questionFrontendId']} {q['title']}  ({q['difficulty']})  {rating_tag(slug)}\n"
            f"URL https://leetcode.com/problems/{slug}/\n"
            f"TOPIC TAGS(官方,僅參考;digest tag 仍須取自 cp/index.md 詞彙表): {tags}\n\n"
            f"{body}\n\n"
            f"EXAMPLE TESTCASES (raw input lines)\n{q.get('exampleTestcases') or ''}\n"
            + (f"\nHINTS(官方)\n{hints}\n" if hints else ""))


def lc_statement(slug):
    sys.stdout.reconfigure(encoding="utf-8")
    print(statement_text(slug))


def lc_dump(ym, outdir):
    os.makedirs(outdir, exist_ok=True)
    idx = []
    for c in month_contests(ym):
        cq = contest_questions(c["titleSlug"])
        date = contest_date(c["startTime"])
        for i, q in enumerate(cq["questions"], 1):
            line = f"{short_name(c['title'])} · {date} · Q{i} {rating_tag(q['titleSlug'])} {q['title']} [{q['titleSlug']}]"
            idx.append(line)
            if i >= 3:  # 月報只看 Q3/Q4
                fn = os.path.join(outdir, f"{date}-{c['titleSlug']}-q{i}.txt")
                open(fn, "w", encoding="utf-8").write(line + "\n\n" + statement_text(q["titleSlug"]))
    open(os.path.join(outdir, "INDEX.txt"), "w", encoding="utf-8").write("\n".join(idx) + "\n")
    print("\n".join(idx))
    print(f"\nOK lc-dump -> {outdir}/ ({len(idx)} problems listed, Q3/Q4 statements saved)")


# ---------------- formatting ----------------
def clang_format_bin():
    for c in CLANG_FORMAT_CANDIDATES:
        if c and os.path.exists(c):
            return c
    return None


def lc_format(path):
    """對 markdown 內每個 ```cpp 區塊套 clang-format;失敗的區塊原樣保留。"""
    cf = clang_format_bin()
    if not cf:
        sys.exit("ERROR: 找不到 clang-format(brew install clang-format 或用 CommandLineTools 版)")
    src = open(path, encoding="utf-8").read()
    n = 0

    def fmt(m):
        nonlocal n
        code = m.group(2)
        r = subprocess.run([cf, f"--style={CLANG_STYLE}"], input=code.encode(), capture_output=True)
        if r.returncode != 0:
            return m.group(0)
        n += 1
        out = r.stdout.decode()
        if not out.endswith("\n"):
            out += "\n"
        return m.group(1) + out + m.group(3)

    new = re.sub(r"(```cpp[^\n]*\n)(.*?)(```)", fmt, src, flags=re.S)
    if new != src:
        open(path, "w", encoding="utf-8").write(new)
    print(f"OK lc-format: {n} cpp blocks formatted in {path}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    try:
        if cmd == "lc-recent":
            lc_recent()
        elif cmd == "lc-contest":
            lc_contest(sys.argv[2])
        elif cmd == "lc-month":
            lc_month(sys.argv[2])
        elif cmd == "lc-statement":
            lc_statement(sys.argv[2])
        elif cmd == "lc-dump":
            lc_dump(sys.argv[2], sys.argv[3])
        elif cmd == "lc-format":
            lc_format(sys.argv[2])
        else:
            print(__doc__)
            sys.exit(1)
    except subprocess.TimeoutExpired:
        print("ERROR: curl timeout(可能被限流,稍後再試)", file=sys.stderr)
        sys.exit(2)
