import { NextRequest, NextResponse } from 'next/server'
import { readSettings, writeSettings } from '@/lib/config/settings'

export async function GET() {
  const settings = readSettings()
  // 脱敏：不暴露完整 API Key 和密码
  const masked = {
    ...settings,
    aiApiKey: settings.aiApiKey ? '••••••••' + settings.aiApiKey.slice(-4) : '',
    xiaohongshuPassword: settings.xiaohongshuPassword ? '••••••••' : '',
    xiaohongshuCookies: settings.xiaohongshuCookies ? '[已保存]' : '',
  }
  return NextResponse.json({ success: true, data: masked })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 如果 apiKey 是脱敏格式，不更新原值
    if (body.aiApiKey && body.aiApiKey.startsWith('••••')) {
      delete body.aiApiKey
    }
    if (body.xiaohongshuPassword && body.xiaohongshuPassword === '••••••••') {
      delete body.xiaohongshuPassword
    }
    if (body.xiaohongshuCookies && body.xiaohongshuCookies === '[已保存]') {
      delete body.xiaohongshuCookies
    }

    const updated = writeSettings(body)
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
