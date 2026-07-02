import { createContentLoader } from 'vitepress'
import { shortContest } from '../.vitepress/lib'

export interface TagProblem {
  problem: string
  purl: string
  /** 出處:比賽短名或「技巧卡」 */
  from: string
  fromUrl: string
  rating: string
}
export interface TagGroup {
  tag: string
  items: TagProblem[]
}

declare const data: TagGroup[]
export { data }

// digest 題目行格式固定:- **[題名](url)** `tag` `tag` `~rating`
const LINE = /^- \*\*\[(.+?)\]\((.+?)\)\*\*((?:\s+`[^`]+`)+)\s*$/

export default createContentLoader(['cp/contests/*.md', 'cp/techniques/*.md'], {
  includeSrc: true,
  transform(raw): TagGroup[] {
    const byTag: Record<string, TagProblem[]> = {}
    const push = (tag: string, item: TagProblem) => ((byTag[tag] ??= []).push(item))

    for (const p of raw) {
      if (/template|example/.test(p.url)) continue

      if (p.url.includes('/contests/')) {
        const from = shortContest(String(p.frontmatter.contest ?? ''))
        for (const line of (p.src ?? '').split('\n')) {
          const m = line.match(LINE)
          if (!m) continue
          const [, problem, purl, tagstr] = m
          const toks = [...tagstr.matchAll(/`([^`]+)`/g)].map((x) => x[1])
          const rating = toks.find((t) => t.startsWith('~')) ?? ''
          for (const t of toks.filter((t) => !t.startsWith('~'))) {
            push(t, { problem, purl, from, fromUrl: p.url, rating })
          }
        }
      } else {
        // 技巧卡:tags 來自 frontmatter
        const title = String(p.frontmatter.title ?? p.url)
        for (const t of (p.frontmatter.tags ?? []) as string[]) {
          push(t, { problem: title, purl: p.url, from: '技巧卡', fromUrl: p.url, rating: '' })
        }
      }
    }

    return Object.entries(byTag)
      .map(([tag, items]) => ({ tag, items }))
      .sort((a, b) => b.items.length - a.items.length || a.tag.localeCompare(b.tag, 'zh-Hant'))
  },
})
