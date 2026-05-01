#!/usr/bin/env node

/**
 * NexForge Server Health Monitor & Auto-Restarter
 * 
 * This script monitors the Next.js dev server and automatically
 * restarts it if it crashes or becomes unresponsive.
 * 
 * Features:
 * - Periodic health checks (HTTP ping to localhost:3000)
 * - Automatic restart on crash or unresponsiveness
 * - Graceful shutdown on SIGINT/SIGTERM
 * - Restart counter and cooldown (max 10 restarts per 5 minutes)
 * - Memory usage monitoring
 * - Auto-cleanup of zombie processes
 */

const { spawn, exec } = require('child_process')
const http = require('http')

const PORT = 3000
const HEALTH_CHECK_INTERVAL = 15000 // 15 seconds
const RESTART_COOLDOWN = 30000 // 30 seconds between restarts
const MAX_RESTARTS_PER_WINDOW = 10
const RESTART_WINDOW = 300000 // 5 minutes
const MAX_MEMORY_MB = 1024 // Max memory before forced restart

let serverProcess = null
let restartCount = 0
let restartTimestamps = []
let isShuttingDown = false
let lastRestart = 0
let healthCheckTimer = null

function log(message) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [NexForge-Monitor] ${message}`)
}

function startServer() {
  if (isShuttingDown) return

  const now = Date.now()
  if (now - lastRestart < RESTART_COOLDOWN) {
    const wait = RESTART_COOLDOWN - (now - lastRestart)
    log(`Cooldown activo. Esperando ${Math.round(wait / 1000)}s antes de reiniciar...`)
    setTimeout(startServer, wait)
    return
  }

  // Check restart rate limit
  restartTimestamps = restartTimestamps.filter(t => now - t < RESTART_WINDOW)
  if (restartTimestamps.length >= MAX_RESTARTS_PER_WINDOW) {
    log(`⚠️ Límite de ${MAX_RESTARTS_PER_WINDOW} reinicios en 5 minutos alcanzado. Esperando...`)
    const oldestInWindow = restartTimestamps[0]
    const waitTime = RESTART_WINDOW - (now - oldestInWindow) + 5000
    setTimeout(startServer, waitTime)
    return
  }

  log('🚀 Iniciando servidor NexForge...')
  
  // Kill any existing process on port 3000
  exec(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true`, () => {
    serverProcess = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=1536' },
    })

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim()
      if (output) {
        process.stdout.write(`[Server] ${output}\n`)
        if (output.includes('Ready') || output.includes('Compiled')) {
          log('✅ Servidor listo y compilado')
        }
      }
    })

    serverProcess.stderr.on('data', (data) => {
      const output = data.toString().trim()
      if (output && !output.includes('ExperimentalWarning') && !output.includes('DeprecationWarning')) {
        process.stderr.write(`[Server:ERR] ${output}\n`)
      }
    })

    serverProcess.on('close', (code, signal) => {
      if (isShuttingDown) return
      log(`⚠️ Servidor terminado (código: ${code}, señal: ${signal}). Reiniciando automáticamente...`)
      restartTimestamps.push(Date.now())
      lastRestart = Date.now()
      setTimeout(startServer, 3000)
    })

    serverProcess.on('error', (err) => {
      log(`❌ Error del servidor: ${err.message}. Reiniciando...`)
      restartTimestamps.push(Date.now())
      lastRestart = Date.now()
      setTimeout(startServer, 5000)
    })

    lastRestart = Date.now()
  })
}

function healthCheck() {
  if (isShuttingDown || !serverProcess) return

  const req = http.get(`http://localhost:${PORT}`, { timeout: 10000 }, (res) => {
    if (res.statusCode === 200 || res.statusCode === 304) {
      // Server is healthy
      checkMemory()
    } else {
      log(`⚠️ Health check: status ${res.statusCode}. Monitoreando...`)
    }
    res.resume()
  })

  req.on('error', (err) => {
    if (!isShuttingDown) {
      log(`⚠️ Health check falló: ${err.message}. Verificando si necesita reinicio...`)
      // Give it one more chance - sometimes the server is just restarting
      setTimeout(() => {
        const retryReq = http.get(`http://localhost:${PORT}`, { timeout: 10000 }, (retryRes) => {
          log('✅ Servidor recuperado después de fallo temporal')
          retryRes.resume()
        })
        retryReq.on('error', () => {
          log('❌ Servidor no responde. Reiniciando automáticamente...')
          forceRestart()
        })
        retryReq.on('timeout', () => {
          retryReq.destroy()
          log('❌ Servidor no responde (timeout). Reiniciando automáticamente...')
          forceRestart()
        })
      }, 5000)
    }
  })

  req.on('timeout', () => {
    req.destroy()
    if (!isShuttingDown) {
      log('❌ Health check timeout. Reiniciando servidor...')
      forceRestart()
    }
  })
}

function checkMemory() {
  try {
    const memUsage = process.memoryUsage()
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    const rssMB = Math.round(memUsage.rss / 1024 / 1024)
    
    if (rssMB > MAX_MEMORY_MB) {
      log(`⚠️ Memoria alta: ${rssMB}MB RSS. Reiniciando por seguridad...`)
      forceRestart()
    }
  } catch {
    // Memory check is non-critical
  }
}

function forceRestart() {
  if (isShuttingDown) return
  
  if (serverProcess && !serverProcess.killed) {
    log('🔄 Forzando reinicio del servidor...')
    try {
      serverProcess.kill('SIGTERM')
      setTimeout(() => {
        if (serverProcess && !serverProcess.killed) {
          serverProcess.kill('SIGKILL')
        }
      }, 5000)
    } catch {
      // Process already dead
    }
  }
  
  // Also kill any zombie processes on port
  exec(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true`, () => {
    restartTimestamps.push(Date.now())
    lastRestart = Date.now()
    setTimeout(startServer, 5000)
  })
}

function gracefulShutdown(signal) {
  log(`🛑 Recibida señal ${signal}. Cerrando gracefully...`)
  isShuttingDown = true
  
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer)
  }
  
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill('SIGTERM')
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL')
      }
      log('👋 Servidor cerrado. ¡Hasta luego!')
      process.exit(0)
    }, 10000)
  } else {
    log('👋 Servidor cerrado. ¡Hasta luego!')
    process.exit(0)
  }
}

// ─── Main ────────────────────────────────────────────────────────

log('🛡️ NexForge Server Monitor v0.5.0 iniciado')
log(`📋 Config: Puerto ${PORT}, Health check cada ${HEALTH_CHECK_INTERVAL / 1000}s, Max memoria ${MAX_MEMORY_MB}MB`)
log(`🔄 Auto-restart: máx ${MAX_RESTARTS_PER_WINDOW} por ${RESTART_WINDOW / 60000}min, cooldown ${RESTART_COOLDOWN / 1000}s`)

startServer()

// Start health checks after initial startup delay
setTimeout(() => {
  healthCheckTimer = setInterval(healthCheck, HEALTH_CHECK_INTERVAL)
  log('🔍 Health checks activados')
}, 30000)

// Graceful shutdown handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'))

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  log(`❌ Excepción no capturada: ${err.message}`)
  forceRestart()
})

process.on('unhandledRejection', (reason) => {
  log(`❌ Promesa rechazada no manejada: ${reason}`)
  // Don't restart on unhandled rejection, just log it
})
