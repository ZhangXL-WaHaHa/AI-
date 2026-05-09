export interface NewsItem {
  rank: number
  title: string
  hotValue: string
  url: string
  source: 'weibo' | 'baidu'
  fetchedAt: string
}

export interface FetchResult {
  success: boolean
  items: NewsItem[]
  error?: string
  source: 'weibo' | 'baidu'
  fetchedAt: string
}
