'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Brain, Rocket, Code, Layers, Gauge, Check, RefreshCw, Users, Eye, Paintbrush, TestTube2 } from 'lucide-react'

const models = [
  {
    name: 'KODA',
    version: '1.3',
    fullName: 'KODA 1.3',
    tagline: 'El motor full-stack más avanzado con 4 agentes especializados',
    description:
      'Nuestro modelo más potente. KODA 1.3 genera aplicaciones web completas con planificación arquitectónica, frontend, backend, base de datos, testing y despliegue. Ahora con 28B parámetros, 320K de contexto, 4 agentes especializados (ARQ, CODE, QA, UX), vista previa de código y sugerencias de mejora automáticas.',
    color: '#06d6a0',
    gradient: 'from-[#06d6a0] to-[#00ffc8]',
    icon: Cpu,
    features: [
      '4 agentes especializados en tiempo real',
      '28B parámetros — máximo rendimiento',
      'Vista previa del código generado',
      'Botón de publicar con deploy automático',
      'Sugerencias de mejora automáticas',
      'Auto-corrección inteligente de errores',
    ],
    specs: {
      params: '28B',
      context: '320K',
      speed: '72 tok/s',
    },
    agents: ['ARQ', 'CODE', 'QA', 'UX'],
  },
  {
    name: 'NOVA',
    version: '1.1',
    fullName: 'NOVA 1.1',
    tagline: 'Brillante, versátil y auto-mejorable con agentes',
    description:
      'El modelo brillante de NexForge. NOVA 1.1 combina inteligencia contextual avanzada con velocidad de iteración, auto-mejora continua y 4 agentes especializados. Con 16B parámetros y 160K de contexto, genera código limpio con sugerencias de mejora, vista previa y deploy automático.',
    color: '#00ffc8',
    gradient: 'from-[#00ffc8] to-[#06d6a0]',
    icon: Brain,
    features: [
      'Auto-mejora continua por prompt',
      '4 agentes: ARQ, CODE, QA, UX',
      'Vista previa y deploy automático',
      'Documentación automática JSDoc/TSDoc',
      'Sugerencias de mejora inteligentes',
      'Design system generation',
    ],
    specs: {
      params: '16B',
      context: '160K',
      speed: '135 tok/s',
    },
    agents: ['ARQ', 'CODE', 'QA', 'UX'],
  },
  {
    name: 'FLUX',
    version: '0.9',
    fullName: 'FLUX 0.9',
    tagline: 'Velocidad extrema con agentes y vista previa',
    description:
      'Velocidad pura potenciada. FLUX 0.9 con 9B parámetros y 245 tok/s genera MVPs completos y prototipos funcionales en segundos. Incluye 4 agentes especializados, vista previa del código, self-check automático y botón de publicar.',
    color: '#10b981',
    gradient: 'from-[#10b981] to-[#06d6a0]',
    icon: Rocket,
    features: [
      '4 agentes trabajando en paralelo',
      'Prototipado ultrarrápido — 245 tok/s',
      'Vista previa en tiempo real',
      'Botón publicar con deploy Vercel',
      'Sugerencias de mejora rápidas',
      'Zero-config deployment',
    ],
    specs: {
      params: '9B',
      context: '96K',
      speed: '245 tok/s',
    },
    agents: ['ARQ', 'CODE', 'QA', 'UX'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const agentInfo = [
  { name: 'ARQ', icon: Layers, color: '#8b5cf6', desc: 'Arquitecto' },
  { name: 'CODE', icon: Code, color: '#06d6a0', desc: 'Programador' },
  { name: 'QA', icon: TestTube2, color: '#f59e0b', desc: 'Calidad' },
  { name: 'UX', icon: Paintbrush, color: '#ec4899', desc: 'Diseño' },
]

export function ModelsSection() {
  return (
    <section id="modelos" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/20 mb-4">
            <Users className="w-3 h-3 mr-1" />
            3 Modelos + 4 Agentes Especializados
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tres motores,{' '}
            <span className="text-gradient">4 agentes, poder infinito</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Cada modelo incluye 4 agentes especializados que trabajan en tiempo real.
            ARQ diseña, CODE implementa, QA verifica y UX optimiza. La duración depende de tu prompt.
          </p>
        </motion.div>

        {/* Agent badges row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          {agentInfo.map((agent) => (
            <div key={agent.name} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[oklch(0.2_0.03_260)] bg-[oklch(0.1_0.02_260)]">
              <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
              <div>
                <span className="text-sm font-bold" style={{ color: agent.color }}>{agent.name}</span>
                <span className="text-xs text-[oklch(0.5_0.02_200)] ml-1">{agent.desc}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Model cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {models.map((model) => (
            <motion.div key={model.name} variants={cardVariants}>
              <Card className="relative bg-[oklch(0.12_0.02_260)]/80 backdrop-blur border-[oklch(0.25_0.04_260)] hover:border-[oklch(0.35_0.04_260)] transition-all duration-300 h-full group overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${model.color}08, transparent 40%)` }}
                />
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${model.color}20, ${model.color}10)`, border: `1px solid ${model.color}30` }}
                    >
                      <model.icon className="w-6 h-6" style={{ color: model.color }} />
                    </div>
                    <Badge className="font-mono text-xs px-2 py-1" style={{ background: `${model.color}15`, color: model.color, border: `1px solid ${model.color}30` }}>
                      v{model.version}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <span style={{ color: model.color }}>{model.name}</span>{' '}
                    <span className="text-[oklch(0.5_0.02_200)]">{model.version}</span>
                  </h3>
                  <p className="text-sm text-[oklch(0.5_0.02_200)] font-medium">{model.tagline}</p>
                </CardHeader>
                <CardContent className="relative space-y-5">
                  <p className="text-sm text-[oklch(0.6_0.02_200)] leading-relaxed">{model.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(model.specs).map(([key, value]) => (
                      <div key={key} className="text-center p-2 rounded-lg" style={{ background: `${model.color}08`, border: `1px solid ${model.color}15` }}>
                        <div className="text-xs text-[oklch(0.5_0.02_200)] capitalize mb-1">{key}</div>
                        <div className="text-sm font-bold" style={{ color: model.color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Agent badges */}
                  <div className="flex items-center gap-2">
                    {model.agents.map((agent) => {
                      const info = agentInfo.find(a => a.name === agent)
                      return info ? (
                        <span key={agent} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono" style={{ color: info.color, background: `${info.color}15`, border: `1px solid ${info.color}20` }}>
                          <info.icon className="w-3 h-3" />{info.name}
                        </span>
                      ) : null
                    })}
                  </div>
                  <div className="space-y-2">
                    {model.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" style={{ color: model.color }} />
                        <span className="text-sm text-[oklch(0.6_0.02_200)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
