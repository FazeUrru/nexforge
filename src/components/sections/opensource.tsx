'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Github,
  Star,
  GitFork,
  Heart,
  Scale,
  Eye,
  Users,
  ArrowRight,
  ExternalLink,
  GitCommitHorizontal,
  Tag,
  FileCode2,
} from 'lucide-react'

const GITHUB_REPO_URL = 'https://github.com/FazeUrru/nexforge'

const stats = [
  { icon: Star, label: 'GitHub Stars', value: '12.4K', color: '#e5c07b' },
  { icon: GitFork, label: 'Forks', value: '2.8K', color: '#06d6a0' },
  { icon: Users, label: 'Contribuidores', value: '340+', color: '#61afef' },
  { icon: Eye, label: 'Watchers', value: '890', color: '#c678dd' },
]

const principles = [
  {
    icon: Scale,
    title: 'Licencia MIT',
    description: 'Código completamente libre. Usa, modifica, distribuye y comercializa sin restricciones. NexForge es tuyo.',
  },
  {
    icon: Heart,
    title: 'Hecho por la comunidad',
    description: 'Desarrollado por cientos de contribuidores alrededor del mundo. Cada línea de código es transparente y auditable.',
  },
  {
    icon: Github,
    title: 'Código abierto siempre',
    description: 'Sin open-core, sin features premium ocultas. Todo el código fuente está disponible públicamente en GitHub.',
  },
]

const recentChanges = [
  { version: 'v0.4.0', date: 'May 2026', changes: ['Auto-corrección integrada', 'Botones editar/copiar/escuchar', 'Planificación extendida', 'KODA 1.1 · NOVA 0.9 · FLUX 0.7'] },
  { version: 'v0.3.0', date: 'Abr 2026', changes: ['Planificación en tiempo real', 'Chat a pantalla completa', 'Streaming optimizado', 'KODA 0.9 · NOVA 0.7 · FLUX 0.5'] },
  { version: 'v0.2.0', date: 'Mar 2026', changes: ['Chat interactivo con IA', '3 modelos disponibles', 'Simulación de streaming', 'Versión inicial OpenSource'] },
]

export function OpenSourceSection() {
  return (
    <section id="opensource" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
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
            <Github className="w-3 h-3 mr-1" />
            OpenSource
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tu código,{' '}
            <span className="text-gradient">tus reglas</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            NexForge es y será siempre OpenSource. Sin excepciones. Sin planes
            enterprise. Sin paywalls. Todo el poder de la IA, libre para todos.
          </p>
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-xl bg-[oklch(0.1_0.02_260)]/60 border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 transition-all"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-[oklch(0.5_0.02_200)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {principles.map((principle, i) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-xl bg-[oklch(0.1_0.02_260)]/60 border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#06d6a0]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-4">
                <principle.icon className="w-5 h-5 text-[#06d6a0]" />
              </div>
              <h3 className="font-semibold mb-2">{principle.title}</h3>
              <p className="text-sm text-[oklch(0.6_0.02_200)] leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Changelog / Recent Changes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <GitCommitHorizontal className="w-5 h-5 text-[#06d6a0]" />
            Changelog
          </h3>
          <div className="space-y-4">
            {recentChanges.map((release, i) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  i === 0
                    ? 'bg-[#06d6a0]/5 border-[#06d6a0]/20'
                    : 'bg-[oklch(0.1_0.02_260)]/40 border-[oklch(0.2_0.03_260)]'
                }`}
              >
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <Tag className={`w-4 h-4 ${i === 0 ? 'text-[#06d6a0]' : 'text-[oklch(0.4_0.02_200)]'}`} />
                  <span className={`font-mono text-sm font-bold ${i === 0 ? 'text-[#06d6a0]' : 'text-[oklch(0.5_0.02_200)]'}`}>
                    {release.version}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[oklch(0.4_0.02_200)]">{release.date}</span>
                    {i === 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#06d6a0]/15 text-[#06d6a0] font-semibold border border-[#06d6a0]/20">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {release.changes.map((change) => (
                      <span
                        key={change}
                        className="text-xs text-[oklch(0.6_0.02_200)] px-2 py-0.5 rounded-md bg-[oklch(0.12_0.02_260)] border border-[oklch(0.18_0.02_260)]"
                      >
                        {change}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA - GitHub Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-[#06d6a0]/30 text-[#06d6a0] hover:bg-[#06d6a0]/10 font-semibold px-8 py-6 group"
            >
              <Github className="w-5 h-5 mr-2" />
              Ver en GitHub
              <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </a>
          <p className="text-xs text-[oklch(0.4_0.02_200)] mt-3">
            Repositorio OpenSource · MIT License · Auto-actualizado con cada versión
          </p>
        </motion.div>
      </div>
    </section>
  )
}
