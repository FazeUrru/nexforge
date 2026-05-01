'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Brain, Rocket, Code, Layers, Gauge, Check } from 'lucide-react'

const models = [
  {
    name: 'KODA',
    version: '0.7',
    fullName: 'KODA 0.7',
    tagline: 'El motor full-stack más potente',
    description:
      'Nuestro modelo insignia. KODA 0.7 genera aplicaciones web completas con frontend, backend, base de datos y despliegue en un solo prompt. Optimizado para proyectos complejos y de producción con arquitectura escalable, mejores prácticas integradas y código limpio listo para mantener.',
    color: '#06d6a0',
    gradient: 'from-[#06d6a0] to-[#00ffc8]',
    icon: Cpu,
    features: [
      'Generación full-stack completa',
      'Arquitectura escalable automática',
      'Testing integrado por defecto',
      'Despliegue con un clic',
      'Múltiples frameworks soportados',
      'API REST + GraphQL automático',
    ],
    specs: {
      params: '14B',
      context: '128K tokens',
      speed: '45 tok/s',
    },
  },
  {
    name: 'NOVA',
    version: '0.5',
    fullName: 'NOVA 0.5',
    tagline: 'Equilibrio perfecto entre potencia y velocidad',
    description:
      'El modelo equilibrado de NexForge. NOVA 0.5 ofrece una generación inteligente y contextual con la velocidad necesaria para iterar rápido. Ideal para desarrollo ágil, prototipos funcionales y proyectos que necesitan un balance entre calidad de código y tiempo de respuesta.',
    color: '#00ffc8',
    gradient: 'from-[#00ffc8] to-[#06d6a0]',
    icon: Brain,
    features: [
      'Generación inteligente contextual',
      'Refactorización automática',
      'Componentes reutilizables',
      'Hot-reload en tiempo real',
      'Integración con Git',
      'Documentación automática',
    ],
    specs: {
      params: '7B',
      context: '64K tokens',
      speed: '82 tok/s',
    },
  },
  {
    name: 'FLUX',
    version: '0.3',
    fullName: 'FLUX 0.3',
    tagline: 'Velocidad extrema para prototipado rápido',
    description:
      'Velocidad pura. FLUX 0.3 está diseñado para iteraciones ultrarrápidas y prototipado instantáneo. Perfecto para hackathons, pruebas de concepto y cuando necesitas pasar de idea a app funcional en segundos. Genera código funcional mínimo viable con estructura profesional.',
    color: '#10b981',
    gradient: 'from-[#10b981] to-[#06d6a0]',
    icon: Rocket,
    features: [
      'Prototipado ultrarrápido',
      'MVP en segundos',
      'Plantillas inteligentes',
      'Live preview instantáneo',
      'Iteración por voz',
      'Snippets optimizados',
    ],
    specs: {
      params: '3B',
      context: '32K tokens',
      speed: '150 tok/s',
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
            3 Modelos de IA
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tres motores,{' '}
            <span className="text-gradient">poder infinito</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Cada modelo está optimizado para un propósito. Elige el que mejor se adapte
            a tu proyecto o combínalos para resultados extraordinarios.
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
