#!/usr/bin/env python
"""contest-digest 的抓取工具。所有 CF/AtCoder 網路存取的髒活集中在這裡。

用法:
  python tools.py cf-recent                          # 近期已結束 CF 賽(id / 日期 / 名稱)
  python tools.py cf-editorial-url <contestId>       # 盡力找該賽的 editorial blog 連結
  python tools.py cf-editorial <entryUrl> <contestId> <out.txt>
  python tools.py ac-recent                          # 近期 AtCoder 賽(slug / 日期 / 名稱)
  python tools.py ac-difficulty <slug>               # 各題 CF-equivalent 難度
  python tools.py ac-editorial <slug> <out.txt>      # AtCoder editorial(英文官方)+ 難度 → 文字檔

已知陷阱(寫死在此,不必每次重踩):
  - CF 用 curl 帶瀏覽器 UA(WebFetch 會被 Cloudflare 403)。
  - CF 散文題解在 JS spoiler(顯示「Tutorial is loading...」)靜態頁抓不到 → 只能拿 Hints + 參考 code 重建。
  - AtCoder editorial 子頁是英文官方解說,前面有導覽列雜訊,往下才是 "X - 題名 Editorial" 本文。
  - kenkoooo difficulty:低分區被指數壓縮,還原後 +400 粗估 CF-equivalent。
"""
import subprocess, json, sys, re, html, math, datetime

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def curl(url, extra=None):
    args = ["curl", "-s", "-L", "--compressed", "-A", UA, "-H", "Accept-Language: en"]
    if extra:
        args += extra
    args.append(url)
    return subprocess.run(args, capture_output=True, timeout=60).stdout.decode("utf-8", "ignore")


def strip_html(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h, flags=re.S)
    h = re.sub(r"<sup>", " ^", h)
    h = re.sub(r"<br\s*/?>", "\n", h)
    h = re.sub(r"</p>", "\n", h)
    h = re.sub(r"<li>", " - ", h)
    t = re.sub(r"<[^>]+>", " ", h)
    t = html.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n\s*\n\s*\n+", "\n\n", t)
    return t.strip()


# ---------------- Codeforces ----------------
def cf_recent():
    d = json.loads(curl("https://codeforces.com/api/contest.list?gym=false"))
    n = 0
    for c in d["result"]:
        if c.get("phase") != "FINISHED" or not c.get("startTimeSeconds"):
            continue
        dt = datetime.datetime.fromtimestamp(c["startTimeSeconds"], datetime.timezone.utc).strftime("%Y-%m-%d")
        print(f"{c['id']}\t{dt}\t{c['name']}")
        n += 1
        if n >= 15:
            break


def cf_editorial_url(contest_id):
    page = curl(f"https://codeforces.com/contest/{contest_id}")
    # 「Contest materials」側欄有 Tutorial/Editorial 連到 /blog/entry/NNNNN
    cands = re.findall(r'href="(/blog/entry/\d+)"[^>]*>([^<]*)', page)
    for href, label in cands:
        if re.search(r"tutorial|editorial|analysis|題解|解說", label, re.I):
            print("https://codeforces.com" + href)
            return
    if cands:
        print("https://codeforces.com" + cands[0][0], "  # 未確定,請核對")
        return
    print("NOT_FOUND  # 改用 WebSearch: \"Codeforces Round <N> editorial\"")


def cf_editorial(entry_url, contest_id, out):
    s = curl(entry_url)
    m = re.search(r'<div class="ttypography">(.*?)</div>\s*<div class="roundbox', s, re.S)
    body = m.group(1) if m else s
    body = re.sub(
        r'<a[^>]*href="[^"]*?/problem/([A-Z][0-9]?)"[^>]*>(.*?)</a>',
        r"\n\n===PROBLEM \1: \2===\n", body, flags=re.S,
    )
    txt = strip_html(body)
    hdr = (f"SOURCE hints+code  (CF 散文題解在 JS spoiler,僅 Hints + 參考 code)\n"
           f"EDITORIAL {entry_url}\n"
           f"PROBLEM URL https://codeforces.com/contest/{contest_id}/problem/<X>\n\n")
    open(out, "w", encoding="utf-8").write(hdr + txt)
    print(f"OK cf-editorial -> {out}  ({len(txt)} chars, {len(re.findall(r'===PROBLEM', txt))} problems)")


