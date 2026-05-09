'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AI_MODEL_OPTIONS,
  NEWS_SOURCE_OPTIONS,
  PUBLISH_METHOD_OPTIONS,
  type AIModel,
  type NewsSource,
  type PublishMethod,
} from '@/lib/config/options'

interface FormState {
  aiModel: AIModel
  aiApiKey: string
  aiBaseUrl: string
  newsSource: NewsSource
  newsCount: number
  publishMethod: PublishMethod
  xiaohongshuUsername: string
  xiaohongshuPassword: string
  publishTime: string
  autoPublish: boolean
}

const DEFAULT_FORM: FormState = {
  aiModel: 'deepseek',
  aiApiKey: '',
  aiBaseUrl: 'https://api.deepseek.com/v1',
  newsSource: 'weibo',
  newsCount: 5,
  publishMethod: 'playwright',
  xiaohongshuUsername: '',
  xiaohongshuPassword: '',
  publishTime: '09:00',
  autoPublish: false,
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const json = await res.json()
      if (json.success) {
        setForm((prev) => ({ ...prev, ...json.data }))
      }
    } catch {
      showToast('error', '加载配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // 切换模型时自动填充 BaseURL
  const handleModelChange = (model: AIModel) => {
    const opt = AI_MODEL_OPTIONS.find((o) => o.value === model)
    setForm((prev) => ({
      ...prev,
      aiModel: model,
      aiBaseUrl: opt?.baseUrl ?? prev.aiBaseUrl,
      aiApiKey: '',
    }))
  }

  const handleSave = async () => {
    if (!form.aiApiKey || form.aiApiKey.startsWith('••••')) {
      // 保留服务端原值，不传 apiKey
    }
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        showToast('success', '✅ 保存成功')
        fetchSettings()
      } else {
        showToast('error', '保存失败：' + json.error)
      }
    } catch (e) {
      showToast('error', '网络错误：' + String(e))
    } finally {
      setSaving(false)
    }
  }

  const currentModelOpt = AI_MODEL_OPTIONS.find((o) => o.value === form.aiModel)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm flex items-center gap-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full" />
          加载配置中…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              ← 返回
            </a>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900">⚙️ 系统设置</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {saving && (
              <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
            )}
            {saving ? '保存中…' : '保存设置'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ── Section 1: AI 模型 ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              🤖 <span>AI 模型</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">选择用于生成小红书文章的 AI 模型</p>
          </div>
          <div className="p-6 space-y-4">
            {/* 模型选卡 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AI_MODEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleModelChange(opt.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    form.aiModel === opt.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.desc}</div>
                  {form.aiModel === opt.value && (
                    <span className="mt-2 inline-block text-xs text-purple-600 font-medium">✓ 已选</span>
                  )}
                </button>
              ))}
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                API Key
                {currentModelOpt?.keyLink && (
                  <a
                    href={currentModelOpt.keyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-purple-500 hover:underline"
                  >
                    获取 Key →
                  </a>
                )}
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={form.aiApiKey}
                  onChange={(e) => setForm((p) => ({ ...p, aiApiKey: e.target.value }))}
                  placeholder={currentModelOpt?.keyPlaceholder ?? 'sk-...'}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showApiKey ? '隐藏' : '显示'}
                </button>
              </div>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Base URL
                <span className="ml-1 text-xs text-gray-400 font-normal">（如需中转服务可修改）</span>
              </label>
              <input
                type="text"
                value={form.aiBaseUrl}
                onChange={(e) => setForm((p) => ({ ...p, aiBaseUrl: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: 新闻来源 ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              📰 <span>热点新闻来源</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">每天自动抓取的热搜榜单</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {NEWS_SOURCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((p) => ({ ...p, newsSource: opt.value }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    form.newsSource === opt.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="font-medium text-sm text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.desc}</div>
                  {form.newsSource === opt.value && (
                    <span className="mt-2 inline-block text-xs text-orange-600 font-medium">✓ 已选</span>
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                每次抓取条数
                <span className="ml-1 text-xs text-gray-400 font-normal">（从热搜前 N 条中选取）</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={form.newsCount}
                  onChange={(e) => setForm((p) => ({ ...p, newsCount: Number(e.target.value) }))}
                  className="flex-1 accent-orange-500"
                />
                <span className="w-12 text-center text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg py-1">
                  {form.newsCount}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: 发布方式 ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-white">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              📱 <span>小红书发布设置</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">配置自动发布到小红书的方式</p>
          </div>
          <div className="p-6 space-y-4">
            {/* 发布方式选卡 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PUBLISH_METHOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((p) => ({ ...p, publishMethod: opt.value }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all relative ${
                    form.publishMethod === opt.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {opt.recommended && (
                    <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      推荐
                    </span>
                  )}
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="font-medium text-sm text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.desc}</div>
                  {form.publishMethod === opt.value && (
                    <span className="mt-2 inline-block text-xs text-red-600 font-medium">✓ 已选</span>
                  )}
                </button>
              ))}
            </div>

            {/* 账号信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">小红书账号</label>
                <input
                  type="text"
                  value={form.xiaohongshuUsername}
                  onChange={(e) => setForm((p) => ({ ...p, xiaohongshuUsername: e.target.value }))}
                  placeholder="手机号 / 邮箱"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.xiaohongshuPassword}
                    onChange={(e) => setForm((p) => ({ ...p, xiaohongshuPassword: e.target.value }))}
                    placeholder="登录密码"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showPassword ? '隐藏' : '显示'}
                  </button>
                </div>
              </div>
            </div>

            {/* Playwright 说明 */}
            {form.publishMethod === 'playwright' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                <p className="font-medium">📌 Playwright 使用说明</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                  <li>填写账号密码后，首次运行会自动打开浏览器登录</li>
                  <li>登录成功后 Cookie 将自动保存，后续无需重新登录</li>
                  <li>如遇到验证码，需要人工介入一次</li>
                  <li>建议使用小号测试，避免主号风险</li>
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 4: 定时任务 ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              ⏰ <span>定时发布</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">设置每天自动执行的时间</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">每天发布时间</label>
                <input
                  type="time"
                  value={form.publishTime}
                  onChange={(e) => setForm((p) => ({ ...p, publishTime: e.target.value }))}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex flex-col gap-1 pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm((p) => ({ ...p, autoPublish: !p.autoPublish }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.autoPublish ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        form.autoPublish ? 'left-6' : 'left-1'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700">
                    {form.autoPublish ? '自动发布已开启' : '自动发布已关闭'}
                  </span>
                </label>
                <p className="text-xs text-gray-400 ml-13">
                  开启后每天定时自动抓取热搜并发布
                </p>
              </div>
            </div>

            {form.autoPublish && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
                ✅ 系统将在每天 <strong>{form.publishTime}</strong> 自动抓取热搜、生成文章并发布到小红书
              </div>
            )}
          </div>
        </section>

        {/* 底部保存按钮 */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            {saving && (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {saving ? '保存中…' : '💾 保存所有设置'}
          </button>
        </div>
      </main>
    </div>
  )
}
