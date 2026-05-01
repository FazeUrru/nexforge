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
  title: "NexForge v0.2.0 — IA OpenSource para Crear Apps Web",
  description: "Plataforma 100% gratis, ilimitada y OpenSource impulsada por IA. Crea aplicaciones web completas con KODA 0.7, NOVA 0.5 y FLUX 0.3 — sin restricciones.",
  keywords: ["NexForge", "IA", "OpenSource", "generador de apps", "KODA", "NOVA", "FLUX", "aplicaciones web", "gratis", "ilimitado"],
  authors: [{ name: "NexForge Team" }],
  icons: {
    icon: "/logo-nexforge.png",
  },
  openGraph: {
    title: "NexForge v0.2.0 — IA OpenSource para Crear Apps Web",
    description: "100% Gratis · Ilimitado · OpenSource · Crea apps web completas con IA",
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
  );
}
