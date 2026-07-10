import { createContentLoader } from 'vitepress'
import { toISO } from '../.vitepress/lib'

export interface ReviewItem {
  url: string
  title: string
  section: 'CP' | 'Quant' | 'C++'
  reviewed: string
  interval: number
  due: string
  /** 比賽日期(僅 digest 有),供「最近 digest 快掃」用 */
  date: string
  /** AI 產出是否已人工重解核對(僅 digest/專題有此欄) */
  verified: boolean | null
  kind: 'digest' | 'topic' | 'note'
}

declare const data: ReviewItem[]
export { data }

/** url 雜湊 → 穩定的 ±3 天 jitter,打散批次初始化造成的同日「到期潮」 */
function jitter(s: string): number {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return (h % 7) - 3
}

export default createContentLoader(['cp/**/*.md', 'quant/**/*.md', 'cpp/**/*.md'], {
  transform(raw): ReviewItem[] {
    return raw
      .filter((p) => p.frontmatter.reviewed && !/template|example/.test(p.url))
      .map((p) => {
        const reviewed = toISO(p.frontmatter.reviewed)
        const interval = Number(p.frontmatter.review_interval ?? 14)
        const due = new Date(new Date(reviewed).getTime() + (interval + jitter(p.url)) * 86400000)
        return {
          url: p.url,
          title: String(p.frontmatter.title ?? p.frontmatter.contest ?? p.url),
          section: (p.url.startsWith('/cp/') ? 'CP' : p.url.startsWith('/cpp/') ? 'C++' : 'Quant') as
            | 'CP'
            | 'Quant'
            | 'C++',
          reviewed,
          interval,
          due: due.toISOString().slice(0, 10),
          date: toISO(p.frontmatter.date),
          verified: typeof p.frontmatter.verified === 'boolean' ? p.frontmatter.verified : null,
          kind: (p.url.includes('/contests/') ? 'digest' : p.url.includes('/topics/') ? 'topic' : 'note') as
            | 'digest'
            | 'topic'
            | 'note',
        }
      })
      .sort((a, b) => a.due.localeCompare(b.due))
  },
})
