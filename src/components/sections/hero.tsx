'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Infinity } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.02_260)]/60 via-transparent to-[oklch(0.08_0.02_260)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#06d6a0]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ffc8]/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06d6a0]/2 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#06d6a0]" />
          <span className="text-sm font-medium text-[#06d6a0]">v0.2.0 — OpenSource & 100% Gratis</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Crea apps web{' '}
          <span className="text-gradient">completas</span>
          <br />
          con Inteligencia Artificial
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Tres modelos de IA potentes. Sin restricciones de uso. Sin límites.
          Sin costes. OpenSource para siempre. Genera aplicaciones web completas
          en segundos con <strong className="text-[#06d6a0]">KODA 0.7</strong>,{' '}
          <strong className="text-[#00ffc8]">NOVA 0.5</strong> y{' '}
          <strong className="text-[#10b981]">FLUX 0.3</strong>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-bold text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(6,214,160,0.3)] transition-all border-0 group"
          >
            Empezar a Crear
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[#06d6a0]/30 text-[#06d6a0] hover:bg-[#06d6a0]/10 font-semibold text-lg px-8 py-6 transition-all"
          >
            Ver Demo
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { icon: Zap, label: 'Generación instantánea', value: '<3s' },
            { icon: Infinity, label: 'Uso ilimitado', value: 'Sin límites' },
            { icon: Sparkles, label: 'Apps generadas', value: '50K+' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-[oklch(0.5_0.02_200)]">
              <stat.icon className="w-4 h-4 text-[#06d6a0]" />
              <span className="text-sm">{stat.label}</span>
              <span className="text-sm font-bold text-[#06d6a0]">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.08_0.02_260)] to-transparent" />
    </section>
  )
}
