'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Github, Terminal } from 'lucide-react'

const navLinks = [
  { href: '#chat', label: 'Chat IA' },
  { href: '#modelos', label: 'Modelos' },
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Demo' },
  { href: '#opensource', label: 'OpenSource' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[oklch(0.08_0.02_260)]/90 backdrop-blur-xl border-b border-[oklch(0.25_0.04_260)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#06d6a0] to-[#00ffc8] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(6,214,160,0.4)] transition-shadow">
              <Terminal className="w-5 h-5 text-[#0a0f1c]" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Nex<span className="text-gradient">Forge</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/20">
              v0.3.0
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-[oklch(0.7_0.02_200)] hover:text-[#06d6a0] transition-colors rounded-lg hover:bg-[#06d6a0]/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[oklch(0.6_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-semibold hover:shadow-[0_0_30px_rgba(6,214,160,0.3)] transition-all border-0">
              Empezar Gratis
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[oklch(0.7_0.02_200)] hover:text-[#06d6a0]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[oklch(0.08_0.02_260)]/95 backdrop-blur-xl border-b border-[oklch(0.25_0.04_260)]"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-[oklch(0.7_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-[oklch(0.25_0.04_260)]">
                <Button className="w-full bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-semibold border-0">
                  Empezar Gratis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
