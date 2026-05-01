'use client'

import { Navbar } from '@/components/sections/navbar'
import { Hero } from '@/components/sections/hero'
import { ModelsSection } from '@/components/sections/models'
import { FeaturesSection } from '@/components/sections/features'
import { DemoSection } from '@/components/sections/demo'
import { OpenSourceSection } from '@/components/sections/opensource'
import { CTASection } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ModelsSection />
        <FeaturesSection />
        <DemoSection />
        <OpenSourceSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
