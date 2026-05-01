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
  Copy, Check, Volume2, VolumeX, Pencil, MessageSquare,
  GitBranch, RefreshCw,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  isStreaming?: boolean
  selfCorrected?: boolean
}

interface PlanStep {
  id: number
  icon: typeof Cpu
  text: string
  detail: string
  subSteps?: string[]
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
    key: 'koda-1.1',
    name: 'KODA',
    version: '1.1',
    icon: Cpu,
    color: '#06d6a0',
    description: 'Full-stack avanzado con auto-corrección',
    speed: '72 tok/s',
    params: '24B',
    context: '256K',
  },
  {
    key: 'nova-0.9',
    name: 'NOVA',
    version: '0.9',
    icon: Brain,
    color: '#00ffc8',
    description: 'Equilibrado, brillante y auto-mejorable',
    speed: '120 tok/s',
    params: '14B',
    context: '128K',
  },
  {
    key: 'flux-0.7',
    name: 'FLUX',
    version: '0.7',
    icon: Rocket,
    color: '#10b981',
    description: 'Velocidad extrema + self-check',
    speed: '220 tok/s',
    params: '7B',
    context: '80K',
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

// Extended planning steps for app creation — much more detailed
const appPlanSteps: PlanStep[] = [
  {
    id: 1,
    icon: LayoutList,
    text: 'Analizando requisitos del proyecto',
    detail: 'Detectando tipo de app, features principales, stack tecnológico...',
    subSteps: ['Clasificando tipo de aplicación', 'Identificando features core', 'Seleccionando stack tecnológico', 'Definiendo alcance del proyecto'],
    status: 'pending',
  },
  {
    id: 2,
    icon: Database,
    text: 'Diseñando modelo de datos y esquema',
    detail: 'Tablas, relaciones, índices, migraciones, seed data...',
    subSteps: ['Definiendo entidades principales', 'Estableciendo relaciones entre tablas', 'Creando índices para rendimiento', 'Generando migraciones y seed data'],
    status: 'pending',
  },
  {
    id: 3,
    icon: Shield,
    text: 'Configurando autenticación y autorización',
    detail: 'NextAuth, OAuth providers, sesiones, roles, middleware...',
    subSteps: ['Configurando NextAuth.js', 'Añadiendo providers OAuth', 'Implementando roles y permisos', 'Creando middleware de protección'],
    status: 'pending',
  },
  {
    id: 4,
    icon: Server,
    text: 'Creando API routes y endpoints REST',
    detail: 'Endpoints, validación Zod, middleware, error handling...',
    subSteps: ['Diseñando estructura de endpoints', 'Implementando validación con Zod', 'Añadiendo error handling global', 'Configurando rate limiting'],
    status: 'pending',
  },
  {
    id: 5,
    icon: Palette,
    text: 'Construyendo componentes UI y layouts',
    detail: 'Layouts, páginas, forms, modales, design system...',
    subSteps: ['Creando layout principal y navegación', 'Implementando componentes reutilizables', 'Diseñando forms con validación', 'Añadiendo estados de carga y error'],
    status: 'pending',
  },
  {
    id: 6,
    icon: FileCode2,
    text: 'Implementando lógica de negocio y servicios',
    detail: 'Servicios, utils, hooks, state management, integraciones...',
    subSteps: ['Implementando servicios de negocio', 'Creando custom hooks', 'Configurando state management', 'Añadiendo integraciones externas'],
    status: 'pending',
  },
  {
    id: 7,
    icon: GitBranch,
    text: 'Ejecutando auto-corrección y self-review',
    detail: 'Verificando imports, tipos, errores, edge cases...',
    subSteps: ['Verificando imports completos', 'Comprobando tipos TypeScript', 'Revisando manejo de errores', 'Validando edge cases'],
    status: 'pending',
  },
  {
    id: 8,
    icon: RocketIcon,
    text: 'Finalizando, documentando y preparando deploy',
    detail: 'Deploy config, README, variables de entorno, tests...',
    subSteps: ['Generando configuración de deploy', 'Creando README completo', 'Configurando variables de entorno', 'Preparando tests básicos'],
    status: 'pending',
  },
]

const simplePlanSteps: PlanStep[] = [
  {
    id: 1,
    icon: LayoutList,
    text: 'Procesando solicitud',
    detail: 'Analizando el mensaje y preparando la respuesta...',
    subSteps: ['Interpretando la consulta', 'Accediendo a la base de conocimientos'],
    status: 'pending',
  },
  {
    id: 2,
    icon: RefreshCw,
    text: 'Auto-corrección y verificación',
    detail: 'Revisando la respuesta para asegurar calidad...',
    subSteps: ['Verificando corrección del código', 'Comprobando coherencia'],
    status: 'pending',
  },
  {
    id: 3,
    icon: FileCode2,
    text: 'Generando respuesta optimizada',
    detail: 'Construyendo la respuesta final...',
    subSteps: ['Formateando la salida', 'Aplicando mejoras automáticas'],
    status: 'pending',
  },
]

const NEXFORGE_VERSION = '0.4.0'

export function ChatSection() {
  const [selectedModel, setSelectedModel] = useState<string>('koda-1.1')
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
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

  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current)
    }
  }, [])

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const simulateStreaming = useCallback((fullText: string, messageId: string) => {
    const words = fullText.split(/(\s+)/)
    let current = 0
    const speed = selectedModel === 'flux-0.7' ? 5 : selectedModel === 'nova-0.9' ? 8 : 12

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
    setCurrentSubStep(0)
    setShowPlan(true)

    // Mark first as active immediately
    setPlanSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: 'active' as const } : s))
    setCurrentPlanStep(1)
  }, [])

  // Advance plan steps on a longer timer — each step takes ~8 seconds with sub-step animation
  useEffect(() => {
    if (!showPlan || !isLoading || planSteps.length === 0) return

    // Sub-step rotation every 2 seconds within each main step
    const subStepTimer = setInterval(() => {
      setCurrentSubStep((prev) => prev + 1)
    }, 2000)

    // Main step advance every 8 seconds
    const mainStepTimer = setInterval(() => {
      setCurrentPlanStep((prev) => {
        const next = prev + 1
        if (next > planSteps.length) {
          clearInterval(mainStepTimer)
          clearInterval(subStepTimer)
          return prev
        }
        setCurrentSubStep(0)
        setPlanSteps((steps) =>
          steps.map((s, i) => ({
            ...s,
            status: i < next - 1 ? 'done' as const : i === next - 1 ? 'active' as const : 'pending' as const,
          }))
        )
        return next
      })
    }, 8000) // Each main step takes 8 seconds

    return () => {
      clearInterval(mainStepTimer)
      clearInterval(subStepTimer)
    }
  }, [showPlan, isLoading, planSteps.length])

  const handleSend = async (overrideMessages?: Message[]) => {
    const messagesToSend = overrideMessages || messages
    const textToSend = overrideMessages ? '' : input.trim()
    if ((!textToSend && !overrideMessages) || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
    }

    const assistantId = crypto.randomUUID()
    const newMessages = overrideMessages ? [...messagesToSend, userMessage] : [...messagesToSend, userMessage]
    if (!overrideMessages) {
      setMessages((prev) => [...prev, userMessage])
      setInput('')
    } else {
      setMessages([...messagesToSend, userMessage])
      setInput('')
    }
    setIsLoading(true)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Start planning
    const isApp = isAppRequest(textToSend || (overrideMessages ? overrideMessages[overrideMessages.length - 1]?.content : ''))
    const steps = isApp ? appPlanSteps : simplePlanSteps
    startPlanAnimation(steps)

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, isStreaming: true },
    ])

    try {
      const chatMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000)

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

      // If self-corrected, mark it
      if (data.selfCorrected) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m)
        )
      }
    } catch (error) {
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
            ? `Error de conexión: ${error.message}. La IA se auto-corregirá en el siguiente intento.`
            : 'No se pudo conectar con la IA. Reintentando con auto-corrección...'
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
    // Stop speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
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

  // Edit message
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

  const handleSaveEdit = (messageId: string) => {
    // Find the message index and truncate everything after it
    const msgIndex = messages.findIndex((m) => m.id === messageId)
    if (msgIndex === -1) return

    const updatedMessages = messages.slice(0, msgIndex)
    const editedMessage: Message = { ...messages[msgIndex], content: editText }

    setMessages(updatedMessages)
    setEditingMessageId(null)
    setEditText('')
    setIsLoading(false)

    // Stop any ongoing streaming
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current)
      streamingIntervalRef.current = null
    }

    // Re-send from edited message
    const newMessages = [...updatedMessages, editedMessage]
    setMessages(newMessages)
    setInput('')

    // Auto-send the edited message
    const assistantId = crypto.randomUUID()
    setIsLoading(true)

    const isApp = isAppRequest(editText)
    const steps = isApp ? appPlanSteps : simplePlanSteps
    startPlanAnimation(steps)

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, isStreaming: true },
    ])

    const chatMessages = newMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatMessages,
        model: selectedModel,
        enableSelfCorrection: true,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error del servidor')
        return response.json()
      })
      .then((data) => {
        if (!data.message) throw new Error('Respuesta vacía')
        setPlanSteps((prev) => prev.map((s) => ({ ...s, status: 'done' as const })))
        simulateStreaming(data.message, assistantId)
        if (data.selfCorrected) {
          setMessages((prev) =>
            prev.map((m) => m.id === assistantId ? { ...m, selfCorrected: true } : m)
          )
        }
      })
      .catch(() => {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== assistantId)
          return [
            ...filtered,
            { id: assistantId, role: 'assistant', content: 'Error de conexión. Intenta de nuevo.', model: currentModel.name, isStreaming: false },
          ]
        })
        setPlanSteps([])
        setShowPlan(false)
      })
      .finally(() => setIsLoading(false))
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditText('')
  }

  // Copy message
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // Listen message (TTS)
  const handleListenMessage = (messageId: string, content: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // If already speaking this message, stop
    if (speakingId === messageId) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    // Stop any current speech
    window.speechSynthesis.cancel()

    // Strip markdown for cleaner speech
    const plainText = content
      .replace(/```[\s\S]*?```/g, ' bloque de código ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-*+]\s/g, '')
      .replace(/\d+\.\s/g, '')

    const utterance = new SpeechSynthesisUtterance(plainText)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to find a Spanish voice
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'))
    if (spanishVoice) utterance.voice = spanishVoice

    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)

    setSpeakingId(messageId)
    window.speechSynthesis.speak(utterance)
  }

  // Get current sub-step text for active plan step
  const getActiveSubStep = (step: PlanStep): string | null => {
    if (step.status !== 'active' || !step.subSteps || step.subSteps.length === 0) return null
    const idx = currentSubStep % step.subSteps.length
    return step.subSteps[idx]
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
            <span className="text-[10px] text-[#06d6a0] font-medium">Online · Auto-Corrección</span>
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
              Describe la app que quieres crear. Planificaré cada paso, diseñaré la arquitectura, generaré el código completo y me auto-corregiré en tiempo real.
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
                  {editingMessageId === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        ref={editTextareaRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full min-h-[60px] max-h-[200px] resize-none bg-[oklch(0.08_0.02_260)] border border-[#06d6a0]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06d6a0]/50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(message.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#06d6a0] text-[#0a0f1c] text-xs font-semibold hover:bg-[#06d6a0]/80 transition-colors"
                        >
                          Enviar editado
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-lg bg-[oklch(0.2_0.03_260)] text-[oklch(0.6_0.02_200)] text-xs font-medium hover:bg-[oklch(0.25_0.04_260)] transition-colors"
                        >
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

                  {/* Message action buttons - shown for non-streaming, non-editing messages */}
                  {!message.isStreaming && !editingMessageId && message.content && (
                    <div className="mt-2 flex items-center gap-1">
                      {/* Edit button */}
                      <button
                        onClick={() => handleEditMessage(message.id, message.content)}
                        className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
                        title="Editar mensaje"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {/* Copy button */}
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
                        title="Copiar mensaje"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-[#06d6a0]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {/* Listen button */}
                      <button
                        onClick={() => handleListenMessage(message.id, message.content)}
                        className="p-1.5 rounded-md text-[oklch(0.35_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
                        title={speakingId === message.id ? 'Detener lectura' : 'Escuchar mensaje'}
                      >
                        {speakingId === message.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-[#06d6a0]" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {message.role === 'assistant' && message.model && !message.isStreaming && message.content && (
                    <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-1 font-mono flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      {message.model} · NexForge v{NEXFORGE_VERSION}
                      {message.selfCorrected && (
                        <span className="text-[#06d6a0] ml-1">· Auto-corregido ✓</span>
                      )}
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
                      {isLoading ? 'Planificando con auto-corrección' : 'Completado'}
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
                  {planSteps.map((step) => {
                    const activeSubStep = getActiveSubStep(step)
                    return (
                      <div key={step.id} className="flex items-start gap-2.5">
                        {step.status === 'done' ? (
                          <CheckCircle2 className="w-4 h-4 text-[#06d6a0] shrink-0 mt-0.5" />
                        ) : step.status === 'active' ? (
                          <Loader2 className="w-4 h-4 text-[#06d6a0] animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-[oklch(0.25_0.02_260)] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className={`text-xs font-medium ${step.status === 'done' ? 'text-[oklch(0.6_0.02_200)]' : step.status === 'active' ? 'text-[#06d6a0]' : 'text-[oklch(0.35_0.02_200)]'}`}>
                            {step.text}
                          </span>
                          {step.status === 'active' && (
                            <p className="text-[10px] text-[oklch(0.4_0.02_200)] mt-0.5">
                              {activeSubStep || step.detail}
                            </p>
                          )}
                          {step.status === 'done' && step.subSteps && (
                            <p className="text-[10px] text-[oklch(0.3_0.02_200)] mt-0.5">
                              Completado: {step.subSteps.join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-bold border-0 rounded-xl h-[46px] w-[46px] p-0 hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all disabled:opacity-40 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 max-w-4xl mx-auto">
          <p className="text-[10px] text-[oklch(0.35_0.02_200)]">
            Enter para enviar · Shift+Enter nueva línea · Auto-corrección activa
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
            <span className="text-sm font-medium text-[#06d6a0]">Chat IA con Auto-Corrección</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Habla con la{' '}
            <span className="text-gradient">IA</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            La IA planifica, diseña, codifica y se auto-corregirá en tiempo real. Edita, copia o escucha cada respuesta.
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
