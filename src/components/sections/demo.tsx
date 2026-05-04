'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Terminal, Play, Copy, Check } from 'lucide-react'

const codeLines = [
  { text: '// Proyecto: E-Commerce App', color: '#6b7280', delay: 0 },
  { text: '// Generado por KODA 1.3 + 4 Agentes — NexForge v0.6.0', color: '#6b7280', delay: 100 },
  { text: '', color: '', delay: 200 },
  { text: 'import', color: '#c678dd', delay: 300, rest: ' { NextForge } ', restColor: '#e06c75', rest2: 'from', rest2Color: '#c678dd', rest3: " '@nexforge/core'", rest3Color: '#98c379' },
  { text: 'import', color: '#c678dd', delay: 400, rest: ' { PrismaClient } ', restColor: '#e06c75', rest2: 'from', rest2Color: '#c678dd', rest3: " '@prisma/client'", rest3Color: '#98c379' },
  { text: '', color: '', delay: 500 },
  { text: 'const', color: '#c678dd', delay: 600, rest: ' app = ', restColor: '#abb2bf', rest2: 'new', rest2Color: '#c678dd', rest3: ' NextForge({', rest3Color: '#e5c07b' },
  { text: '  model:', color: '#e06c75', delay: 700, rest: " 'KODA_1.3',", restColor: '#98c379' },
  { text: '  agents:', color: '#e06c75', delay: 800, rest: " ['ARQ', 'CODE', 'QA', 'UX'],", restColor: '#98c379' },
  { text: '  database:', color: '#e06c75', delay: 900, rest: " 'postgresql',", restColor: '#98c379' },
  { text: '  auth:', color: '#e06c75', delay: 1000, rest: ' true,', restColor: '#d19a66' },
  { text: '  preview:', color: '#e06c75', delay: 1100, rest: ' true,', restColor: '#d19a66' },
  { text: '  deploy:', color: '#e06c75', delay: 1200, rest: " 'vercel',", restColor: '#98c379' },
  { text: '})', color: '#abb2bf', delay: 1300 },
  { text: '', color: '', delay: 1400 },
  { text: 'app.', color: '#abb2bf', delay: 1500, rest: 'generate', restColor: '#61afef', rest2: '({', rest2Color: '#e5c07b' },
  { text: '  prompt:', color: '#e06c75', delay: 1600, rest: " 'Tienda online con carrito,", restColor: '#98c379' },
  { text: "           pagos Stripe y panel admin", color: '#98c379', delay: 1700 },
  { text: "           con dashboard analítico',", color: '#98c379', delay: 1800 },
  { text: '  complexity:', color: '#e06c75', delay: 1900, rest: " 'enterprise',", restColor: '#98c379' },
  { text: '})', color: '#abb2bf', delay: 2000 },
  { text: '', color: '', delay: 2100 },
  { text: '// ARQ: Arquitectura diseñada (12 fases)', color: '#8b5cf6', delay: 2200 },
  { text: '// CODE: 47 archivos implementados', color: '#06d6a0', delay: 2300 },
  { text: '// QA: 12/12 tests pasando', color: '#f59e0b', delay: 2400 },
  { text: '// UX: Accesibilidad y responsive OK', color: '#ec4899', delay: 2500 },
  { text: '// Published: https://my-store.vercel.app', color: '#06d6a0', delay: 2600 },
]

const terminalLines = [
  { text: '$ nexforge create my-store --model koda-1.3 --agents all', color: '#06d6a0', delay: 0 },
  { text: '', color: '', delay: 300 },
  { text: '🟣 ARQ: Analizando requisitos...', color: '#8b5cf6', delay: 600 },
  { text: '🟣 ARQ: Diseñando arquitectura del sistema...', color: '#8b5cf6', delay: 1000 },
  { text: '🟣 ARQ: Modelo de datos completado', color: '#8b5cf6', delay: 1400 },
  { text: '🟢 CODE: Implementando API routes (12)...', color: '#06d6a0', delay: 1800 },
  { text: '🟢 CODE: Construyendo componentes UI (23)...', color: '#06d6a0', delay: 2200 },
  { text: '🟢 CODE: Lógica de negocio completada', color: '#06d6a0', delay: 2600 },
  { text: '🟡 QA: Verificando calidad del código...', color: '#f59e0b', delay: 3000 },
  { text: '🟡 QA: Auto-corrección: 2 errores corregidos', color: '#f59e0b', delay: 3400 },
  { text: '🩷 UX: Optimizando accesibilidad y responsive...', color: '#ec4899', delay: 3800 },
  { text: '🩷 UX: 5 mejoras de UX aplicadas', color: '#ec4899', delay: 4200 },
  { text: '', color: '', delay: 4400 },
  { text: '✅ App generada exitosamente por 4 agentes', color: '#06d6a0', delay: 4600 },
  { text: '', color: '', delay: 4700 },
  { text: '📊 Resumen:', color: '#e5c07b', delay: 4800 },
  { text: '   47 archivos generados · 12 API endpoints', color: '#abb2bf', delay: 4900 },
  { text: '   23 componentes UI · 12/12 tests OK', color: '#06d6a0', delay: 5000 },
  { text: '   5 sugerencias de mejora disponibles', color: '#f59e0b', delay: 5100 },
  { text: '   Published: https://my-store.vercel.app', color: '#61afef', delay: 5200 },
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
        if (activeTab === 'code') setVisibleCodeLines(i + 1)
        else setVisibleTerminalLines(i + 1)
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/20 mb-4">
            <Play className="w-3 h-3 mr-1" />
            Demo con 4 Agentes
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            De idea a app con{' '}
            <span className="text-gradient">4 agentes IA</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Mira cómo ARQ, CODE, QA y UX trabajan en tiempo real para crear una aplicación web completa.
            Vista previa, sugerencias y publicación incluidos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="code-block overflow-hidden"
        >
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
                  className={`px-3 py-1 text-xs rounded-md transition-all ${activeTab === 'code' ? 'bg-[#06d6a0]/15 text-[#06d6a0]' : 'text-[oklch(0.5_0.02_200)] hover:text-[oklch(0.7_0.02_200)]'}`}
                >
                  app.ts
                </button>
                <button
                  onClick={() => { setActiveTab('terminal'); setVisibleCodeLines(0); setVisibleTerminalLines(0) }}
                  className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-all ${activeTab === 'terminal' ? 'bg-[#06d6a0]/15 text-[#06d6a0]' : 'text-[oklch(0.5_0.02_200)] hover:text-[oklch(0.7_0.02_200)]'}`}
                >
                  <Terminal className="w-3 h-3" />
                  agents
                </button>
              </div>
            </div>
            {activeTab === 'code' && (
              <button onClick={handleCopy} className="p-1.5 rounded-md text-[oklch(0.5_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/10 transition-all">
                {copied ? <Check className="w-4 h-4 text-[#06d6a0]" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          <div className="p-4 sm:p-6 font-mono text-sm leading-7 overflow-x-auto max-h-[480px] overflow-y-auto">
            {currentLines.slice(0, visibleCount).map((line, i) => (
              <div key={i} className="flex">
                <span className="inline-block w-8 text-right mr-4 text-[oklch(0.3_0.02_200)] select-none">{i + 1}</span>
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
              <span className="inline-block w-8 text-right mr-4 text-[oklch(0.3_0.02_200)] select-none">{visibleCount + 1}</span>
              <span className="inline-block w-2 h-5 bg-[#06d6a0] animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
