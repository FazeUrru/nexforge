import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexForge v0.6.0 — 4 Agentes IA OpenSource · Estabilidad Básica",
  description: "Plataforma 100% gratis, ilimitada y OpenSource con 4 agentes IA. Error handling, validación de input, loading states y UI limpia. ARQ diseña, CODE implementa, QA verifica y UX optimiza.",
  keywords: ["NexForge", "IA", "OpenSource", "agentes IA", "generador de apps", "KODA", "NOVA", "FLUX", "ARQ", "CODE", "QA", "UX", "vista previa", "publicar", "auto-corrección", "aplicaciones web", "gratis", "ilimitado", "estabilidad", "error handling"],
  authors: [{ name: "NexForge Team" }],
  icons: {
    icon: process.env.NEXT_STATIC_EXPORT === 'true' ? '/nexforge/logo-nexforge.png' : '/logo-nexforge.png',
  },
  openGraph: {
    title: "NexForge v0.6.0 — 4 Agentes IA · Estabilidad Básica · OpenSource",
    description: "4 Agentes IA · Error Handling · Validación · Loading States · UI Limpia · OpenSource · Crea apps web completas con IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
