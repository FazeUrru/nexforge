'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Terminal, Play, Copy, Check } from 'lucide-react'

const codeLines = [
  { text: '// Proyecto: E-Commerce App', color: '#6b7280', delay: 0 },
  { text: '// Generado por KODA 0.7 — NexForge', color: '#6b7280', delay: 100 },
  { text: '', color: '', delay: 200 },
  { text: 'import', color: '#c678dd', delay: 300, rest: ' { NextForge } ', restColor: '#e06c75', rest2: 'from', rest2Color: '#c678dd', rest3: " '@nexforge/core'", rest3Color: '#98c379' },
  { text: 'import', color: '#c678dd', delay: 400, rest: ' { PrismaClient } ', restColor: '#e06c75', rest2: 'from', rest2Color: '#c678dd', rest3: " '@prisma/client'", rest3Color: '#98c379' },
  { text: '', color: '', delay: 500 },
  { text: 'const', color: '#c678dd', delay: 600, rest: ' app = ', restColor: '#abb2bf', rest2: 'new', rest2Color: '#c678dd', rest3: ' NextForge({', rest3Color: '#e5c07b' },
  { text: '  model:', color: '#e06c75', delay: 700, rest: " 'KODA_0.7',", restColor: '#98c379' },
  { text: '  database:', color: '#e06c75', delay: 800, rest: " 'postgresql',", restColor: '#98c379' },
  { text: '  auth:', color: '#e06c75', delay: 900, rest: ' true,', restColor: '#d19a66' },
  { text: '  deploy:', color: '#e06c75', delay: 1000, rest: " 'vercel',", restColor: '#98c379' },
  { text: '})', color: '#abb2bf', delay: 1100 },
  { text: '', color: '', delay: 1200 },
  { text: 'app.', color: '#abb2bf', delay: 1300, rest: 'generate', restColor: '#61afef', rest2: '({', rest2Color: '#e5c07b' },
  { text: '  prompt:', color: '#e06c75', delay: 1400, rest: " 'Tienda online con carrito,", restColor: '#98c379' },
  { text: '           pagos Stripe y panel admin', color: '#98c379', delay: 1500 },
  { text: "           con dashboard analítico',", color: '#98c379', delay: 1600 },
  { text: '  features:', color: '#e06c75', delay: 1700, rest: " ['cart', 'payments', 'admin', 'analytics'],", restColor: '#98c379' },
  { text: '})', color: '#abb2bf', delay: 1800 },
  { text: '', color: '', delay: 1900 },
  { text: '// ✅ App generada en 2.3s', color: '#06d6a0', delay: 2000 },
  { text: '// ✅ 47 archivos creados', color: '#06d6a0', delay: 2100 },
  { text: '// ✅ Tests pasando (12/12)', color: '#06d6a0', delay: 2200 },
  { text: '// ✅ Desplegada en Vercel', color: '#06d6a0', delay: 2300 },
]

const terminalLines = [
  { text: '$ nexforge create my-store --model koda-0.7', color: '#06d6a0', delay: 0 },
  { text: '', color: '', delay: 300 },
  { text: '⠋ Analizando prompt...', color: '#00ffc8', delay: 600 },
  { text: '⠙ Generando estructura del proyecto...', color: '#00ffc8', delay: 1000 },
  { text: '⠹ Creando modelos de base de datos...', color: '#00ffc8', delay: 1400 },
  { text: '⠸ Generando API routes (12 endpoints)...', color: '#00ffc8', delay: 1800 },
  { text: '⠼ Construyendo componentes UI (23)...', color: '#00ffc8', delay: 2200 },
  { text: '⠴ Configurando autenticación...', color: '#00ffc8', delay: 2600 },
  { text: '⠦ Ejecutando migraciones...', color: '#00ffc8', delay: 3000 },
  { text: '⠧ Generando tests (12 specs)...', color: '#00ffc8', delay: 3400 },
  { text: '', color: '', delay: 3800 },
  { text: '✅ Proyecto creado exitosamente en 2.3s', color: '#06d6a0', delay: 4000 },
  { text: '', color: '', delay: 4100 },
  { text: '📊 Resumen:', color: '#e5c07b', delay: 4200 },
  { text: '   47 archivos generados', color: '#abb2bf', delay: 4300 },
  { text: '   12 API endpoints', color: '#abb2bf', delay: 4400 },
  { text: '   23 componentes UI', color: '#abb2bf', delay: 4500 },
  { text: '   12/12 tests pasando', color: '#06d6a0', delay: 4600 },
  { text: '   Desplegado: https://my-store.vercel.app', color: '#61afef', delay: 4700 },
]

