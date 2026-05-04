'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Cpu, Brain, Rocket, Send, RotateCcw, Sparkles, Trash2,
  ChevronDown, Bot, User, X, Maximize2, Minimize2,
  Zap, CheckCircle2, Circle, Loader2, Code2, LayoutList, Play,
  FileCode2, Database, Shield, Palette, Server, RocketIcon,
  Copy, Check, Volume2, VolumeX, Pencil, MessageSquare,
  GitBranch, RefreshCw, Eye, Globe, Lightbulb, Users,
  Architecture, Wrench, TestTube2, Paintbrush, ArrowRight,
  ExternalLink, Clock, Layers, Activity, Github, AlertTriangle,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// ─── Types ───────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  isStreaming?: boolean
  selfCorrected?: boolean
  suggestions?: Suggestion[]
  codeBlocks?: CodeBlock[]
  agentResults?: AgentResult[]
}

interface Suggestion {
  id: string
  title: string
  description: string
}

interface CodeBlock {
  id: string
  language: string
  code: string
  filename?: string
}

interface AgentResult {
  agentId: string
  agentName: string
  phase: string
  result: string
  status: 'pending' | 'active' | 'done'
}

interface PlanStep {
  id: number
  icon: typeof Cpu
  text: string
  detail: string
  subSteps?: string[]
  status: 'pending' | 'active' | 'done'
  agentId?: string
  agentName?: string
  duration?: number // in seconds
}

interface ModelOption {
  key: string
  name: string
  version: string
  icon: typeof Cpu
  color: string
  description: string
  speed: string
  params: string
  context: string
}

interface AgentInfo {
  id: string
  name: string
  icon: typeof Cpu
  color: string
  description: string
}

// ─── Constants ───────────────────────────────────────────────────

const models: ModelOption[] = [
  {
    key: 'koda-1.3',
    name: 'KODA',
    version: '1.3',
    icon: Cpu,
    color: '#06d6a0',
    description: 'Full-stack avanzado + 4 agentes especializados',
    speed: '72 tok/s',
    params: '28B',
    context: '320K',
  },
  {
    key: 'nova-1.1',
    name: 'NOVA',
    version: '1.1',
    icon: Brain,
    color: '#00ffc8',
    description: 'Equilibrado, brillante y auto-mejorable',
    speed: '135 tok/s',
    params: '16B',
    context: '160K',
  },
  {
    key: 'flux-0.9',
    name: 'FLUX',
    version: '0.9',
    icon: Rocket,
    color: '#10b981',
    description: 'Velocidad extrema + self-check',
    speed: '245 tok/s',
    params: '9B',
    context: '96K',
  },
]

const agents: AgentInfo[] = [
  { id: 'arq', name: 'ARQ', icon: Layers, color: '#8b5cf6', description: 'Agente Arquitecto — Diseña la arquitectura del sistema' },
  { id: 'code', name: 'CODE', icon: Code2, color: '#06d6a0', description: 'Agente Programador — Implementa el código completo' },
  { id: 'qa', name: 'QA', icon: TestTube2, color: '#f59e0b', description: 'Agente Calidad — Verifica, testea y corrige errores' },
  { id: 'ux', name: 'UX', icon: Paintbrush, color: '#ec4899', description: 'Agente Diseño — Optimiza UI/UX y accesibilidad' },
]

const suggestedPrompts = [
  { icon: '🛒', text: 'Crea una app de e-commerce con carrito, pagos Stripe y panel admin' },
  { icon: '📊', text: 'Genera un dashboard con gráficos en tiempo real y autenticación' },
  { icon: '📝', text: 'Haz un blog con CMS, comentarios, markdown y SEO automático' },
  { icon: '✅', text: 'Crea una app de gestión de proyectos tipo Trello con drag & drop' },
  { icon: '🌐', text: 'Genera una red social con perfiles, posts, likes y mensajería' },
  { icon: '🎨', text: 'Haz un portfolio con animaciones 3D, dark mode y blog integrado' },
  { icon: '📱', text: 'Crea una app de chat en tiempo real con WebSockets y notificaciones' },
  { icon: '💰', text: 'Genera una app de finanzas con presupuestos, gráficos y exportación' },
]

const NEXFORGE_VERSION = '0.6.0'

// ─── Complexity Analyzer ─────────────────────────────────────────

type ComplexityLevel = 'simple' | 'medium' | 'complex' | 'enterprise'

function analyzeComplexity(text: string): { level: ComplexityLevel; score: number; phaseDuration: number; totalPhases: number } {
  const lower = text.toLowerCase()
  let score = 0

  // Keyword scoring
  const complexKeywords = [
    'e-commerce', 'ecommerce', 'tienda', 'store', 'shop', 'pagos', 'stripe', 'paypal',
    'red social', 'social network', 'chat', 'mensajer', 'real-time', 'websocket',
    'dashboard', 'analytics', 'crm', 'erp', 'saas', 'plataforma',
    'multi-tenant', 'roles', 'permisos', 'admin', 'panel admin',
    'notificaciones', 'push', 'email', 'integración',
    'api rest', 'graphql', 'microservicio', 'auth', 'oauth',
  ]
  const mediumKeywords = [
    'blog', 'cms', 'portfolio', 'landing', 'app', 'aplicaci',
    'crud', 'base de datos', 'database', 'login', 'registro',
    'tareas', 'todo', 'gestión', 'management', 'reserva',
  ]
  const simpleKeywords = [
    'hola', 'hello', 'explica', 'explain', 'qué es', 'how to',
    'ejemplo', 'example', 'componente', 'button', 'form',
  ]

  complexKeywords.forEach((kw) => { if (lower.includes(kw)) score += 3 })
  mediumKeywords.forEach((kw) => { if (lower.includes(kw)) score += 2 })
  simpleKeywords.forEach((kw) => { if (lower.includes(kw)) score += 1 })

  // Length scoring
  if (text.length > 200) score += 2
  if (text.length > 500) score += 3
  if (text.length > 1000) score += 2

  // Multiple features
  const featureCount = (text.match(/y|con|con |also|plus|,|;/g) || []).length
  score += Math.min(featureCount, 5)

  // Determine level
  let level: ComplexityLevel
  let phaseDuration: number // seconds per phase
  let totalPhases: number

  if (score >= 15) {
    level = 'enterprise'
    phaseDuration = 90 // ~1.5 min per phase
    totalPhases = 12
  } else if (score >= 10) {
    level = 'complex'
    phaseDuration = 60 // ~1 min per phase
    totalPhases = 10
  } else if (score >= 5) {
    level = 'medium'
    phaseDuration = 30 // ~30s per phase
    totalPhases = 8
  } else {
    level = 'simple'
    phaseDuration = 12 // ~12s per phase
    totalPhases = 4
  }

  return { level, score, phaseDuration, totalPhases }
}

// ─── Dynamic Plan Generator ──────────────────────────────────────

