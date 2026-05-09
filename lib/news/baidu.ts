import { NewsItem, FetchResult } from './types'

const BAIDU_HOT_API = 'https://top.baidu.com/api/board?platform=wise&tab=realtime'

export async function fetchBaiduHot(count = 10): Promise<FetchResult> {
  const fetchedAt = new Date().toISOString()
  try {
    const res = await fetch(BAIDU_HOT_API, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://www.baidu.com/',
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const rawList: Array<{
      word: string
      hotScore?: string | number
      desc?: string
      query?: string
    }> = json?.data?.cards?.[0]?.content ?? []

    const items: NewsItem[] = rawList
      .filter((item) => item.word || item.query)
      .slice(0, count)
      .map((item, idx) => ({
        rank: idx + 1,
        title: item.word ?? item.query ?? '',
        hotValue: String(item.hotScore ?? ''),
        url: `https://www.baidu.com/s?wd=${encodeURIComponent(item.word ?? item.query ?? '')}`,
        source: 'baidu' as const,
        fetchedAt,
      }))

    return { success: true, items, source: 'baidu', fetchedAt }
  } catch (err) {
    return {
      success: false,
      items: [],
      error: String(err),
      source: 'baidu',
      fetchedAt,
    }
  }
}
