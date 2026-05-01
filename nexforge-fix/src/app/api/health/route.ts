import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const memUsage = process.memoryUsage()
  const uptime = process.uptime()

  return NextResponse.json({
    status: 'ok',
    version: '0.5.0',
    uptime: Math.round(uptime),
    uptimeFormatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    },
    timestamp: new Date().toISOString(),
    agents: ['ARQ', 'CODE', 'QA', 'UX'],
    models: {
      koda: '1.3',
      nova: '1.1',
      flux: '0.9',
    },
  })
}
