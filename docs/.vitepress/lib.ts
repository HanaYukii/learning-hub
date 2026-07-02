// 共用工具:sidebar 與 data loader 都會用到

/** 比賽全名 → 側欄/表格用短名 */
export function shortContest(name: string): string {
  let m: RegExpMatchArray | null
  if ((m = name.match(/Educational Codeforces Round (\d+)/))) return `Edu ${m[1]}`
  if ((m = name.match(/Codeforces Round (\d+)/))) {
    const div = /Div\.\s*1\s*\+\s*Div\.\s*2/.test(name)
      ? 'Div.1+2'
      : (m2 => (m2 ? `Div.${m2[1]}` : ''))(name.match(/Div\.\s*(\d)/))
    return `CF ${m[1]}${div ? ` (${div})` : ''}`
  }
  if ((m = name.match(/AtCoder Regular Contest (\d+)/))) return `ARC ${m[1]}`
  if ((m = name.match(/AtCoder Beginner Contest (\d+)/))) return `ABC ${m[1]}`
  if ((m = name.match(/AtCoder Heuristic Contest (\d+)/))) return `AHC ${m[1]}`
  return name
}

/** frontmatter 的日期(YAML 會 parse 成 Date 物件)→ 'YYYY-MM-DD' 字串,loader 輸出必須可序列化 */
export function toISO(d: unknown): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(String(d))
  return isNaN(+date) ? '' : date.toISOString().slice(0, 10)
}

/** 中文 bigram + 英數 token —— MiniSearch 預設把連續 CJK 當單一 token 只能前綴比對,句中詞搜不到 */
export function cjkTokenize(text: string): string[] {
  const tokens: string[] = []
  const re = /[A-Za-z0-9_$]+|[぀-ヿ一-鿿]+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const s = m[0]
    if (/^[A-Za-z0-9_$]/.test(s)) {
      tokens.push(s.toLowerCase())
    } else {
      if (s.length === 1) tokens.push(s)
      for (let i = 0; i + 1 < s.length; i++) tokens.push(s.slice(i, i + 2))
    }
  }
  return tokens
}
