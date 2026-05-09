import { NextResponse } from 'next/server'
import { fetchWeiboHot } from '@/lib/news/weibo'
import { fetchBaiduHot } from '@/lib/news/baidu'
import { readSettings } from '@/lib/config/settings'
import type { NewsItem, FetchResult } from '@/lib/news/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 直接读取设置，避免模块循环问题
    const settings = readSettings()
    const { newsSource, newsCount } = settings

    console.log('[news/route] newsSource:', newsSource, 'newsCount:', newsCount)

    const tasks: Promise<FetchResult>[] = []
    if (newsSource === 'weibo' || newsSource === 'both') tasks.push(fetchWeiboHot(newsCount))
    if (newsSource === 'baidu' || newsSource === 'both') tasks.push(fetchBaiduHot(newsCount))

    const results = await Promise.all(tasks)

    console.log('[news/route] results:', results.map(r => ({ source: r.source, success: r.success, count: r.items.length, error: r.error })))

    // 合并去重
    const seen = new Set<string>()
    const items: NewsItem[] = []
    for (const r of results) {
      for (const item of r.items) {
        const key = item.title.trim()
        if (!seen.has(key)) { seen.add(key); items.push(item) }
      }
    }

    const errors = results.filter(r => !r.success).map(r => `${r.source}: ${r.error}`)

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        fetchedAt: new Date().toISOString(),
        sources: results.map(r => ({ source: r.source, count: r.items.length, success: r.success })),
        errors: errors.length > 0 ? errors : undefined,
        debug: { newsSource, newsCount },
      },
    })
  } catch (err) {
    console.error('[news/route] error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
