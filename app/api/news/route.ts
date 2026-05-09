import { NextResponse } from 'next/server'
import { fetchHotNews } from '@/lib/news'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { items, results } = await fetchHotNews()

    const errors = results.filter((r) => !r.success).map((r) => `${r.source}: ${r.error}`)

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        fetchedAt: new Date().toISOString(),
        sources: results.map((r) => ({ source: r.source, count: r.items.length, success: r.success })),
        errors: errors.length > 0 ? errors : undefined,
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
