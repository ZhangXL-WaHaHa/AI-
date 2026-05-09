// ⚠️ 此文件仅限服务端使用（API Routes / Server Components）
// 客户端请从 @/lib/config/options 导入类型和常量

import fs from 'fs'
import path from 'path'
import { AppSettings, DEFAULT_SETTINGS } from './options'

export type { AIModel, NewsSource, PublishMethod, AppSettings } from './options'
export { DEFAULT_SETTINGS } from './options'

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json')

export function readSettings(): AppSettings {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) return DEFAULT_SETTINGS
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function writeSettings(settings: Partial<AppSettings>): AppSettings {
  const current = readSettings()
  const updated = { ...current, ...settings }
  const dir = path.dirname(SETTINGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2), 'utf-8')
  return updated
}