# ---------------- AtCoder ----------------
def ac_recent():
    s = curl("https://atcoder.jp/contests/archive?lang=en")
    rows = re.findall(r'<time[^>]*>([^<]+)</time>.*?href="/contests/([a-z0-9_\-]+)"[^>]*>([^<]+)</a>', s, re.S)
    seen = set()
    n = 0
    for t, cid, name in rows:
        if cid in seen:
            continue
        seen.add(cid)
        print(f"{cid}\t{t.strip()[:10]}\t{html.unescape(name).strip()}")
        n += 1
        if n >= 15:
            break


def _cf_equiv(diff):
    if diff is None:
        return None
    raw = diff if diff >= 400 else 400 / math.exp(1.0 - diff / 400)
    return round((raw + 400) / 100) * 100


def ac_difficulty(slug):
    models = json.loads(curl("https://kenkoooo.com/atcoder/resources/problem-models.json",
                             ["-H", "Referer: https://kenkoooo.com/atcoder/"]))
    out = {}
    for k, m in models.items():
        if k.startswith(slug + "_"):
            out[k] = _cf_equiv(m.get("difficulty"))
    for k in sorted(out):
        print(f"{k}\tCF~{out[k]}")
    return out


def ac_editorial(slug, out):
    tasks_html = curl(f"https://atcoder.jp/contests/{slug}/tasks?lang=en")
    tasks = []
    seen = set()
    for s2, name in re.findall(r'href="/contests/' + slug + r'/tasks/(' + slug + r'_[a-z0-9]+)"[^>]*>([^<]+)</a>', tasks_html):
        if s2 not in seen:
            seen.add(s2)
            tasks.append((s2, html.unescape(name).strip()))
    diff = {}
    try:
        models = json.loads(curl("https://kenkoooo.com/atcoder/resources/problem-models.json",
                                 ["-H", "Referer: https://kenkoooo.com/atcoder/"]))
        diff = {k: _cf_equiv(v.get("difficulty")) for k, v in models.items() if k.startswith(slug + "_")}
    except Exception:
        pass
    ed_html = curl(f"https://atcoder.jp/contests/{slug}/editorial?lang=en")
    subs = list(dict.fromkeys(re.findall(r'href="(/contests/' + slug + r'/editorial/\d+)"', ed_html)))
    lines = [f"SOURCE editorial  (AtCoder 英文官方解說)",
             f"EDITORIAL https://atcoder.jp/contests/{slug}/editorial",
             f"TASKS URL https://atcoder.jp/contests/{slug}/tasks/<slug>", "", "PROBLEM LIST (含 CF-equivalent 難度):"]
    for s2, name in tasks:
        lines.append(f"  {s2} : {name}   [CF~{diff.get(s2, '?')}]")
    lines.append("")
    import time
    for i, href in enumerate(subs):
        page = curl("https://atcoder.jp" + href + "?lang=en")
        mt = re.search(r"<title>([^<]+)</title>", page)
        title = html.unescape(mt.group(1)).strip() if mt else href
        m = re.search(r'<div id="main-container".*?>(.*?)<footer', page, re.S)
        content = strip_html(m.group(1)) if m else strip_html(page)
        lines.append(f"\n===EDITORIAL PAGE {i+1} | {title}===\n{content[:6000]}")
        time.sleep(0.4)
    open(out, "w", encoding="utf-8").write("\n".join(lines))
    print(f"OK ac-editorial -> {out}  ({len(tasks)} tasks, {len(subs)} editorial pages)")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    try:
        if cmd == "cf-recent":
            cf_recent()
        elif cmd == "cf-editorial-url":
            cf_editorial_url(sys.argv[2])
        elif cmd == "cf-editorial":
            cf_editorial(sys.argv[2], sys.argv[3], sys.argv[4])
        elif cmd == "ac-recent":
            ac_recent()
        elif cmd == "ac-difficulty":
            ac_difficulty(sys.argv[2])
        elif cmd == "ac-editorial":
            ac_editorial(sys.argv[2], sys.argv[3])
        else:
            print(__doc__)
            sys.exit(1)
    except subprocess.TimeoutExpired:
        print("ERROR: curl timeout(可能被限流,稍後再試)", file=sys.stderr)
        sys.exit(2)
