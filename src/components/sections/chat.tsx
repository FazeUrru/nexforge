'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Cpu, Brain, Rocket, Send, RotateCcw, Sparkles, Trash2,
  ChevronDown, Bot, User, X, Maximize2, Minimize2,
  Zap, CheckCircle2, Circle, Loader2, Code2, LayoutList, Play,
  FileCode2, Database, Shield, Palette, Server, RocketIcon,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  isStreaming?: boolean
}

interface PlanStep {
  id: number
  icon: typeof Cpu
  text: string
  detail: string
  status: 'pending' | 'active' | 'done'
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

const models: ModelOption[] = [
  {
    key: 'koda-0.9',
    name: 'KODA',
    version: '0.9',
    icon: Cpu,
    color: '#06d6a0',
    description: 'Full-stack avanzado',
    speed: '65 tok/s',
    params: '20B',
    context: '192K',
  },
  {
    key: 'nova-0.7',
    name: 'NOVA',
    version: '0.7',
    icon: Brain,
    color: '#00ffc8',
    description: 'Equilibrado y brillante',
    speed: '110 tok/s',
    params: '12B',
    context: '96K',
  },
  {
    key: 'flux-0.5',
    name: 'FLUX',
    version: '0.5',
    icon: Rocket,
    color: '#10b981',
    description: 'Velocidad extrema',
    speed: '200 tok/s',
    params: '5B',
    context: '64K',
  },
]

const suggestedPrompts = [
  { icon: '🛒', text: 'Crea una app de e-commerce con carrito y pagos' },
  { icon: '📊', text: 'Genera un dashboard con gráficos en tiempo real' },
  { icon: '📝', text: 'Haz un blog con CMS y sistema de comentarios' },
  { icon: '✅', text: 'Crea una app de tareas con auth y base de datos' },
  { icon: '🌐', text: 'Genera una API REST para reservas con Prisma' },
  { icon: '🎨', text: 'Haz un portfolio con animaciones y dark mode' },
]

// Full planning steps for app creation
const appPlanSteps: PlanStep[] = [
  { id: 1, icon: LayoutList, text: 'Analizando requisitos', detail: 'Detectando tipo de app, features y stack...', status: 'pending' },
  { id: 2, icon: Database, text: 'Diseñando modelo de datos', detail: 'Tablas, relaciones, índices, migraciones...', status: 'pending' },
  { id: 3, icon: Shield, text: 'Configurando autenticación', detail: 'NextAuth, OAuth, sesiones, roles...', status: 'pending' },
  { id: 4, icon: Server, text: 'Creando API routes', detail: 'Endpoints REST, validación, middleware...', status: 'pending' },
  { id: 5, icon: Palette, text: 'Construyendo componentes UI', detail: 'Layouts, páginas, forms, modales...', status: 'pending' },
  { id: 6, icon: FileCode2, text: 'Implementando lógica de negocio', detail: 'Servicios, utils, hooks, state...', status: 'pending' },
  { id: 7, icon: RocketIcon, text: 'Finalizando y documentando', detail: 'Deploy config, README, tests...', status: 'pending' },
]

const simplePlanSteps: PlanStep[] = [
  { id: 1, icon: LayoutList, text: 'Procesando solicitud', detail: 'Analizando el mensaje...', status: 'pending' },
  { id: 2, icon: FileCode2, text: 'Generando respuesta', detail: 'Pensando la mejor solución...', status: 'pending' },
]

const NEXFORGE_VERSION = '0.3.0'

export function ChatSection() {
  const [selectedModel, setSelectedModel] = useState<string>('koda-0.9')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([])
  const [showPlan, setShowPlan] = useState(false)
  const [currentPlanStep, setCurrentPlanStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentModel = models.find((m) => m.key === selectedModel)!

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, planSteps, scrollToBottom])

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
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current)
    }
  }, [])

  const simulateStreaming = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(/(\s+)/)
    let current = 0
    const speed = selectedModel === 'flux-0.5' ? 6 : selectedModel === 'nova-0.7' ? 10 : 14

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
        setMessages((prev) =>
          prev.map((m) => m.id === messageId ? { ...m, isStreaming: false } : m)
        )
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
        setShowPlan(false)
      }
    }, speed)

    streamingIntervalRef.current = interval
    return interval
  }, [selectedModel])

  const isAppRequest = useCallback((text: string): boolean => {
    const lower = text.toLowerCase()
    const appKeywords = [
      'app', 'aplicaci', 'crea', 'genera', 'haz', 'web', 'api', 'blog',
      'dashboard', 'ecommerce', 'e-commerce', 'tareas', 'portfolio', 'reserva',
      'tienda', 'store', 'shop', 'red social', 'chat', 'foro', 'crm', 'erp',
      'landing', 'saas', 'clone', 'clon', 'plataforma', 'sistema', 'proyecto',
      'site', 'página', 'pagina', 'website', 'crud', 'login', 'auth',
    ]
    return appKeywords.some((kw) => lower.includes(kw))
  }, [])

  const startPlanAnimation = useCallback((steps: PlanStep[]) => {
    setPlanSteps(steps.map((s) => ({ ...s, status: 'pending' as const })))
    setCurrentPlanStep(0)
    setShowPlan(true)

    // Mark first as active immediately
    setPlanSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: 'active' as const } : s))
    setCurrentPlanStep(1)
  }, [])

  // Advance plan steps on a longer timer while waiting for AI
  useEffect(() => {
    if (!showPlan || !isLoading || planSteps.length === 0) return

    const timer = setInterval(() => {
      setCurrentPlanStep((prev) => {
        const next = prev + 1
        if (next > planSteps.length) {
          clearInterval(timer)
          return prev
        }
        setPlanSteps((steps) =>
          steps.map((s, i) => ({
            ...s,
            status: i < next - 1 ? 'done' as const : i === next - 1 ? 'active' as const : 'pending' as const,
          }))
        )
        return next
      })
    }, 3500) // Each step takes 3.5 seconds - long enough to feel real

    return () => clearInterval(timer)
  }, [showPlan, isLoading, planSteps.length])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    }

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Start planning
    const isApp = isAppRequest(input.trim())
    const steps = isApp ? appPlanSteps : simplePlanSteps
    startPlanAnimation(steps)

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, isStreaming: true },
    ])

    try {
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const controller = new AbortController()
      // 120 second timeout
      const timeoutId = setTimeout(() => controller.abort(), 120000)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, model: selectedModel }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMsg = 'Error del servidor'
        try {
          const errData = await response.json()
          errorMsg = errData.error || errorMsg
        } catch {
          // JSON parse failed
        }
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
    } catch (error) {
      // Don't clear plan on abort if user stopped it
      const isAbort = error instanceof Error && error.name === 'AbortError'
      if (!isAbort) {
        setPlanSteps([])
        setShowPlan(false)
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== assistantId)
        const errText = isAbort
          ? 'Generación cancelada.'
          : error instanceof Error
            ? error.message
            : 'No se pudo conectar con la IA. Reintentando...'
        return [
          ...filtered,
          { id: assistantId, role: 'assistant', content: errText, model: currentModel.name, isStreaming: false },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
  }

  const handleRetry = async () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIdx === -1) return
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
      }, 50)
    }
  }

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
                          <span className="text-[10px] font-mono" style={{ color: model.color }}>{model.params} · {model.context}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono" style={{ color: model.color }}>{model.speed}</span>
                      </div>
                      {selectedModel === model.key && <div className="ml-1 w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#06d6a0]/5 border border-[#06d6a0]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#06d6a0] animate-pulse" />
            <span className="text-[10px] text-[#06d6a0] font-medium">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && !isLoading && (
            <button onClick={handleRetry} className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all" title="Reintentar">
              <RotateCcw className="w-4 h-4" />
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

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 scroll-smooth ${isFullscreen ? '' : 'h-[480px] sm:h-[540px]'}`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-6 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-[#06d6a0]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Hola, soy <span style={{ color: currentModel.color }}>{currentModel.name} v{currentModel.version}</span>
            </h3>
            <p className="text-[oklch(0.5_0.02_200)] mb-8 max-w-md text-sm">
              Describe la app que quieres crear. Planificaré cada paso, diseñaré la arquitectura y generaré el código completo en tiempo real.
            </p>
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
                  {message.role === 'assistant' && message.model && !message.isStreaming && message.content && (
                    <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-2 font-mono flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      {message.model} · NexForge v{NEXFORGE_VERSION}
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
                <div className="rounded-xl bg-[oklch(0.1_0.02_260)] border border-[#06d6a0]/15 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutList className="w-4 h-4 text-[#06d6a0]" />
                    <span className="text-xs font-bold text-[#06d6a0] uppercase tracking-wider">
                      {isLoading ? 'Planificando' : 'Completado'}
                    </span>
                    <div className="flex-1 h-1.5 bg-[oklch(0.15_0.03_260)] rounded-full overflow-hidden ml-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] rounded-full"
                        animate={{ width: `${(planSteps.filter(s => s.status === 'done').length / planSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#06d6a0]">
                      {planSteps.filter(s => s.status === 'done').length}/{planSteps.length}
                    </span>
                  </div>
                  {planSteps.map((step) => (
                    <div key={step.id} className="flex items-start gap-2.5">
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#06d6a0] shrink-0 mt-0.5" />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-4 h-4 text-[#06d6a0] animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[oklch(0.25_0.02_260)] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`text-xs font-medium ${step.status === 'done' ? 'text-[oklch(0.6_0.02_200)]' : step.status === 'active' ? 'text-[#06d6a0]' : 'text-[oklch(0.35_0.02_200)]'}`}>
                          {step.text}
                        </span>
                        {step.status === 'active' && (
                          <p className="text-[10px] text-[oklch(0.4_0.02_200)] mt-0.5">{step.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/90 backdrop-blur-sm px-4 sm:px-6 py-3 shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={`Pídele a ${currentModel.name} v${currentModel.version} que cree tu app...`}
              className="min-h-[46px] max-h-[150px] resize-none bg-[oklch(0.12_0.02_260)] border-[oklch(0.25_0.04_260)] focus:border-[#06d6a0]/40 focus:ring-[#06d6a0]/20 text-sm rounded-xl pr-4 placeholder:text-[oklch(0.4_0.02_200)]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          {isLoading ? (
            <Button
              onClick={handleClear}
              className="bg-red-500/80 hover:bg-red-500 text-white font-semibold border-0 rounded-xl h-[46px] w-[46px] p-0 transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-bold border-0 rounded-xl h-[46px] w-[46px] p-0 hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all disabled:opacity-40 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 max-w-4xl mx-auto">
          <p className="text-[10px] text-[oklch(0.35_0.02_200)]">
            Enter para enviar · Shift+Enter nueva línea
          </p>
          <div className="flex items-center gap-2 text-[10px] text-[oklch(0.3_0.02_200)]">
            <Code2 className="w-3 h-3" />
            <span>NexForge v{NEXFORGE_VERSION}</span>
            <span>·</span>
            <span>100% Gratis</span>
            <span>·</span>
            <span>OpenSource</span>
          </div>
        </div>
      </div>
    </>
  )

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] flex flex-col bg-[oklch(0.08_0.02_260)]"
      >
        {chatContent}
      </motion.div>
    )
  }

  return (
    <section id="chat" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/20 mb-4">
            <Play className="w-4 h-4 text-[#06d6a0]" />
            <span className="text-sm font-medium text-[#06d6a0]">Chat IA en Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Habla con la{' '}
            <span className="text-gradient">IA</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Pídele que cree una app y la IA planificará, diseñará y codificará en tiempo real.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl overflow-hidden border border-[oklch(0.25_0.04_260)] bg-[oklch(0.1_0.02_260)]/80 backdrop-blur flex flex-col"
        >
          {chatContent}
        </motion.div>
      </div>
    </section>
  )
}