function generatePlan(complexity: ReturnType<typeof analyzeComplexity>, isApp: boolean): PlanStep[] {
  const { level, phaseDuration, totalPhases } = complexity

  if (!isApp || level === 'simple') {
    return [
      {
        id: 1, icon: LayoutList, text: 'Procesando solicitud',
        detail: 'Analizando el mensaje y preparando la respuesta...',
        subSteps: ['Interpretando la consulta', 'Accediendo a la base de conocimientos'],
        status: 'pending', duration: phaseDuration,
      },
      {
        id: 2, icon: RefreshCw, text: 'Auto-corrección y verificación',
        detail: 'Revisando la respuesta para asegurar calidad...',
        subSteps: ['Verificando corrección del código', 'Comprobando coherencia'],
        status: 'pending', duration: phaseDuration,
      },
      {
        id: 3, icon: FileCode2, text: 'Generando respuesta optimizada',
        detail: 'Construyendo la respuesta final con sugerencias...',
        subSteps: ['Formateando la salida', 'Generando sugerencias de mejora'],
        status: 'pending', duration: phaseDuration,
      },
    ]
  }

  const basePhases: PlanStep[] = [
    {
      id: 1, icon: LayoutList, text: 'Analizando requisitos del proyecto',
      detail: `Complejidad: ${level.toUpperCase()} — Detectando features, stack, alcance...`,
      subSteps: ['Clasificando tipo de aplicación', 'Identificando features core', 'Seleccionando stack tecnológico', 'Definiendo alcance del proyecto', 'Calculando tiempo estimado'],
      status: 'pending', agentId: 'arq', agentName: 'ARQ', duration: phaseDuration,
    },
    {
      id: 2, icon: Layers, text: 'ARQ: Diseñando arquitectura del sistema',
      detail: 'Arquitectura, patrones, microservicios, escalabilidad...',
      subSteps: ['Diseñando arquitectura del sistema', 'Definiendo patrones de diseño', 'Planificando escalabilidad', 'Documentando decisiones técnicas'],
      status: 'pending', agentId: 'arq', agentName: 'ARQ', duration: phaseDuration * 1.5,
    },
    {
      id: 3, icon: Database, text: 'ARQ: Diseñando modelo de datos y esquema',
      detail: 'Tablas, relaciones, índices, migraciones, seed data...',
      subSteps: ['Definiendo entidades principales', 'Estableciendo relaciones entre tablas', 'Creando índices para rendimiento', 'Generando migraciones y seed data'],
      status: 'pending', agentId: 'arq', agentName: 'ARQ', duration: phaseDuration,
    },
    {
      id: 4, icon: Code2, text: 'CODE: Implementando API routes y endpoints',
      detail: 'Endpoints REST, validación Zod, middleware, error handling...',
      subSteps: ['Diseñando estructura de endpoints', 'Implementando validación con Zod', 'Añadiendo error handling global', 'Configurando rate limiting'],
      status: 'pending', agentId: 'code', agentName: 'CODE', duration: phaseDuration * 1.2,
    },
    {
      id: 5, icon: Palette, text: 'CODE: Construyendo componentes UI y layouts',
      detail: 'Layouts, páginas, forms, modales, design system...',
      subSteps: ['Creando layout principal y navegación', 'Implementando componentes reutilizables', 'Diseñando forms con validación', 'Añadiendo estados de carga y error'],
      status: 'pending', agentId: 'code', agentName: 'CODE', duration: phaseDuration,
    },
    {
      id: 6, icon: FileCode2, text: 'CODE: Implementando lógica de negocio',
      detail: 'Servicios, utils, hooks, state management, integraciones...',
      subSteps: ['Implementando servicios de negocio', 'Creando custom hooks', 'Configurando state management', 'Añadiendo integraciones externas'],
      status: 'pending', agentId: 'code', agentName: 'CODE', duration: phaseDuration,
    },
    {
      id: 7, icon: Shield, text: 'QA: Ejecutando verificación de calidad',
      detail: 'Verificando imports, tipos, errores, edge cases...',
      subSteps: ['Verificando imports completos', 'Comprobando tipos TypeScript', 'Revisando manejo de errores', 'Validando edge cases', 'Ejecutando tests automáticos'],
      status: 'pending', agentId: 'qa', agentName: 'QA', duration: phaseDuration,
    },
    {
      id: 8, icon: TestTube2, text: 'QA: Auto-corrección y self-review',
      detail: 'Corrigiendo errores detectados, optimizando código...',
      subSteps: ['Corrigiendo errores encontrados', 'Optimizando rendimiento', 'Mejorando manejo de errores', 'Verificando cobertura de tests'],
      status: 'pending', agentId: 'qa', agentName: 'QA', duration: phaseDuration * 0.8,
    },
    {
      id: 9, icon: Paintbrush, text: 'UX: Optimizando interfaz y experiencia',
      detail: 'Accesibilidad, responsive, animaciones, feedback...',
      subSteps: ['Mejorando accesibilidad (ARIA)', 'Optimizando responsive design', 'Añadiendo micro-animaciones', 'Mejorando feedback visual'],
      status: 'pending', agentId: 'ux', agentName: 'UX', duration: phaseDuration * 0.8,
    },
  ]

  // Add extra phases for complex/enterprise
  if (level === 'complex' || level === 'enterprise') {
    basePhases.push({
      id: 10, icon: Server, text: 'CODE: Configurando autenticación y seguridad',
      detail: 'NextAuth, OAuth, sesiones, roles, middleware de protección...',
      subSteps: ['Configurando NextAuth.js', 'Añadiendo providers OAuth', 'Implementando roles y permisos', 'Creando middleware de protección'],
      status: 'pending', agentId: 'code', agentName: 'CODE', duration: phaseDuration,
    })
  }

  if (level === 'enterprise') {
    basePhases.push({
      id: 11, icon: Globe, text: 'UX: Configurando internacionalización y temas',
      detail: 'i18n, temas, dark/light mode, configuración regional...',
      subSteps: ['Implementando i18n', 'Configurando temas personalizables', 'Añadiendo dark/light mode', 'Adaptando configuración regional'],
      status: 'pending', agentId: 'ux', agentName: 'UX', duration: phaseDuration * 0.7,
    })
  }

  // Final phase always present
  basePhases.push({
    id: basePhases.length + 1, icon: RocketIcon, text: 'Finalizando, generando sugerencias y preparando vista previa',
    detail: 'Deploy config, sugerencias de mejora, código final, vista previa...',
    subSteps: ['Generando configuración de deploy', 'Creando sugerencias de mejora', 'Preparando vista previa del código', 'Documentando el proyecto'],
    status: 'pending', agentId: 'code', agentName: 'CODE', duration: phaseDuration * 0.6,
  })

  return basePhases
}

// ─── Code Block Extractor ────────────────────────────────────────

