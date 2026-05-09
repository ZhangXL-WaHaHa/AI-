export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center p-4">
      <main className="max-w-xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">小红书 AI 助手</h1>
          <p className="text-gray-500 mt-2 text-sm">每天自动抓取热点，用 AI 生成文章，一键发布小红书</p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="/settings"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all group"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-900 text-sm">系统设置</div>
            <div className="text-xs text-gray-400 mt-1">配置 AI 模型、新闻来源、发布方式</div>
          </a>

          <a
            href="/dashboard"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900 text-sm">发布管理</div>
            <div className="text-xs text-gray-400 mt-1">查看生成文章、手动触发发布</div>
          </a>

          <a
            href="/news"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="text-2xl mb-2">🔥</div>
            <div className="font-semibold text-gray-900 text-sm">热点新闻</div>
            <div className="text-xs text-gray-400 mt-1">查看今日热搜榜单</div>
          </a>

          <a
            href="/logs"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-gray-900 text-sm">发布日志</div>
            <div className="text-xs text-gray-400 mt-1">历史发布记录与状态</div>
          </a>
        </div>

        {/* 快捷入口 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            🚀 <span className="font-medium">快速开始</span> — 先完成系统设置
          </div>
          <a
            href="/settings"
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-medium transition-colors"
          >
            去设置 →
          </a>
        </div>
      </main>
    </div>
  )
}
