<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as contests } from '../../../cp/contests.data'
import { data as reviewItems } from '../../../review/review.data'
import type { ContestEntry } from '../../../cp/contests.data'
import type { ReviewItem } from '../../../review/review.data'

interface Track {
  title: string
  label: string
  mark: string
  detail: string
  link: string
  action: string
  tone: 'cp' | 'quant' | 'cpp'
}

const today = ref('')

onMounted(() => {
  const now = new Date()
  today.value =
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0')
})

const reviewCards: ReviewItem[] = reviewItems.slice(0, 3)
const recentItems: ContestEntry[] = contests.slice(0, 3)
const indexedTags = new Set(contests.flatMap((item) => item.tags)).size

const stats = [
  { value: reviewItems.length, label: '可排程筆記' },
  { value: contests.length, label: '比賽／月報' },
  { value: indexedTags, label: '已索引 tags' },
  { value: 3, label: '學習路線' },
]

const tracks: Track[] = [
  {
    title: '競程技巧庫',
    label: 'Competitive Programming',
    mark: 'CP',
    detail: '比賽 digest、技巧卡、弱項專題與 LeetCode 月報。',
    link: '/cp/',
    action: '進入競程',
    tone: 'cp',
  },
  {
    title: '數學學習區',
    label: 'Quant & Mathematics',
    mark: 'Σ',
    detail: '機率、隨機過程、線性代數、定價與面試題庫。',
    link: '/quant/',
    action: '開始練習',
    tone: 'quant',
  },
  {
    title: 'C++ 知識庫',
    label: 'Modern & Low-level',
    mark: 'C++',
    detail: 'Modern C++、底層知識與 HFT 面試考點。',
    link: '/cpp/',
    action: '查看 C++',
    tone: 'cpp',
  },
]

const overdueCount = computed(() =>
  today.value ? reviewItems.filter((item) => item.due <= today.value).length : 0,
)

function dueLabel(item: ReviewItem): string {
  if (!today.value) return '到期 ' + item.due
  if (item.due < today.value) return '已到期'
  if (item.due === today.value) return '今天到期'
  return '預計 ' + item.due.slice(5).replace('-', '/')
}
</script>

<template>
  <main class="hub-dashboard" aria-labelledby="hub-title">
    <header class="hub-dashboard-header">
      <div class="hub-heading">
        <p class="hub-kicker">HanaYukii / Learning Hub</p>
        <h1 id="hub-title">花雪的競程筆記訓練場</h1>
        <p class="hub-intro">
          競程比賽、面試數學與 C++ 的工作筆記。直接找一條路線開始，或從今天到期的內容複習。
        </p>
      </div>

      <nav class="hub-shortcuts" aria-label="首頁快速入口">
        <a class="hub-button is-primary" :href="withBase('/review/')">開始今日複習</a>
        <a class="hub-button" :href="withBase('/cp/tags')">技巧索引</a>
      </nav>
    </header>

    <dl class="hub-stats" aria-label="網站內容統計">
      <div v-for="stat in stats" :key="stat.label" class="hub-stat">
        <dd>{{ stat.value }}</dd>
        <dt>{{ stat.label }}</dt>
      </div>
    </dl>

    <div class="hub-main-grid">
      <section class="hub-panel hub-review-panel" aria-labelledby="review-heading">
        <div class="hub-panel-heading">
          <div>
            <p class="hub-section-label is-review">Next up</p>
            <h2 id="review-heading">今日複習</h2>
          </div>
          <span class="hub-status">
            {{ today ? overdueCount + ' 項已到期' : '依到期日排序' }}
          </span>
        </div>

        <p class="hub-panel-copy">先處理最接近到期的三筆，不用再從完整索引裡挑。</p>

        <ol v-if="reviewCards.length" class="hub-review-list">
          <li v-for="item in reviewCards" :key="item.url">
            <a :href="withBase(item.url)">
              <span class="hub-review-section">{{ item.section }}</span>
              <strong>{{ item.title }}</strong>
              <span class="hub-review-due">{{ dueLabel(item) }}</span>
            </a>
          </li>
        </ol>
        <p v-else class="hub-empty">目前沒有排程中的複習項目。</p>

        <a class="hub-inline-link is-review" :href="withBase('/review/')">
          查看完整複習佇列 <span aria-hidden="true">→</span>
        </a>
      </section>

      <section class="hub-tracks-section" aria-labelledby="tracks-heading">
        <div class="hub-section-heading">
          <div>
            <p class="hub-section-label">Browse</p>
            <h2 id="tracks-heading">學習入口</h2>
          </div>
          <p>內容保留文件式結構，入口只負責帶你到正確的地方。</p>
        </div>

        <div class="hub-tracks">
          <a
            v-for="track in tracks"
            :key="track.title"
            :href="withBase(track.link)"
            class="hub-track"
            :class="'is-' + track.tone"
          >
            <span class="hub-track-mark" aria-hidden="true">{{ track.mark }}</span>
            <span class="hub-track-body">
              <span class="hub-track-label">{{ track.label }}</span>
              <strong>{{ track.title }}</strong>
              <span class="hub-track-detail">{{ track.detail }}</span>
              <span class="hub-track-action">{{ track.action }} <span aria-hidden="true">→</span></span>
            </span>
          </a>
        </div>
      </section>
    </div>

    <section class="hub-latest" aria-labelledby="latest-heading">
      <div class="hub-section-heading">
        <div>
          <p class="hub-section-label">Recently filed</p>
          <h2 id="latest-heading">最新收錄</h2>
        </div>
        <a class="hub-inline-link" :href="withBase('/cp/')">完整競程索引 →</a>
      </div>

      <div v-if="recentItems.length" class="hub-latest-list">
        <a v-for="item in recentItems" :key="item.url" :href="withBase(item.url)" class="hub-latest-item">
          <time :datetime="item.date">{{ item.date }}</time>
          <strong>{{ item.short }}</strong>
          <span class="hub-latest-tags">
            <span v-for="tag in item.tags.slice(0, 3)" :key="tag">{{ tag }}</span>
          </span>
          <span class="hub-latest-arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <p v-else class="hub-empty">目前沒有最近收錄的內容。</p>
    </section>

    <nav class="hub-utility-links" aria-label="其他入口">
      <a :href="withBase('/tutoring')">家教／培訓</a>
      <a href="https://hanayukii.dev">技術部落格</a>
      <a :href="withBase('/about')">關於花雪</a>
      <span>ICPC 區域賽金牌 · 前 Google 工程師 · 演算法海牛核心團隊</span>
    </nav>
  </main>
