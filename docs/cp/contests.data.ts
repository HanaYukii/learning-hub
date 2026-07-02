import { createContentLoader } from 'vitepress'
import { shortContest, toISO } from '../.vitepress/lib'

export interface ContestEntry {
  url: string
  contest: string
  short: string
  date: string
  tags: string[]
}

declare const data: ContestEntry[]
export { data }

export default createContentLoader('cp/contests/*.md', {
  transform(raw): ContestEntry[] {
    return raw
      .filter((p) => !/template|example/.test(p.url) && p.frontmatter.contest)
      .map((p) => {
        const contest = String(p.frontmatter.contest)
        return {
          url: p.url,
          contest,
          short: shortContest(contest),
          date: toISO(p.frontmatter.date),
          tags: (p.frontmatter.tags ?? []) as string[],
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
