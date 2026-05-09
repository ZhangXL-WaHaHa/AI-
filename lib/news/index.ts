import { fetchWeiboHot } from './weibo'
import { fetchBaiduHot } from './baidu'
import { NewsItem, FetchResult } from './types'
import { readSettings } from '@/lib/config/settings'

export { type NewsItem, type FetchResult }

export async function fetchHotNews(): Promise<{
  items: NewsItem[]
  results: FetchResult[]
}> {
  const settings = readSettings()
  const { newsSource, newsCount } = settings

  const tasks: Promise<FetchResult>[] = []

  if (newsSource === 'weibo' || newsSource === 'both') {
    tasks.push(fetchWeiboHot(newsCount))
  }
  if (newsSource === 'baidu' || newsSource === 'both') {
    tasks.push(fetchBaiduHot(newsCount))
  }

  const results = await Promise.all(tasks)

  // 合并去重（按标题）
  const seen = new Set<string>()
  const items: NewsItem[] = []
  for (const r of results) {
    for (const item of r.items) {
      const key = item.title.trim()
      if (!seen.has(key)) {
        seen.add(key)
        items.push(item)
      }
    }
  }

  return { items, results }
}