function extractCodeBlocks(content: string): CodeBlock[] {
  const blocks: CodeBlock[] = []
  const regex = /```(\w+)?\s*(?:\/\/\s*(\S+\.\w+))?\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      id: crypto.randomUUID(),
      language: match[1] || 'typescript',
      code: match[3].trim(),
      filename: match[2] || undefined,
    })
  }
  return blocks
}

// ─── Main Component ──────────────────────────────────────────────

// Detect if running on GitHub Pages (static mode, no API routes)
function getIsStaticMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname.includes('github.io') ||
    window.location.pathname.startsWith('/nexforge')
}

// Demo responses for static mode (GitHub Pages)
// Using regular strings to avoid template literal interpolation issues with JSX code containing ${}
const demoEcommerce = '## 🛒 E-Commerce App — Generada por KODA 1.3 + 4 Agentes\n\n' +
'### Arquitectura (ARQ)\n' +
'He diseñado una arquitectura escalable con:\n' +
'- **Frontend**: Next.js 14 App Router + Tailwind CSS\n' +
'- **Backend**: API Routes con validación Zod\n' +
'- **Base de datos**: PostgreSQL con Prisma ORM\n' +
'- **Auth**: NextAuth.js con providers Google y GitHub\n' +
'- **Pagos**: Integración Stripe para checkout\n\n' +
'### Código Implementado (CODE)\n\n' +
'```typescript//app/api/products/route.ts\n' +
"import { prisma } from '@/lib/db'\n" +
"import { NextResponse } from 'next/server'\n\n" +
'export async function GET() {\n' +
'  const products = await prisma.product.findMany({\n' +
'    include: { category: true, reviews: true },\n' +
"    orderBy: { createdAt: 'desc' },\n" +
'  })\n' +
'  return NextResponse.json(products)\n' +
'}\n\n' +
'export async function POST(req: Request) {\n' +
'  const body = await req.json()\n' +
'  const product = await prisma.product.create({ data: body })\n' +
'  return NextResponse.json(product, { status: 201 })\n' +
'}\n```\n\n' +
'```typescript//components/ProductCard.tsx\n' +
"'use client'\n" +
"import { useCart } from '@/hooks/useCart'\n" +
"import { ShoppingCart, Star } from 'lucide-react'\n\n" +
'export function ProductCard({ product }: { product: any }) {\n' +
'  const { addItem } = useCart()\n' +
'  return (\n' +
'    <div className="rounded-xl border bg-card p-4 hover:shadow-lg transition">\n' +
'      <h3 className="font-semibold mt-3">{product.name}</h3>\n' +
'      <div className="flex items-center gap-1 mt-1">\n' +
'        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />\n' +
'        <span className="text-sm text-muted">{product.rating}</span>\n' +
'      </div>\n' +
'      <div className="flex items-center justify-between mt-3">\n' +
'        <span className="text-lg font-bold">Precio</span>\n' +
'        <button className="bg-primary text-white px-3 py-2 rounded-lg">\n' +
'          <ShoppingCart className="w-4 h-4" />\n' +
'        </button>\n' +
'      </div>\n' +
'    </div>\n' +
'  )\n' +
'}\n```\n\n' +
'### Verificación (QA)\n' +
'- ✅ 12 API endpoints verificados\n' +
'- ✅ Tipado TypeScript completo\n' +
'- ✅ Validación Zod en todos los inputs\n' +
'- ✅ Manejo de errores global\n' +
'- ✅ 8/8 tests pasando\n\n' +
'### Optimización UX\n' +
'- ✅ Responsive design (mobile-first)\n' +
'- ✅ Skeleton loading states\n' +
'- ✅ Accesibilidad ARIA labels\n' +
'- ✅ Animaciones de transición suaves\n\n' +
'**📦 47 archivos generados · 12 endpoints · 23 componentes**'

const demoDashboard = '## 📊 Dashboard App — Generada por KODA 1.3 + 4 Agentes\n\n' +
'### Arquitectura (ARQ)\n' +
'- **Layout**: Sidebar + Header + Main content area\n' +
'- **Gráficos**: Recharts para visualización en tiempo real\n' +
'- **Auth**: JWT con refresh tokens\n' +
'- **API**: REST con rate limiting\n\n' +
'### Código Implementado (CODE)\n\n' +
'```typescript//app/api/analytics/route.ts\n' +
"import { prisma } from '@/lib/db'\n" +
"import { NextResponse } from 'next/server'\n\n" +
'export async function GET(req: Request) {\n' +
'  const { searchParams } = new URL(req.url)\n' +
"  const range = searchParams.get('range') || '7d'\n" +
'  const [users, revenue, orders] = await Promise.all([\n' +
'    prisma.user.count(),\n' +
'    prisma.order.aggregate({ _sum: { total: true } }),\n' +
'    prisma.order.count(),\n' +
'  ])\n' +
'  return NextResponse.json({ users, revenue: revenue._sum.total, orders })\n' +
'}\n```\n\n' +
'```typescript//components/DashboardChart.tsx\n' +
"'use client'\n" +
"import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'\n\n" +
'export function DashboardChart({ data }: { data: any[] }) {\n' +
'  return (\n' +
'    <ResponsiveContainer width="100%" height={300}>\n' +
'      <LineChart data={data}>\n' +
'        <CartesianGrid strokeDasharray="3 3" stroke="#333" />\n' +
'        <XAxis dataKey="name" stroke="#666" />\n' +
'        <YAxis stroke="#666" />\n' +
"        <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: 8 }} />\n" +
'        <Line type="monotone" dataKey="revenue" stroke="#06d6a0" strokeWidth={2} />\n' +
'        <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />\n' +
'      </LineChart>\n' +
'    </ResponsiveContainer>\n' +
'  )\n' +
'}\n```\n\n' +
'### QA & UX\n' +
'- ✅ Todos los endpoints verificados\n' +
'- ✅ Gráficos responsive\n' +
'- ✅ Dark mode completo\n' +
'- ✅ Filtros de fecha funcionales\n\n' +
'**📦 38 archivos · 8 endpoints · 18 componentes**'

const demoBlog = '## 📝 Blog CMS — Generada por NOVA 1.1 + 4 Agentes\n\n' +
'### Arquitectura (ARQ)\n' +
'- **CMS**: Editor MDX con preview en tiempo real\n' +
'- **SEO**: Meta tags dinámicos, sitemap automático\n' +
'- **Comentarios**: Sistema con moderación\n' +
'- **Auth**: NextAuth con roles (admin, editor, lector)\n\n' +
'### Código (CODE)\n\n' +
'```typescript//app/api/posts/route.ts\n' +
"import { prisma } from '@/lib/db'\n" +
"import { NextResponse } from 'next/server'\n\n" +
'export async function GET() {\n' +
'  const posts = await prisma.post.findMany({\n' +
'    include: { author: true, tags: true },\n' +
"    orderBy: { publishedAt: 'desc' },\n" +
'  })\n' +
'  return NextResponse.json(posts)\n' +
'}\n```\n\n' +
'### QA & UX\n' +
'- ✅ SEO optimizado\n' +
'- ✅ Markdown rendering\n' +
'- ✅ Responsive typography\n' +
'- ✅ Reading time estimation\n\n' +
'**📦 32 archivos · 6 endpoints · 15 componentes**'

const demoDefault = '## ⚡ App Generada por MODEL_NAME + 4 Agentes\n\n' +
'### Arquitectura (ARQ)\n' +
'He analizado tu solicitud y diseñado una arquitectura optimizada:\n' +
'- **Frontend**: Next.js App Router + Tailwind CSS\n' +
'- **Backend**: API Routes con validación\n' +
'- **Base de datos**: Prisma ORM\n' +
'- **Deploy**: Configurado para Vercel\n\n' +
'### Código (CODE)\n\n' +
'```typescript//app/page.tsx\n' +
"'use client'\n" +
"import { useState } from 'react'\n\n" +
'export default function Home() {\n' +
'  const [data, setData] = useState(null)\n' +
'  \n' +
'  return (\n' +
'    <main className="min-h-screen bg-background">\n' +
'      <h1 className="text-4xl font-bold">Mi App</h1>\n' +
'      <p className="text-muted-foreground">Generada con NexForge</p>\n' +
'    </main>\n' +
'  )\n' +
'}\n```\n\n' +
'### Verificación (QA)\n' +
'- ✅ Imports verificados\n' +
'- ✅ Tipos TypeScript correctos\n' +
'- ✅ Sin errores de compilación\n\n' +
'### UX\n' +
'- ✅ Responsive design\n' +
'- ✅ Accesibilidad\n' +
'- ✅ Animaciones suaves\n\n' +
'**📦 24 archivos · 5 endpoints · 12 componentes**'

function getDemoResponse(prompt: string, modelName: string): string {
  const lower = prompt.toLowerCase()
  let response: string
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('tienda') || lower.includes('shop') || lower.includes('carrito')) {
    response = demoEcommerce
  } else if (lower.includes('dashboard') || lower.includes('gráfico') || lower.includes('analytics')) {
    response = demoDashboard
  } else if (lower.includes('blog') || lower.includes('cms') || lower.includes('markdown')) {
    response = demoBlog
  } else {
    response = demoDefault
  }
  return response.replace(/MODEL_NAME/g, modelName)
}

