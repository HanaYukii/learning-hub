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

// digest 題目行支援兩種格式:
//   舊:- **[題名](url)** `tag` `tag` `~rating`
//   新:### [題名](url) 後跟一行純 `tag` chips
const LINE = /^- \*\*\[(.+?)\]\((.+?)\)\*\*((?:\s+`[^`]+`)+)\s*$/
const HEAD = /^###\s+\[(.+?)\]\((.+?)\)\s*(?:\{.*\})?\s*$/
const TAGLINE = /^(?:\s*`[^`]+`)+\s*$/

export default createContentLoader(['cp/contests/*.md', 'cp/techniques/*.md', 'cp/topics/*.md'], {
  includeSrc: true,
  transform(raw): TagGroup[] {
    const byTag: Record<string, TagProblem[]> = {}
    const push = (tag: string, item: TagProblem) => ((byTag[tag] ??= []).push(item))

    for (const p of raw) {
      if (/template|example/.test(p.url)) continue

      if (p.url.includes('/contests/') || p.url.includes('/topics/')) {
        const from = p.url.includes('/topics/')
          ? '弱項專題'
          : shortContest(String(p.frontmatter.contest ?? ''))
        const lines = (p.src ?? '').split('\n')
        const emit = (problem: string, purl: string, tagstr: string) => {
          const toks = [...tagstr.matchAll(/`([^`]+)`/g)].map((x) => x[1])
          const rating = toks.find((t) => t.startsWith('~')) ?? ''
          for (const t of toks.filter((t) => !t.startsWith('~'))) {
            push(t, { problem, purl, from, fromUrl: p.url, rating })
          }
        }
        for (let i = 0; i < lines.length; i++) {
          const m = lines[i].match(LINE)
          if (m) {
            emit(m[1], m[2], m[3])
            continue
          }
          const h = lines[i].match(HEAD)
          if (h) {
            // 新格式:標題行下一個非空行若是純 tag chips 就取用
            let j = i + 1
            while (j < lines.length && !lines[j].trim()) j++
            if (j < lines.length && TAGLINE.test(lines[j])) emit(h[1], h[2], lines[j])
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
