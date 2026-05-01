'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#06d6a0]/10 via-[oklch(0.12_0.02_260)] to-[#00ffc8]/10" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#06d6a0]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#00ffc8]/10 rounded-full blur-3xl" />

          <div className="relative p-8 sm:p-12 md:p-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#06d6a0]" />
              <span className="text-sm font-medium text-[#06d6a0]">4 Agentes · Vista Previa · Publicar · 100% Gratis</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Empieza a crear{' '}
              <span className="text-gradient">ahora</span>
            </h2>
            <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-xl mx-auto mb-8 leading-relaxed">
              Únete a miles de desarrolladores que ya crean aplicaciones web completas
              con 4 agentes IA especializados. Gratis, ilimitado y OpenSource. Para siempre.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-bold text-lg px-8 py-6 hover:shadow-[0_0_40px_rgba(6,214,160,0.3)] transition-all border-0 group"
              >
                Crear mi primera app
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[oklch(0.3_0.03_260)] text-[oklch(0.7_0.02_200)] hover:bg-[oklch(0.15_0.03_260)] font-semibold px-8 py-6 transition-all"
              >
                Leer documentación
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