export function DemoSection() {
  const [visibleCodeLines, setVisibleCodeLines] = useState(0)
  const [visibleTerminalLines, setVisibleTerminalLines] = useState(0)
  const [activeTab, setActiveTab] = useState<'code' | 'terminal'>('code')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const lines = activeTab === 'code' ? codeLines : terminalLines
    const timers: NodeJS.Timeout[] = []
    lines.forEach((_, i) => {
      const timer = setTimeout(() => {
        if (activeTab === 'code') {
          setVisibleCodeLines(i + 1)
        } else {
          setVisibleTerminalLines(i + 1)
        }
      }, lines[i].delay + 500)
      timers.push(timer)
    })
    return () => timers.forEach(clearTimeout)
  }, [activeTab])

  const handleCopy = () => {
    const text = codeLines.map(l => l.text + (l.rest || '') + (l.rest2 || '') + (l.rest3 || '')).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentLines = activeTab === 'code' ? codeLines : terminalLines
  const visibleCount = activeTab === 'code' ? visibleCodeLines : visibleTerminalLines

  return (
    <section id="demo" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/20 mb-4">
            <Play className="w-3 h-3 mr-1" />
            Demo en Vivo
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            De idea a app en{' '}
            <span className="text-gradient">segundos</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Mira cómo NexForge genera una aplicación web completa con un solo prompt.
            Frontend, backend, base de datos y despliegue incluidos.
          </p>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="code-block overflow-hidden"
        >
          {/* Code header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#06d6a0]/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setActiveTab('code'); setVisibleCodeLines(0); setVisibleTerminalLines(0) }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    activeTab === 'code'
                      ? 'bg-[#06d6a0]/15 text-[#06d6a0]'
                      : 'text-[oklch(0.5_0.02_200)] hover:text-[oklch(0.7_0.02_200)]'
                  }`}
                >
                  app.ts
                </button>
                <button
                  onClick={() => { setActiveTab('terminal'); setVisibleCodeLines(0); setVisibleTerminalLines(0) }}
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-all ${
                    activeTab === 'terminal'
                      ? 'bg-[#06d6a0]/15 text-[#06d6a0]'
                      : 'text-[oklch(0.5_0.02_200)] hover:text-[oklch(0.7_0.02_200)]'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  terminal
                </button>
              </div>
            </div>
            {activeTab === 'code' && (
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md text-[oklch(0.5_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/10 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-[#06d6a0]" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Code content */}
          <div className="p-4 sm:p-6 font-mono text-sm leading-7 overflow-x-auto max-h-[480px] overflow-y-auto">
            {currentLines.slice(0, visibleCount).map((line, i) => (
              <div key={i} className="flex">
                <span className="inline-block w-8 text-right mr-4 text-[oklch(0.3_0.02_200)] select-none">
                  {i + 1}
                </span>
                <span>
                  {line.color && <span style={{ color: line.color }}>{line.text}</span>}
                  {!line.color && <span className="text-[#abb2bf]">{line.text}</span>}
                  {line.rest && <span style={{ color: line.restColor }}>{line.rest}</span>}
                  {line.rest2 && <span style={{ color: line.rest2Color }}>{line.rest2}</span>}
                  {line.rest3 && <span style={{ color: line.rest3Color }}>{line.rest3}</span>}
                </span>
              </div>
            ))}
            <div className="flex">
              <span className="inline-block w-8 text-right mr-4 text-[oklch(0.3_0.02_200)] select-none">
                {visibleCount + 1}
              </span>
              <span className="inline-block w-2 h-5 bg-[#06d6a0] animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
