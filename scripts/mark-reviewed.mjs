#!/usr/bin/env node
// 複習後一鍵更新 frontmatter:
//   npm run reviewed -- cp/contests/2026-06-27-cf-round-1105-div1 --ok     (間隔加倍,封頂 60)
//   npm run reviewed -- quant/problems/prob-brainteasers --fail            (間隔砍回 3)
// 預設自動 git commit(不 push);加 --no-commit 跳過。
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const flag = args.find((a) => a === '--ok' || a === '--fail')
const noCommit = args.includes('--no-commit')
const rel = args.find((a) => !a.startsWith('--'))

if (!rel || !flag) {
  console.error('usage: npm run reviewed -- <docs 相對路徑,不含 .md> --ok|--fail [--no-commit]')
  process.exit(1)
}

const clean = rel.replace(/\\/g, '/').replace(/^docs\//, '').replace(/\.md$/, '')
const file = path.join('docs', clean + '.md')
if (!fs.existsSync(file)) {
  console.error(`找不到 ${file}`)
  process.exit(1)
}

let src = fs.readFileSync(file, 'utf-8')
if (!/^reviewed:/m.test(src) || !/^review_interval:/m.test(src)) {
  console.error(`${file} 沒有 reviewed / review_interval 欄位`)
  process.exit(1)
}

const n = new Date()
const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`
const cur = parseInt(src.match(/^review_interval:\s*(\d+)/m)[1], 10)
const next = flag === '--ok' ? Math.min(cur * 2, 60) : 3

src = src.replace(/^reviewed:.*$/m, `reviewed: ${today}`)
src = src.replace(/^review_interval:.*$/m, `review_interval: ${next}`)
fs.writeFileSync(file, src)
console.log(`${file}: reviewed=${today}, interval ${cur} → ${next}`)

if (!noCommit) {
  execSync(`git add "${file}"`, { stdio: 'inherit' })
  execSync(`git commit -m "review: ${clean} ${flag}"`, { stdio: 'inherit' })
  console.log('已 commit;記得 git push 讓線上複習佇列更新。')
}