</template>

<style scoped>
.hub-dashboard {
  width: min(100%, 1248px);
  margin: 0 auto;
  padding: 38px clamp(20px, 4vw, 36px) 72px;
  color: var(--vp-c-text-1);
}

.hub-dashboard * {
  box-sizing: border-box;
}

.hub-dashboard-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 28px;
}

.hub-heading {
  min-width: 0;
}

.hub-kicker,
.hub-section-label,
.hub-track-label {
  margin: 0;
  font-family: var(--lh-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.hub-kicker {
  color: var(--vp-c-brand-1);
  font-size: 0.72rem;
  font-weight: 700;
}

.hub-heading h1 {
  margin: 8px 0 0;
  max-width: 780px;
  font-family: var(--lh-font-display);
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.12;
  letter-spacing: -0.035em;
}

.hub-intro {
  max-width: 740px;
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.7;
}

.hub-shortcuts {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.hub-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 1px solid var(--lh-border);
  border-radius: 10px;
  background: var(--lh-surface);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.hub-button:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--lh-surface-hover);
}

.hub-button.is-primary {
  border-color: transparent;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.hub-button.is-primary:hover {
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}

.hub-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 28px 0 0;
  border-block: 1px solid var(--vp-c-divider);
}

.hub-stat {
  min-width: 0;
  padding: 15px 18px;
}

.hub-stat + .hub-stat {
  border-left: 1px solid var(--vp-c-divider);
}

.hub-stat dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: var(--lh-font-mono);
  font-size: 1.18rem;
  font-weight: 700;
}

.hub-stat dt {
  margin-top: 3px;
  color: var(--vp-c-text-3);
  font-size: 0.78rem;
}

.hub-main-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.7fr);
  gap: 24px;
  align-items: start;
  margin-top: 28px;
}

.hub-panel,
.hub-track,
.hub-latest-list {
  border: 1px solid var(--lh-border);
  background: var(--lh-surface);
}

.hub-panel {
  min-width: 0;
  border-radius: 14px;
  padding: 20px;
}

.hub-panel-heading,
.hub-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
}

.hub-panel-heading h2,
.hub-section-heading h2 {
  margin: 4px 0 0;
  font-family: var(--lh-font-display);
  font-size: 1.45rem;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.hub-section-label {
  color: var(--vp-c-brand-1);
  font-size: 0.68rem;
  font-weight: 700;
}

.hub-section-label.is-review {
  color: var(--lh-review);
}

.hub-status {
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--lh-review) 42%, var(--lh-border));
  border-radius: 999px;
  padding: 4px 9px;
  background: color-mix(in srgb, var(--lh-review) 11%, transparent);
  color: var(--lh-review);
  font-size: 0.72rem;
  font-weight: 700;
}

.hub-panel-copy,
.hub-section-heading > p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.hub-panel-copy {
  margin: 14px 0 0;
  font-size: 0.86rem;
}

.hub-section-heading > p {
  max-width: 330px;
  margin: 0;
  text-align: right;
  font-size: 0.82rem;
}

.hub-review-list {
  display: grid;
  gap: 8px;
  margin: 16px 0 18px;
  padding: 0;
  list-style: none;
}

.hub-review-list a {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 4px 10px;
  min-height: 58px;
  align-items: center;
  padding: 9px 10px;
  border-radius: 9px;
  color: inherit;
  text-decoration: none;
}

.hub-review-list a:hover {
  background: var(--lh-surface-hover);
}

.hub-review-section {
  grid-row: 1 / 3;
  min-width: 38px;
  color: var(--lh-review);
  font-family: var(--lh-font-mono);
  font-size: 0.7rem;
  font-weight: 700;
}

