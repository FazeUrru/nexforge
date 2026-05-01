'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Brain, Rocket, Code, Layers, Gauge, Check, RefreshCw } from 'lucide-react'

const models = [
  {
    name: 'KODA',
    version: '1.1',
    fullName: 'KODA 1.1',
    tagline: 'El motor full-stack más avanzado con auto-corrección',
    description:
      'Nuestro modelo más potente. KODA 1.1 genera aplicaciones web completas con planificación arquitectónica, frontend, backend, base de datos, testing y despliegue. Ahora con 24B parámetros, 256K de contexto y auto-corrección integrada que detecta y repara errores antes de mostrar el resultado.',
    color: '#06d6a0',
    gradient: 'from-[#06d6a0] to-[#00ffc8]',
    icon: Cpu,
    features: [
      'Auto-corrección inteligente de errores',
      '24B parámetros — máximo rendimiento',
      'Código production-ready con Zod validation',
      'Testing integrado (Vitest + Playwright)',
      'API REST + GraphQL + WebSockets',
      'Deploy config para Vercel, Docker, AWS',
    ],
    specs: {
      params: '24B',
      context: '256K tokens',
      speed: '72 tok/s',
    },
  },
  {
    name: 'NOVA',
    version: '0.9',
    fullName: 'NOVA 0.9',
    tagline: 'Brillante, versátil y auto-mejorable',
    description:
      'El modelo brillante de NexForge. NOVA 0.9 combina inteligencia contextual avanzada con velocidad de iteración y auto-mejora continua. Ahora con 14B parámetros y 128K de contexto, genera código limpio, bien documentado y listo para producir con explicaciones paso a paso y verificación automática.',
    color: '#00ffc8',
    gradient: 'from-[#00ffc8] to-[#06d6a0]',
    icon: Brain,
    features: [
      'Auto-mejora continua por prompt',
      'Refactorización inteligente con patrones',
      'Componentes reutilizables + Storybook',
      'Documentación automática JSDoc/TSDoc',
      'Verificación de código en tiempo real',
      'Design system generation',
    ],
    specs: {
      params: '14B',
      context: '128K tokens',
      speed: '120 tok/s',
    },
  },
  {
    name: 'FLUX',
    version: '0.7',
    fullName: 'FLUX 0.7',
    tagline: 'Velocidad extrema con self-check integrado',
    description:
      'Velocidad pura potenciada. FLUX 0.7 ahora con 7B parámetros y 220 tok/s genera MVPs completos y prototipos funcionales en segundos. Incluye self-check automático que verifica imports, tipos y lógica antes de entregar el código.',
    color: '#10b981',
    gradient: 'from-[#10b981] to-[#06d6a0]',
    icon: Rocket,
    features: [
      'Self-check automático pre-entrega',
      'Prototipado ultrarrápido — 220 tok/s',
      'MVP completo en segundos',
      'Live preview con hot-reload',
      'Plantillas smart por industria',
      'Zero-config deployment',
    ],
    specs: {
      params: '7B',
      context: '80K tokens',
      speed: '220 tok/s',
    },
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

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
            <Layers className="w-3 h-3 mr-1" />
            3 Modelos de IA con Auto-Corrección
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tres motores,{' '}
            <span className="text-gradient">poder infinito</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Cada modelo está optimizado para un propósito y todos incluyen auto-corrección.
            Elige el que mejor se adapte a tu proyecto o combínalos para resultados extraordinarios.
          </p>
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
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${model.color}08, transparent 40%)`,
                  }}
                />

                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${model.color}20, ${model.color}10)`,
                        border: `1px solid ${model.color}30`,
                      }}
                    >
                      <model.icon className="w-6 h-6" style={{ color: model.color }} />
                    </div>
                    <Badge
                      className="font-mono text-xs px-2 py-1"
                      style={{
                        background: `${model.color}15`,
                        color: model.color,
                        border: `1px solid ${model.color}30`,
                      }}
                    >
                      v{model.version}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight">
                    <span style={{ color: model.color }}>{model.name}</span>{' '}
                    <span className="text-[oklch(0.5_0.02_200)]">{model.version}</span>
                  </h3>
                  <p className="text-sm text-[oklch(0.5_0.02_200)] font-medium">
                    {model.tagline}
                  </p>
                </CardHeader>

                <CardContent className="relative space-y-5">
                  <p className="text-sm text-[oklch(0.6_0.02_200)] leading-relaxed">
                    {model.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(model.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-2 rounded-lg"
                        style={{ background: `${model.color}08`, border: `1px solid ${model.color}15` }}
                      >
                        <div className="text-xs text-[oklch(0.5_0.02_200)] capitalize mb-1">{key}</div>
                        <div className="text-sm font-bold" style={{ color: model.color }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
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
