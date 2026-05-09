import { NewsItem, FetchResult } from './types'

const WEIBO_HOT_API = 'https://weibo.com/ajax/side/hotSearch'

export async function fetchWeiboHot(count = 10): Promise<FetchResult> {
  const fetchedAt = new Date().toISOString()
  try {
    const res = await fetch(WEIBO_HOT_API, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://weibo.com/',
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const rawList: Array<{
      word: string
      raw_hot?: number | string
      icon_desc?: string
      num?: number | string
    }> = json?.data?.realtime ?? []

    const items: NewsItem[] = rawList
      .filter((item) => item.word)
      .slice(0, count)
      .map((item, idx) => ({
        rank: idx + 1,
        title: item.word,
        hotValue: String(item.raw_hot ?? item.num ?? item.icon_desc ?? ''),
        url: `https://s.weibo.com/weibo?q=%23${encodeURIComponent(item.word)}%23`,
        source: 'weibo' as const,
        fetchedAt,
      }))

    return { success: true, items, source: 'weibo', fetchedAt }
  } catch (err) {
    return {
      success: false,
      items: [],
      error: String(err),
      source: 'weibo',
      fetchedAt,
    }
  }
}