.hub-review-list strong {
  min-width: 0;
  overflow: hidden;
  font-size: 0.86rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-review-due {
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
}

.hub-inline-link {
  color: var(--vp-c-brand-1);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
}

.hub-inline-link.is-review {
  color: var(--lh-review);
}

.hub-tracks-section {
  min-width: 0;
}

.hub-tracks {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.hub-track {
  --track-color: var(--vp-c-brand-1);
  display: flex;
  min-width: 0;
  min-height: 220px;
  flex-direction: column;
  gap: 18px;
  justify-content: space-between;
  border-radius: 14px;
  padding: 17px;
  color: inherit;
  text-decoration: none;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.hub-track.is-cp {
  --track-color: var(--lh-cp);
}

.hub-track.is-quant {
  --track-color: var(--lh-quant);
}

.hub-track.is-cpp {
  --track-color: var(--lh-cpp);
}

.hub-track:hover {
  border-color: color-mix(in srgb, var(--track-color) 64%, var(--lh-border));
  background: var(--lh-surface-hover);
}

.hub-track-mark {
  display: inline-flex;
  width: fit-content;
  min-width: 42px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--track-color) 40%, var(--lh-border));
  border-radius: 8px;
  padding: 0 8px;
  background: color-mix(in srgb, var(--track-color) 10%, transparent);
  color: var(--track-color);
  font-family: var(--lh-font-mono);
  font-size: 0.76rem;
  font-weight: 800;
}

.hub-track-body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.hub-track-label {
  color: var(--track-color);
  font-size: 0.58rem;
  font-weight: 700;
}

.hub-track-body strong {
  margin-top: 7px;
  font-family: var(--lh-font-display);
  font-size: 1.14rem;
  line-height: 1.25;
}

.hub-track-detail {
  margin-top: 9px;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  line-height: 1.55;
}

.hub-track-action {
  margin-top: auto;
  padding-top: 15px;
  color: var(--track-color);
  font-size: 0.76rem;
  font-weight: 700;
}

.hub-latest {
  margin-top: 36px;
}

.hub-latest-list {
  margin-top: 14px;
  overflow: hidden;
  border-radius: 14px;
}

.hub-latest-item {
  display: grid;
  grid-template-columns: 96px minmax(160px, 0.7fr) minmax(220px, 1fr) auto;
  gap: 16px;
  align-items: center;
  min-height: 58px;
  padding: 10px 16px;
  color: inherit;
  text-decoration: none;
}

.hub-latest-item + .hub-latest-item {
  border-top: 1px solid var(--vp-c-divider);
}

.hub-latest-item:hover {
  background: var(--lh-surface-hover);
}

.hub-latest-item time {
  color: var(--vp-c-text-3);
  font-family: var(--lh-font-mono);
  font-size: 0.72rem;
}

.hub-latest-item strong {
  min-width: 0;
  overflow: hidden;
  font-size: 0.88rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-latest-tags {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 5px;
}

.hub-latest-tags span {
  border-radius: 999px;
  padding: 3px 7px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 0.68rem;
}

.hub-latest-arrow {
  color: var(--vp-c-brand-1);
}

.hub-empty {
  margin: 16px 0;
  color: var(--vp-c-text-3);
  font-size: 0.84rem;
}

.hub-utility-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
  align-items: center;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.76rem;
}

.hub-utility-links a {
  color: var(--vp-c-text-2);
  font-weight: 700;
  text-decoration: none;
}

.hub-utility-links a:hover {
  color: var(--vp-c-brand-1);
}

.hub-utility-links span {
  margin-left: auto;
}

@media (hover: hover) and (pointer: fine) {
  .hub-button:hover,
  .hub-track:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 900px) {
  .hub-dashboard-header {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .hub-shortcuts {
    justify-content: flex-start;
  }

  .hub-main-grid {
    grid-template-columns: 1fr;
  }

  .hub-utility-links span {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 680px) {
  .hub-dashboard {
    padding: 26px 16px 56px;
  }

  .hub-heading h1 {
    font-size: 2rem;
  }

  .hub-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hub-stat:nth-child(3) {
    border-left: 0;
    border-top: 1px solid var(--vp-c-divider);
  }

  .hub-stat:nth-child(4) {
    border-top: 1px solid var(--vp-c-divider);
  }

  .hub-tracks {
    grid-template-columns: 1fr;
  }

  .hub-track {
    min-height: 0;
  }

  .hub-section-heading {
    align-items: start;
  }

  .hub-section-heading > p {
    display: none;
  }

  .hub-latest-item {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 5px 12px;
    padding: 12px;
  }

  .hub-latest-item time {
    grid-column: 1;
    grid-row: 2;
  }

  .hub-latest-item strong {
    grid-column: 1 / 3;
    grid-row: 1;
  }

  .hub-latest-tags {
    grid-column: 1;
    grid-row: 3;
  }

  .hub-latest-arrow {
    grid-column: 2;
    grid-row: 2 / 4;
  }
}

@media (max-width: 420px) {
  .hub-shortcuts {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hub-button {
    width: 100%;
  }

  .hub-panel-heading {
    align-items: start;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
