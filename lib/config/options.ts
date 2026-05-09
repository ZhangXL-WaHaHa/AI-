// ⚠️ 此文件客户端/服务端均可使用，禁止引入 fs/path 等 Node.js 模块

export type AIModel = 'deepseek' | 'openai' | 'qwen'
export type NewsSource = 'weibo' | 'baidu' | 'both'
export type PublishMethod = 'playwright' | 'semi-auto'

export interface AppSettings {
  aiModel: AIModel
  aiApiKey: string
  aiBaseUrl: string
  newsSource: NewsSource
  newsCount: number
  publishMethod: PublishMethod
  xiaohongshuUsername: string
  xiaohongshuPassword: string
  xiaohongshuCookies: string
  publishTime: string
  autoPublish: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  aiModel: 'deepseek',
  aiApiKey: '',
  aiBaseUrl: 'https://api.deepseek.com/v1',
  newsSource: 'weibo',
  newsCount: 5,
  publishMethod: 'playwright',
  xiaohongshuUsername: '',
  xiaohongshuPassword: '',
  xiaohongshuCookies: '',
  publishTime: '09:00',
  autoPublish: false,
}

export const AI_MODEL_OPTIONS = [
  {
    value: 'deepseek' as AIModel,
    label: 'DeepSeek',
    desc: '国内首选，性价比极高，效果接近 GPT-4',
    baseUrl: 'https://api.deepseek.com/v1',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    keyLink: 'https://platform.deepseek.com/api_keys',
  },
  {
    value: 'openai' as AIModel,
    label: 'OpenAI (GPT-4o)',
    desc: '效果最好，需要海外网络',
    baseUrl: 'https://api.openai.com/v1',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    keyLink: 'https://platform.openai.com/api-keys',
  },
  {
    value: 'qwen' as AIModel,
    label: '通义千问 (Qwen)',
    desc: '阿里云出品，国内稳定，有免费额度',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    keyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    keyLink: 'https://dashscope.console.aliyun.com/apiKey',
  },
]

export const NEWS_SOURCE_OPTIONS = [
  {
    value: 'weibo' as NewsSource,
    label: '微博热搜',
    desc: '娱乐/社会类内容为主，最适合小红书风格',
    icon: '🔥',
  },
  {
    value: 'baidu' as NewsSource,
    label: '百度热搜',
    desc: '综合热点，覆盖面广',
    icon: '📰',
  },
  {
    value: 'both' as NewsSource,
    label: '微博 + 百度',
    desc: '同时抓取两个平台，内容更丰富',
    icon: '⚡',
  },
]

export const PUBLISH_METHOD_OPTIONS = [
  {
    value: 'playwright' as PublishMethod,
    label: 'Playwright 自动化',
    desc: '浏览器模拟操作，稳定可靠。首次需手动登录保存 Cookie，之后全自动。',
    icon: '🤖',
    recommended: true,
  },
  {
    value: 'semi-auto' as PublishMethod,
    label: '半自动（人工确认）',
    desc: 'AI 生成文章后，在管理后台预览，手动点击发布。更安全，适合审核内容。',
    icon: '👆',
    recommended: false,
  },
]
