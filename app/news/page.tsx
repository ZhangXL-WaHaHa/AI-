'use client'

import { useState, useEffect } from 'react'
import type { NewsItem } from '@/lib/news/types'

interface ApiResponse {
  success: boolean
  data: NewsItem[]
  meta: {
    total: number
    fetchedAt: string
    sources: { source: string; count: number; success: boolean }[]
    errors?: string[]
  }
  error?: string
}

const SOURCE_LABEL: Record<string, string> = { weibo: '微博', baidu: '百度' }
const SOURCE_COLOR: Record<string, string> = {
  weibo: 'bg-orange-100 text-orange-700',
  baidu: 'bg-blue-100 text-blue-700',
}

export default function NewsPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const json: ApiResponse = await res.json()
      setData(json)
    } catch {
      setData({ success: false, data: [], meta: { total: 0, fetchedAt: '', sources: [] }, error: '请求失败' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews() }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-sm">← 返回</a>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900">🔥 今日热搜</h1>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm flex items-center gap-1.5"
          >
            {loading
              ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />刷新中…</>
              : '🔄 刷新'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* 状态栏 */}
        {data?.meta && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>共 <strong className="text-gray-900">{data.meta.total}</strong> 条热搜</span>
            {data.meta.sources.map((s) => (
              <span key={s.source} className={`px-2 py-0.5 rounded-full font-medium ${s.success ? SOURCE_COLOR[s.source] : 'bg-red-100 text-red-600'}`}>
                {SOURCE_LABEL[s.source]} {s.success ? s.count + '条' : '获取失败'}
              </span>
            ))}
            {data.meta.fetchedAt && (
              <span className="ml-auto">更新于 {new Date(data.meta.fetchedAt).toLocaleTimeString('zh-CN')}</span>
            )}
          </div>
        )}

        {/* 错误提示 */}
        {data?.meta?.errors && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            ⚠️ 部分数据源获取失败：{data.meta.errors.join(' / ')}
          </div>
        )}

        {/* 加载骨架 */}
        {loading && !data && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 新闻列表 */}
        {data?.success && data.data.length > 0 && (
          <div className="space-y-2">
            {data.data.map((item) => (
              <a
                key={`${item.source}-${item.rank}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group"
              >
                {/* 排名 */}
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 ${
                  item.rank === 1 ? 'bg-red-500 text-white' :
                  item.rank === 2 ? 'bg-orange-400 text-white' :
                  item.rank === 3 ? 'bg-yellow-400 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {item.rank}
                </span>

                {/* 标题 */}
                <span className="flex-1 text-sm text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {item.title}
                </span>

                {/* 右侧信息 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.hotValue && (
                    <span className="text-xs text-gray-400">{Number(item.hotValue).toLocaleString()}</span>
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${SOURCE_COLOR[item.source]}`}>
                    {SOURCE_LABEL[item.source]}
                  </span>
                  <span className="text-gray-300 text-xs group-hover:text-orange-400 transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {data?.success && data.data.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">暂无热搜数据，请检查设置或稍后重试</p>
            <button onClick={fetchNews} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">重新获取</button>
          </div>
        )}

        {/* 请求失败 */}
        {data && !data.success && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-red-500">{data.error}</p>
            <button onClick={fetchNews} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">重试</button>
          </div>
        )}
      </main>
    </div>
  )
}