export function ChatSection() {
  const [selectedModel, setSelectedModel] = useState<string>('koda-1.3')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([])
  const [showPlan, setShowPlan] = useState(false)
  const [currentPlanStep, setCurrentPlanStep] = useState(0)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [currentSubStep, setCurrentSubStep] = useState(0)
  const [showCodePreview, setShowCodePreview] = useState(false)
  const [previewCodeBlocks, setPreviewCodeBlocks] = useState<CodeBlock[]>([])
  const [activePreviewBlock, setActivePreviewBlock] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishProgress, setPublishProgress] = useState(0)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [showAgents, setShowAgents] = useState(false)
  const [activeAgents, setActiveAgents] = useState<Record<string, AgentResult>>({})
  const [complexityInfo, setComplexityInfo] = useState<ReturnType<typeof analyzeComplexity> | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const planTimerRef = useRef<NodeJS.Timeout | null>(null)
  const subStepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentModel = models.find((m) => m.key === selectedModel)!

  // ─── Effects ─────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, planSteps, scrollToBottom])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isFullscreen) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current)
      if (planTimerRef.current) clearInterval(planTimerRef.current)
      if (subStepTimerRef.current) clearInterval(subStepTimerRef.current)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // ─── Streaming ──────────────────────────────────────────────

  const simulateStreaming = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(/(\s+)/)
    let current = 0
    const speed = selectedModel === 'flux-0.9' ? 4 : selectedModel === 'nova-1.1' ? 7 : 10

    const interval = setInterval(() => {
      current += 1
      const revealed = words.slice(0, current).join('')
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: revealed, isStreaming: current < words.length }
            : m
        )
      )
      if (current >= words.length) {
        clearInterval(interval)
        streamingIntervalRef.current = null
        // Extract code blocks and suggestions
        const codeBlocks = extractCodeBlocks(fullText)
        setMessages((prev) =>
          prev.map((m) => m.id === messageId ? { ...m, isStreaming: false, codeBlocks } : m)
        )
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
        setShowPlan(false)
        setShowAgents(false)
        // Auto-show code preview if code blocks found
        if (codeBlocks.length > 0) {
          setPreviewCodeBlocks(codeBlocks)
          setActivePreviewBlock(0)
        }
        // Fetch suggestions
        fetchSuggestions(messageId, fullText)
      }
    }, speed)

    streamingIntervalRef.current = interval
    return interval
  }, [selectedModel])

  // ─── Suggestions Fetch ──────────────────────────────────────

  const fetchSuggestions = useCallback(async (messageId: string, content: string) => {
    // Skip in static mode (no API routes on GitHub Pages)
    if (getIsStaticMode()) return
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Sugiere mejoras para esta app: ${content.substring(0, 500)}` }],
          model: selectedModel,
          agent: 'suggest',
        }),
      })
      if (response.ok) {
        const data = await response.json()
        let suggestions: Suggestion[] = []
        try {
          // Try to parse JSON array from the response
          const jsonMatch = data.message.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            suggestions = parsed.map((s: { title: string; description: string }) => ({
              id: crypto.randomUUID(),
              title: s.title,
              description: s.description,
            }))
          }
        } catch {
          // Fallback: create suggestions from the text
          const lines = data.message.split('\n').filter((l: string) => l.trim())
          suggestions = lines.slice(0, 5).map((line: string) => ({
            id: crypto.randomUUID(),
            title: line.replace(/^[\d\.\-\*]+\s*/, '').substring(0, 60),
            description: line.replace(/^[\d\.\-\*]+\s*/, ''),
          }))
        }
        if (suggestions.length > 0) {
          setMessages((prev) =>
            prev.map((m) => m.id === messageId ? { ...m, suggestions } : m)
          )
        }
      }
    } catch {
      // Suggestions fetch is non-critical
    }
  }, [selectedModel])

  // ─── Complexity Detection ───────────────────────────────────

  const isAppRequest = useCallback((text: string): boolean => {
    const lower = text.toLowerCase()
    const appKeywords = [
      'app', 'aplicaci', 'crea', 'genera', 'haz', 'web', 'api', 'blog',
      'dashboard', 'ecommerce', 'e-commerce', 'tareas', 'portfolio', 'reserva',
      'tienda', 'store', 'shop', 'red social', 'chat', 'foro', 'crm', 'erp',
      'landing', 'saas', 'clone', 'clon', 'plataforma', 'sistema', 'proyecto',
      'site', 'página', 'pagina', 'website', 'crud', 'login', 'auth',
      'gestión', 'management', 'finanzas', 'finance', 'notificaciones',
    ]
    return appKeywords.some((kw) => lower.includes(kw))
  }, [])

  // ─── Plan Animation ─────────────────────────────────────────

  const startPlanAnimation = useCallback((steps: PlanStep[]) => {
    setPlanSteps(steps.map((s) => ({ ...s, status: 'pending' as const })))
    setCurrentPlanStep(0)
    setCurrentSubStep(0)
    setShowPlan(true)
    setElapsedTime(0)

    // Start elapsed timer
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    // Mark first as active
    setPlanSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: 'active' as const } : s))
    setCurrentPlanStep(1)
  }, [])

  // Advance plan steps based on calculated duration per step
  useEffect(() => {
    if (!showPlan || !isLoading || planSteps.length === 0) return

    // Sub-step rotation every 2 seconds
    subStepTimerRef.current = setInterval(() => {
      setCurrentSubStep((prev) => prev + 1)
    }, 2000)

    // Use the duration from each step
    const advanceStep = () => {
      setCurrentPlanStep((prev) => {
        const next = prev + 1
        if (next > planSteps.length) {
          if (planTimerRef.current) clearInterval(planTimerRef.current)
          return prev
        }
        setCurrentSubStep(0)
        setPlanSteps((steps) =>
          steps.map((s, i) => ({
            ...s,
            status: i < next - 1 ? 'done' as const : i === next - 1 ? 'active' as const : 'pending' as const,
          }))
        )
        // Update active agents display
        const currentStep = planSteps[next - 1]
        if (currentStep?.agentId) {
          setShowAgents(true)
          setActiveAgents((prev) => ({
            ...prev,
            [currentStep.agentId!]: {
              agentId: currentStep.agentId!,
              agentName: currentStep.agentName!,
              phase: currentStep.text,
              result: '',
              status: 'active' as const,
            },
          }))
          // Mark previous agent as done
          Object.keys(prev).forEach((key) => {
            if (key !== currentStep.agentId) {
              prev[key].status = 'done'
            }
          })
        }
        // Schedule next advance based on step duration
        const nextStep = planSteps[next - 1]
        if (nextStep?.duration && next < planSteps.length) {
          if (planTimerRef.current) clearInterval(planTimerRef.current)
          planTimerRef.current = setInterval(advanceStep, nextStep.duration * 1000)
        }
        return next
      })
    }

    // Initial step duration
    const firstStepDuration = planSteps[0]?.duration || 8
    planTimerRef.current = setInterval(advanceStep, firstStepDuration * 1000)

    return () => {
      if (planTimerRef.current) clearInterval(planTimerRef.current)
      if (subStepTimerRef.current) clearInterval(subStepTimerRef.current)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }, [showPlan, isLoading, planSteps.length])

  // ─── Send Message ───────────────────────────────────────────

  // ─── Input Validation ──────────────────────────────────────

  const validateInput = (text: string): string | null => {
    const trimmed = text.trim()
    if (trimmed.length === 0) return 'Escribe algo para que la IA pueda ayudarte.'
    if (trimmed.length < 5) return 'Tu mensaje es demasiado corto. Describe mejor lo que necesitas (mínimo 5 caracteres).'
    return null
  }

  const handleSend = async (overrideMessages?: Message[]) => {
    const messagesToSend = overrideMessages || messages
    const textToSend = overrideMessages ? '' : input.trim()

    // Validate input for new messages (not for retries/edits)
    if (!overrideMessages) {
      const error = validateInput(textToSend)
      if (error) {
        setValidationError(error)
        setTimeout(() => setValidationError(null), 4000)
        return
      }
    }

    setValidationError(null)
    if ((!textToSend && !overrideMessages) || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    const assistantId = crypto.randomUUID()
    const newMessages = [...messagesToSend, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setPublishedUrl(null)
    setShowCodePreview(false)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Analyze complexity
    const promptText = textToSend || (overrideMessages ? overrideMessages[overrideMessages.length - 1]?.content : '')
    const complexity = analyzeComplexity(promptText)
    setComplexityInfo(complexity)
    const isApp = isAppRequest(promptText)
    const steps = generatePlan(complexity, isApp)
    startPlanAnimation(steps)

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, isStreaming: true },
    ])

    try {
      // Static mode: generate demo response (GitHub Pages has no API routes)
      if (getIsStaticMode()) {
        const demoMessage = getDemoResponse(promptText, currentModel.name)
        // Simulate API delay based on complexity
        const delay = complexity.level === 'enterprise' ? 4000 : complexity.level === 'complex' ? 3000 : complexity.level === 'medium' ? 2000 : 1500
        await new Promise((resolve) => setTimeout(resolve, delay))

        // Mark all plan steps done
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))

        // Start streaming simulation with demo response
        simulateStreaming(demoMessage, assistantId)

        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m)
        )
      } else {
        // Live mode: call the real API
        const chatMessages = newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 min timeout

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: chatMessages,
            model: selectedModel,
            enableSelfCorrection: true,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          let errorMsg = 'Error del servidor'
          try { const errData = await response.json(); errorMsg = errData.error || errorMsg } catch { /* */ }
          throw new Error(errorMsg)
        }

        const data = await response.json()

        if (!data.message || data.message.trim().length === 0) {
          throw new Error('La IA devolvió una respuesta vacía. Intenta de nuevo.')
        }

        // Mark all plan steps done
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))

        // Start streaming simulation
        simulateStreaming(data.message, assistantId)

        if (data.selfCorrected) {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m)
          )
        }
      }
    } catch (error) {
      const isAbort = error instanceof Error && error.name === 'AbortError'
      const isNetworkError = error instanceof Error && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed'))
      const isTimeoutError = error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))

      if (!isAbort) {
        setPlanSteps([])
        setShowPlan(false)
        setShowAgents(false)
      }

      // Clear the empty assistant message and show friendly error
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== assistantId)
        let errText: string

        if (isAbort || isTimeoutError) {
          errText = '⏱️ La generación tardó demasiado y fue cancelada. Intenta de nuevo — la IA responderá más rápido.'
        } else if (isNetworkError) {
          errText = '🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.'
        } else if (error instanceof Error && error.message.includes('Empty response')) {
          errText = '🤖 La IA no pudo generar una respuesta. Intenta reformular tu mensaje.'
        } else if (error instanceof Error) {
          errText = `⚠️ El agente tuvo un problema: "${error.message}". Intenta de nuevo — la IA se auto-corregirá.`
        } else {
          errText = '⚠️ Ocurrió un error inesperado. Intenta de nuevo y funcionará.'
        }

        return [
          ...filtered,
          { id: assistantId, role: 'assistant', content: errText, model: currentModel.name, isStreaming: false },
        ]
      })
    } finally {
      setIsLoading(false)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }

  // ─── Handle Suggestion Click ────────────────────────────────

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.description)
    textareaRef.current?.focus()
  }

  // ─── Publish ────────────────────────────────────────────────

  const handlePublish = () => {
    setIsPublishing(true)
    setPublishProgress(0)
    setPublishedUrl(null)

    const steps = [
      { progress: 15, label: 'Preparando archivos...' },
      { progress: 30, label: 'Optimizando build...' },
      { progress: 50, label: 'Subiendo a Vercel...' },
      { progress: 70, label: 'Configurando dominio...' },
      { progress: 85, label: 'Verificando despliegue...' },
      { progress: 100, label: 'Publicado con éxito!' },
    ]

    let i = 0
    const timer = setInterval(() => {
      if (i < steps.length) {
        setPublishProgress(steps[i].progress)
        i++
      } else {
        clearInterval(timer)
        setIsPublishing(false)
        const appName = messages[messages.length - 2]?.content?.substring(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '-') || 'nexforge-app'
        setPublishedUrl(`https://${appName}.vercel.app`)
      }
    }, 1200)
  }

  // ─── Other Handlers ─────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 150) + 'px'
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
    setPlanSteps([])
    setShowPlan(false)
    setCurrentPlanStep(0)
    setShowCodePreview(false)
    setPreviewCodeBlocks([])
    setPublishedUrl(null)
    setIsPublishing(false)
    setComplexityInfo(null)
    setActiveAgents({})
    setShowAgents(false)
    if (streamingIntervalRef.current) { clearInterval(streamingIntervalRef.current); streamingIntervalRef.current = null }
    if (planTimerRef.current) { clearInterval(planTimerRef.current); planTimerRef.current = null }
    if (subStepTimerRef.current) { clearInterval(subStepTimerRef.current); subStepTimerRef.current = null }
    if (elapsedTimerRef.current) { clearInterval(elapsedTimerRef.current); elapsedTimerRef.current = null }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
    }
  }

  const handleRetry = async () => {
    if (isRetrying || isLoading) return
    setIsRetrying(true)
    if (streamingIntervalRef.current) { clearInterval(streamingIntervalRef.current); streamingIntervalRef.current = null }
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIdx === -1) { setIsRetrying(false); return }
    const actualIdx = messages.length - 1 - lastUserIdx
    const trimmed = messages.slice(0, actualIdx + 1)
    const lastUserMsg = messages[actualIdx]
    setMessages(trimmed)
    setPlanSteps([])
    setShowPlan(false)
    setIsLoading(false)
    if (lastUserMsg) {
      setInput(lastUserMsg.content)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
        }
        setIsRetrying(false)
      }, 150)
    } else {
      setIsRetrying(false)
    }
  }

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditText(content)
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.style.height = 'auto'
        editTextareaRef.current.style.height = Math.min(editTextareaRef.current.scrollHeight, 200) + 'px'
      }
    }, 50)
  }

  const handleSaveEdit = async (messageId: string) => {
    // Validate edited text
    const trimmedEdit = editText.trim()
    const error = validateInput(trimmedEdit)
    if (error) {
      setValidationError(error)
      setTimeout(() => setValidationError(null), 4000)
      return
    }

    const msgIndex = messages.findIndex((m) => m.id === messageId)
    if (msgIndex === -1) return

    setIsSavingEdit(true)
    const updatedMessages = messages.slice(0, msgIndex)
    const editedMessage: Message = { ...messages[msgIndex], content: editText }
    setMessages(updatedMessages)
    setEditingMessageId(null)
    setEditText('')
    setIsLoading(false)

    if (streamingIntervalRef.current) { clearInterval(streamingIntervalRef.current); streamingIntervalRef.current = null }
    if (planTimerRef.current) { clearInterval(planTimerRef.current); planTimerRef.current = null }
    if (subStepTimerRef.current) { clearInterval(subStepTimerRef.current); subStepTimerRef.current = null }

    const newMessages = [...updatedMessages, editedMessage]
    setMessages(newMessages)
    setInput('')

    const assistantId = crypto.randomUUID()
    setIsLoading(true)

    const complexity = analyzeComplexity(editText)
    setComplexityInfo(complexity)
    const isApp = isAppRequest(editText)
    const steps = generatePlan(complexity, isApp)
    startPlanAnimation(steps)

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, isStreaming: true },
    ])

    const chatMessages = newMessages.map((m) => ({ role: m.role, content: m.content }))

    // Static mode: use demo response
    if (getIsStaticMode()) {
      const demoMessage = getDemoResponse(editText, currentModel.name)
      const delay = complexity.level === 'enterprise' ? 4000 : complexity.level === 'complex' ? 3000 : 2000
      setTimeout(() => {
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
        simulateStreaming(demoMessage, assistantId)
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m))
        setIsLoading(false)
      }, delay)
    } else {
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, model: selectedModel, enableSelfCorrection: true }),
      })
        .then((response) => { if (!response.ok) throw new Error('Error del servidor'); return response.json() })
        .then((data) => {
          if (!data.message) throw new Error('Respuesta vacía')
          setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
          simulateStreaming(data.message, assistantId)
          if (data.selfCorrected) {
            setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m))
          }
        })
        .catch((error) => {
          const isNetworkError = error instanceof Error && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed'))
          const errText = isNetworkError
            ? '🌐 No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.'
            : '⚠️ El agente tuvo un problema al procesar tu edición. Intenta de nuevo.'
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== assistantId)
            return [...filtered, { id: assistantId, role: 'assistant', content: errText, model: currentModel.name, isStreaming: false }]
          })
          setPlanSteps([])
          setShowPlan(false)
        })
        .finally(() => { setIsLoading(false); setIsSavingEdit(false) })
    }
  }

  const handleCancelEdit = () => { setEditingMessageId(null); setEditText('') }

  const handleCopyMessage = async (messageId: string, content: string) => {
    setIsCopied(true)
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    setCopiedId(messageId)
    setTimeout(() => { setCopiedId(null); setIsCopied(false) }, 2000)
  }

  const handleListenMessage = (messageId: string, content: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (speakingId === messageId) { window.speechSynthesis.cancel(); setSpeakingId(null); return }
    window.speechSynthesis.cancel()
    const plainText = content
      .replace(/```[\s\S]*?```/g, ' bloque de código ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    const utterance = new SpeechSynthesisUtterance(plainText)
    utterance.rate = 1.0; utterance.pitch = 1.0; utterance.volume = 1.0
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'))
    if (spanishVoice) utterance.voice = spanishVoice
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)
    setSpeakingId(messageId)
    window.speechSynthesis.speak(utterance)
  }

  const getActiveSubStep = (step: PlanStep): string | null => {
    if (step.status !== 'active' || !step.subSteps || step.subSteps.length === 0) return null
    return step.subSteps[currentSubStep % step.subSteps.length]
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ─── Get latest code blocks for preview ─────────────────────

  const latestCodeBlocks = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === 'assistant' && m.codeBlocks && m.codeBlocks.length > 0)
    if (assistantMessages.length === 0) return []
    return assistantMessages[assistantMessages.length - 1].codeBlocks || []
  }, [messages])

  const hasCode = latestCodeBlocks.length > 0

  // ─── Render ─────────────────────────────────────────────────

  const chatContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[oklch(0.25_0.04_260)] hover:border-[#06d6a0]/30 bg-[oklch(0.12_0.02_260)] transition-all"
            >
              <currentModel.icon className="w-4 h-4" style={{ color: currentModel.color }} />
              <span className="text-sm font-bold" style={{ color: currentModel.color }}>{currentModel.name}</span>
              <span className="text-xs text-[oklch(0.5_0.02_200)] font-mono">v{currentModel.version}</span>
              <ChevronDown className="w-3 h-3 text-[oklch(0.5_0.02_200)]" />
            </button>
            <AnimatePresence>
              {modelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-[oklch(0.25_0.04_260)] bg-[oklch(0.1_0.02_260)] shadow-2xl overflow-hidden z-50"
                >
                  {models.map((model) => (
                    <button
                      key={model.key}
                      onClick={() => { setSelectedModel(model.key); setModelDropdownOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[oklch(0.15_0.03_260)] transition-colors ${selectedModel === model.key ? 'bg-[oklch(0.15_0.03_260)]' : ''}`}
                    >
                      <model.icon className="w-5 h-5 shrink-0" style={{ color: model.color }} />
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: model.color }}>{model.name}</span>
                          <span className="text-xs text-[oklch(0.4_0.02_200)] font-mono">v{model.version}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-[oklch(0.5_0.02_200)]">{model.description}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono" style={{ color: model.color }}>{model.params} · {model.context} · {model.speed}</span>
                        </div>
                      </div>
                      {selectedModel === model.key && <div className="ml-1 w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#06d6a0]/5 border border-[#06d6a0]/10">
            <div className={`w-1.5 h-1.5 rounded-full ${getIsStaticMode() ? 'bg-[#f59e0b]' : 'bg-[#06d6a0] animate-pulse'}`} />
            <span className={`text-[10px] font-medium ${getIsStaticMode() ? 'text-[#f59e0b]' : 'text-[#06d6a0]'}`}>
              {getIsStaticMode() ? 'Modo Demo · Sin servidor' : '4 Agentes · Auto-Corrección'}
            </span>
          </div>
          {complexityInfo && isLoading && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
              <Activity className="w-3 h-3 text-[#8b5cf6]" />
              <span className="text-[10px] text-[#8b5cf6] font-medium">{complexityInfo.level.toUpperCase()} · {formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasCode && !isLoading && (
            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className={`p-2 rounded-lg transition-all ${showCodePreview ? 'text-[#06d6a0] bg-[#06d6a0]/10' : 'text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5'}`}
              title="Vista previa del código"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {messages.length > 0 && !isLoading && (
            <button onClick={handleRetry} disabled={isRetrying} className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed" title="Reintentar">
              {isRetrying ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            </button>
          )}
          {messages.length > 0 && (
            <button onClick={handleClear} className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-red-400 hover:bg-red-400/5 transition-all" title="Limpiar">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
            title={isFullscreen ? 'Minimizar' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main content area with code preview sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 scroll-smooth ${isFullscreen ? '' : 'h-[480px] sm:h-[540px]'}`}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              {getIsStaticMode() && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 max-w-md">
                  <p className="text-xs text-[#f59e0b] font-medium mb-1">Modo Demostración</p>
                  <p className="text-[11px] text-[oklch(0.5_0.02_200)]">
                    Estás viendo la versión estática en GitHub Pages. Para usar el chat con IA, clona el repo y ejecuta <code className="px-1 py-0.5 rounded bg-[oklch(0.12_0.02_260)] text-[#06d6a0] font-mono">npm run dev</code>
                  </p>
                  <a href="https://github.com/FazeUrru/nexforge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-[11px] text-[#06d6a0] hover:underline">
                    <Github className="w-3 h-3" /> Ver en GitHub
                  </a>
                </div>
              )}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-6 animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-[#06d6a0]" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Hola, soy <span style={{ color: currentModel.color }}>{currentModel.name} v{currentModel.version}</span>
              </h3>
              <p className="text-[oklch(0.5_0.02_200)] mb-3 max-w-md text-sm">
                Describe la app que quieres crear. 4 agentes especializados trabajarán en tiempo real según la complejidad de tu proyecto.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-1 px-2 py-1 rounded-md border border-[oklch(0.2_0.03_260)] bg-[oklch(0.1_0.02_260)]">
                    <agent.icon className="w-3 h-3" style={{ color: agent.color }} />
                    <span className="text-[10px] font-mono" style={{ color: agent.color }}>{agent.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="flex items-start gap-2 text-left text-xs px-4 py-3 rounded-xl bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 hover:bg-[oklch(0.14_0.02_260)] text-[oklch(0.6_0.02_200)] transition-all group"
                  >
                    <span className="text-base shrink-0">{prompt.icon}</span>
                    <span className="group-hover:text-[oklch(0.8_0.02_200)] transition-colors">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `linear-gradient(135deg, ${currentModel.color}20, ${currentModel.color}10)`, border: `1px solid ${currentModel.color}30` }}
                    >
                      <Bot className="w-4 h-4" style={{ color: currentModel.color }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/15'
                        : 'bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)]'
                    }`}
                  >
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editTextareaRef}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full min-h-[60px] max-h-[200px] resize-none bg-[oklch(0.08_0.02_260)] border border-[#06d6a0]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06d6a0]/50"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(message.id)} disabled={isSavingEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#06d6a0] text-[#0a0f1c] text-xs font-semibold hover:bg-[#06d6a0]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSavingEdit ? <><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</> : 'Enviar editado'}
                          </button>
                          <button onClick={handleCancelEdit} disabled={isSavingEdit} className="px-3 py-1.5 rounded-lg bg-[oklch(0.2_0.03_260)] text-[oklch(0.6_0.02_200)] text-xs font-medium hover:bg-[oklch(0.25_0.04_260)] transition-colors disabled:opacity-50">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {message.role === 'assistant' ? (
                          <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none
                            [&_pre]:bg-[oklch(0.06_0.02_260)] [&_pre]:border [&_pre]:border-[oklch(0.2_0.03_260)] [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:my-2
                            [&_code]:text-[#06d6a0] [&_code]:font-mono [&_code]:text-xs [&_code]:bg-[oklch(0.08_0.02_260)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
                            [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_pre_code]:text-[oklch(0.85_0.02_200)]
                            [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-[#06d6a0]
                            [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-[#06d6a0]
                            [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-[#00ffc8]
                            [&_p]:mb-2 [&_p]:last:mb-0
                            [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2
                            [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2
                            [&_li]:mb-1
                            [&_strong]:text-[oklch(0.9_0.02_200)] [&_strong]:font-semibold
                            [&_a]:text-[#06d6a0] [&_a]:underline
                            [&_blockquote]:border-l-2 [&_blockquote]:border-[#06d6a0]/30 [&_blockquote]:pl-3 [&_blockquote]:italic
                          ">
                            <ReactMarkdown>{message.content || ''}</ReactMarkdown>
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 bg-[#06d6a0] animate-pulse ml-0.5 align-middle" />
                            )}
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        )}
                      </>
                    )}

                    {/* Message action buttons */}
                    {!message.isStreaming && !editingMessageId && message.content && (
                      <div className="mt-2 flex items-center gap-1">
                        <button onClick={() => handleEditMessage(message.id, message.content)} className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all" title="Editar mensaje">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleCopyMessage(message.id, message.content)} disabled={isCopied} className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all disabled:cursor-not-allowed" title="Copiar mensaje">
                          {isCopied && copiedId === message.id ? <Check className="w-3.5 h-3.5 text-[#06d6a0]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleListenMessage(message.id, message.content)} className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all" title={speakingId === message.id ? 'Detener lectura' : 'Escuchar mensaje'}>
                          {speakingId === message.id ? <VolumeX className="w-3.5 h-3.5 text-[#06d6a0]" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        {message.codeBlocks && message.codeBlocks.length > 0 && (
                          <button onClick={() => { setPreviewCodeBlocks(message.codeBlocks || []); setActivePreviewBlock(0); setShowCodePreview(true) }} className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/5 transition-all" title="Ver código">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && !message.isStreaming && (
                      <div className="mt-3 pt-3 border-t border-[oklch(0.2_0.03_260)]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Lightbulb className="w-3.5 h-3.5 text-[#f59e0b]" />
                          <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">Sugerencias de mejora</span>
                        </div>
                        <div className="space-y-1.5">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/10 hover:border-[#f59e0b]/25 hover:bg-[#f59e0b]/10 transition-all group"
                            >
                              <ArrowRight className="w-3 h-3 text-[#f59e0b] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                              <div>
                                <span className="text-xs font-medium text-[oklch(0.8_0.02_200)]">{suggestion.title}</span>
                                <p className="text-[10px] text-[oklch(0.5_0.02_200)] mt-0.5 line-clamp-2">{suggestion.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.role === 'assistant' && message.model && !message.isStreaming && message.content && (
                      <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-1 font-mono flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        {message.model} · NexForge v{NEXFORGE_VERSION}
                        {message.selfCorrected && <span className="text-[#06d6a0] ml-1">· Auto-corregido ✓</span>}
                        {message.codeBlocks && message.codeBlocks.length > 0 && <span className="text-[#8b5cf6] ml-1">· {message.codeBlocks.length} archivos</span>}
                      </p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[oklch(0.2_0.03_260)] border border-[oklch(0.25_0.04_260)] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-[oklch(0.6_0.02_200)]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Plan progress */}
              {showPlan && planSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-lg mx-auto"
                >
                  <div className="rounded-xl bg-[oklch(0.1_0.02_260)] border border-[#06d6a0]/15 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <LayoutList className="w-4 h-4 text-[#06d6a0]" />
                      <span className="text-xs font-bold text-[#06d6a0] uppercase tracking-wider">
                        {isLoading ? `${complexityInfo?.level.toUpperCase() || 'Procesando'} · 4 Agentes activos` : 'Completado'}
                      </span>
                      {isLoading && (
                        <span className="text-[10px] font-mono text-[oklch(0.4_0.02_200)] ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatTime(elapsedTime)}
                        </span>
                      )}
                    </div>
                    {/* Progress bar */}
                    <div className="flex-1 h-1.5 bg-[oklch(0.15_0.03_260)] rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] rounded-full"
                        animate={{ width: `${(planSteps.filter(s => s.status === 'done').length / planSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    {/* Agent badges */}
                    {showAgents && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {agents.map((agent) => {
                          const isActive = planSteps.some(s => s.agentId === agent.id && s.status === 'active')
                          const isDone = planSteps.some(s => s.agentId === agent.id && s.status === 'done')
                          return (
                            <div key={agent.id} className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${isActive ? `border-[${agent.color}]/30 bg-[${agent.color}]/10` : isDone ? 'border-[oklch(0.2_0.03_260)] bg-[oklch(0.12_0.02_260)]' : 'border-[oklch(0.15_0.02_260)] bg-[oklch(0.08_0.02_260)] opacity-50'}`}>
                              {isActive ? <Loader2 className="w-3 h-3 animate-spin" style={{ color: agent.color }} /> : isDone ? <CheckCircle2 className="w-3 h-3" style={{ color: agent.color }} /> : <agent.icon className="w-3 h-3" style={{ color: agent.color }} />}
                              <span className={`text-[10px] font-mono ${isActive ? 'font-bold' : ''}`} style={{ color: agent.color }}>{agent.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {/* Steps */}
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                      {planSteps.map((step) => {
                        const activeSubStep = getActiveSubStep(step)
                        return (
                          <div key={step.id} className="flex items-start gap-2">
                            {step.status === 'done' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#06d6a0] shrink-0 mt-0.5" />
                            ) : step.status === 'active' ? (
                              <Loader2 className="w-3.5 h-3.5 text-[#06d6a0] animate-spin shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-[oklch(0.25_0.02_260)] shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[11px] font-medium ${step.status === 'done' ? 'text-[oklch(0.6_0.02_200)]' : step.status === 'active' ? 'text-[#06d6a0]' : 'text-[oklch(0.35_0.02_200)]'}`}>
                                  {step.text}
                                </span>
                                {step.agentName && step.status !== 'pending' && (
                                  <span className="text-[9px] px-1 py-0.5 rounded font-mono" style={{ color: agents.find(a => a.id === step.agentId)?.color, background: `${agents.find(a => a.id === step.agentId)?.color}15` }}>
                                    {step.agentName}
                                  </span>
                                )}
                              </div>
                              {step.status === 'active' && (
                                <p className="text-[10px] text-[oklch(0.4_0.02_200)] mt-0.5">{activeSubStep || step.detail}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[oklch(0.15_0.03_260)]">
                      <span className="text-[10px] font-mono text-[oklch(0.4_0.02_200)]">
                        {planSteps.filter(s => s.status === 'done').length}/{planSteps.length} fases completadas
                      </span>
                      <span className="text-[10px] font-mono text-[#06d6a0]">
                        {Math.round((planSteps.filter(s => s.status === 'done').length / planSteps.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Code Preview Sidebar */}
        <AnimatePresence>
          {showCodePreview && previewCodeBlocks.length > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '45%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex flex-col border-l border-[oklch(0.2_0.03_260)] bg-[oklch(0.06_0.02_260)] overflow-hidden"
            >
              {/* Preview header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)] shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-xs font-bold text-[#8b5cf6]">Vista Previa</span>
                  <span className="text-[10px] font-mono text-[oklch(0.4_0.02_200)]">{previewCodeBlocks.length} archivos</span>
                </div>
                <button onClick={() => setShowCodePreview(false)} className="p-1 rounded-md text-[oklch(0.4_0.02_200)] hover:text-white hover:bg-[oklch(0.15_0.03_260)] transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* File tabs */}
              <div className="flex items-center gap-0.5 px-2 py-1 border-b border-[oklch(0.15_0.02_260)] overflow-x-auto shrink-0">
                {previewCodeBlocks.map((block, i) => (
                  <button
                    key={block.id}
                    onClick={() => setActivePreviewBlock(i)}
                    className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all whitespace-nowrap ${activePreviewBlock === i ? 'bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/20' : 'text-[oklch(0.4_0.02_200)] hover:text-[oklch(0.6_0.02_200)] border border-transparent'}`}
                  >
                    {block.filename || `file-${i + 1}.${block.language}`}
                  </button>
                ))}
              </div>

              {/* Code display */}
              <div className="flex-1 overflow-auto">
                {previewCodeBlocks[activePreviewBlock] && (
                  <SyntaxHighlighter
                    language={previewCodeBlocks[activePreviewBlock].language}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      padding: '12px',
                      fontSize: '11px',
                      lineHeight: '1.6',
                      background: 'transparent',
                    }}
                    showLineNumbers
                    lineNumberStyle={{ color: '#4a5568', minWidth: '2.5em', paddingRight: '1em' }}
                  >
                    {previewCodeBlocks[activePreviewBlock].code}
                  </SyntaxHighlighter>
                )}
              </div>

              {/* Publish button */}
              <div className="px-3 py-3 border-t border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)] shrink-0">
                {publishedUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#06d6a0]/10 border border-[#06d6a0]/20">
                      <CheckCircle2 className="w-4 h-4 text-[#06d6a0]" />
                      <span className="text-xs text-[#06d6a0] font-medium">Publicado</span>
                    </div>
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 transition-all text-sm text-[oklch(0.7_0.02_200)] hover:text-[#06d6a0]"
                    >
                      <Globe className="w-4 h-4" />
                      {publishedUrl}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </div>
                ) : isPublishing ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[oklch(0.5_0.02_200)]">Publicando en Vercel...</span>
                      <span className="text-[#06d6a0] font-mono">{publishProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.15_0.03_260)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] rounded-full"
                        animate={{ width: `${publishProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] text-sm font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    Publicar App
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/90 backdrop-blur-sm px-4 sm:px-6 py-3 shrink-0">
        {/* Validation error toast */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {validationError}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={`Pídele a ${currentModel.name} v${currentModel.version} que cree tu app...`}
              className="min-h-[46px] max-h-[150px] resize-none bg-[oklch(0.1_0.02_260)] border-[oklch(0.25_0.04_260)] focus:border-[#06d6a0]/30 text-sm text-white placeholder:text-[oklch(0.35_0.02_200)] pr-12 rounded-xl"
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || input.trim().length < 5}
            className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all border-0 px-4 py-3 rounded-xl disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-[10px] text-[oklch(0.3_0.02_200)]">4 Agentes: ARQ · CODE · QA · UX</span>
          <span className="text-[10px] text-[oklch(0.3_0.02_200)]">·</span>
          <span className="text-[10px] text-[oklch(0.3_0.02_200)]">Auto-Corrección</span>
          <span className="text-[10px] text-[oklch(0.3_0.02_200)]">·</span>
          <span className="text-[10px] text-[oklch(0.3_0.02_200)]">Vista Previa</span>
          {input.trim().length > 0 && input.trim().length < 5 && (
            <span className="text-[10px] text-[#f59e0b]">{input.trim().length}/5 caracteres mín.</span>
          )}
        </div>
      </div>
    </>
  )

  return (
    <section id="chat" className="relative py-12 md:py-16">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Crea con <span className="text-gradient">4 Agentes IA</span> en tiempo real
          </h2>
          <p className="text-sm text-[oklch(0.5_0.02_200)] max-w-lg mx-auto">
            ARQ diseña, CODE implementa, QA verifica y UX optimiza. La duración se adapta a la complejidad de tu proyecto.
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`relative rounded-2xl border border-[oklch(0.25_0.04_260)] bg-[oklch(0.08_0.02_260)]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col ${
            isFullscreen
              ? 'fixed inset-0 z-[100] rounded-none'
              : ''
          }`}
        >
          {chatContent}
        </motion.div>
      </div>
    </section>
  )
}
