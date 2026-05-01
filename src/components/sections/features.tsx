'use client'

import { motion } from 'framer-motion'
import {
  Code2, Database, Shield, Globe, GitBranch, Palette,
  Server, Lock, Zap, RefreshCw, Layout, Smartphone,
  Eye, Lightbulb, Users, Layers, Clock, RocketIcon, TestTube2, Paintbrush,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: '4 Agentes Especializados',
    description: 'ARQ (Arquitecto), CODE (Programador), QA (Calidad) y UX (Diseño) trabajan en tiempo real coordinados para crear tu app completa.',
  },
  {
    icon: Eye,
    title: 'Vista Previa del Código',
    description: 'Visualiza el código generado con syntax highlighting, navegación entre archivos y vista en tiempo real mientras los agentes trabajan.',
  },
  {
    icon: Globe,
    title: 'Botón Publicar',
    description: 'Publica tu app directamente en Vercel con un solo clic. Deploy automático con progreso en tiempo real y URL pública instantánea.',
  },
  {
    icon: Lightbulb,
    title: 'Sugerencias de Mejora',
    description: 'Después de generar tu app, la IA sugiere mejoras específicas: nuevas features, optimizaciones de rendimiento, mejoras de UX y más.',
  },
  {
    icon: Clock,
    title: 'Fases Adaptativas',
    description: 'La duración de cada fase se adapta a la complejidad de tu prompt. Desde segundos para consultas simples hasta 5+ minutos para apps enterprise.',
  },
  {
    icon: Code2,
    title: 'Código Limpio y Completo',
    description: 'Generación de código siguiendo las mejores prácticas de la industria, tipado fuerte con TypeScript, y estructura modular mantenible.',
  },
  {
    icon: Database,
    title: 'Base de Datos Integrada',
    description: 'Prisma ORM, migraciones automáticas y esquemas generados al instante. Soporte para PostgreSQL, MySQL, SQLite y más.',
  },
  {
    icon: Shield,
    title: 'Seguridad por Defecto',
    description: 'Autenticación, autorización, sanitización de inputs y protección CSRF incluidas en cada proyecto generado automáticamente.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integrado',
    description: 'Repositorio OpenSource en GitHub con changelog automático, releases versionadas y contribuciones de la comunidad.',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Corrección IA',
    description: 'La IA detecta y corrige sus propios errores antes de mostrar el resultado. Self-review integrado que verifica imports, tipos y lógica.',
  },
  {
    icon: Layout,
    title: 'Full-Stack Completo',
    description: 'Frontend, backend, base de datos, autenticación, APIs, testing y despliegue. Todo incluido en un solo flujo.',
  },
  {
    icon: Lock,
    title: '100% OpenSource',
    description: 'Código abierto bajo licencia MIT. Sin lock-in, sin dependencias propietarias. Tú posees todo el código generado.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Todo lo que necesitas,{' '}
            <span className="text-gradient">nada que pagar</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            NexForge incluye 4 agentes especializados, vista previa, publicación automática
            y sugerencias de mejora. Sin planes premium, sin features bloqueadas.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-5 rounded-xl bg-[oklch(0.1_0.02_260)]/60 border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 hover:bg-[oklch(0.12_0.02_260)]/80 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-[#06d6a0]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-3 group-hover:bg-[#06d6a0]/15 group-hover:border-[#06d6a0]/30 transition-all">
                <feature.icon className="w-5 h-5 text-[#06d6a0]" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-[oklch(0.5_0.02_200)] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
