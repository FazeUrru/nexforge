'use client'

import { Terminal, Github, Twitter, MessageCircle } from 'lucide-react'

const footerLinks = {
  Producto: [
    { label: 'KODA 0.7', href: '#modelos' },
    { label: 'NOVA 0.5', href: '#modelos' },
    { label: 'FLUX 0.3', href: '#modelos' },
    { label: 'Changelog', href: '#' },
  ],
  Recursos: [
    { label: 'Documentación', href: '#' },
    { label: 'Tutoriales', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Comunidad: [
    { label: 'Discord', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Contribuir', href: '#' },
  ],
  Legal: [
    { label: 'Licencia MIT', href: '#' },
    { label: 'Privacidad', href: '#' },
    { label: 'Términos', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-[oklch(0.2_0.03_260)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06d6a0] to-[#00ffc8] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#0a0f1c]" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Nex<span className="text-gradient">Forge</span>
              </span>
            </div>
            <p className="text-sm text-[oklch(0.5_0.02_200)] leading-relaxed mb-4 max-w-xs">
              IA OpenSource para crear aplicaciones web completas.
              100% gratis, ilimitado y sin restricciones.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[oklch(0.5_0.02_200)] hover:text-[#06d6a0] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[oklch(0.2_0.03_260)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[oklch(0.4_0.02_200)]">
            &copy; 2026 NexForge. Licencia MIT. Hecho con IA y amor OpenSource.
          </p>
          <div className="flex items-center gap-3 text-xs text-[oklch(0.4_0.02_200)]">
            <span className="font-mono px-2 py-1 rounded bg-[oklch(0.15_0.03_260)] border border-[oklch(0.2_0.03_260)]">
              v0.2.0
            </span>
            <span className="font-mono px-2 py-1 rounded bg-[#06d6a0]/10 border border-[#06d6a0]/20 text-[#06d6a0]">
              OpenSource
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
