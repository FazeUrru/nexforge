'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Cpu,
  Brain,
  Rocket,
  Send,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  ChevronDown,
  Bot,
  User,
  X,
  Maximize2,
  MessageSquare,
  Zap,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  streaming?: boolean
}

interface ModelOption {
  key: string
  name: string
  version: string
  icon: typeof Cpu
  color: string
  description: string
  speed: string
}

const models: ModelOption[] = [
  {
    key: 'koda-0.7',
    name: 'KODA',
    version: '0.7',
    icon: Cpu,
    color: '#06d6a0',
    description: 'Full-stack potente',
    speed: '45 tok/s',
  },
  {
    key: 'nova-0.5',
    name: 'NOVA',
    version: '0.5',
    icon: Brain,
    color: '#00ffc8',
    description: 'Equilibrado y versátil',
    speed: '82 tok/s',
  },
  {
    key: 'flux-0.3',
    name: 'FLUX',
    version: '0.3',
    icon: Rocket,
    color: '#10b981',
    description: 'Velocidad extrema',
    speed: '150 tok/s',
  },
]

const suggestedPrompts = [
  { icon: '🛒', text: 'Crea una app de e-commerce con carrito y pagos Stripe' },
  { icon: '📊', text: 'Genera un dashboard con gráficos y datos en tiempo real' },
  { icon: '📝', text: 'Haz un blog con CMS, auth y sistema de comentarios' },
  { icon: '✅', text: 'Crea una app de gestión de tareas con autenticación' },
  { icon: '🌐', text: 'Genera una API REST para un sistema de reservas' },
  { icon: '🎨', text: 'Haz un portfolio personal con animaciones y dark mode' },
]

export function ChatSection() {
  const [selectedModel, setSelectedModel] = useState<string>('koda-0.7')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const currentModel = models.find((m) => m.key === selectedModel)!

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Add empty assistant message for streaming
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', model: currentModel.name, streaming: true },
    ])

    try {
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error de conexión' }))
        throw new Error(errorData.error || 'Error en la respuesta')
      }

      // Handle streaming
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No se pudo leer la respuesta')

      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            try {
              const data = JSON.parse(dataStr)
              if (data.content) {
                fullContent += data.content
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: fullContent, streaming: true }
                      : m
                  )
                )
              }
              if (data.done) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: fullContent, streaming: false, model: data.model || currentModel.name }
                      : m
                  )
                )
              }
              if (data.error) {
                throw new Error(data.error)
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }

      // Ensure final state
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, content: fullContent || 'Sin respuesta del modelo.' }
            : m
        )
      )
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, content: fullContent || 'Generación cancelada.' }
              : m
          )
        )
      } else {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== assistantId)
          return [
            ...filtered,
            {
              id: assistantId,
              role: 'assistant',
              content: `Error: ${error instanceof Error ? error.message : 'No se pudo conectar. Inténtalo de nuevo.'}`,
              model: currentModel.name,
              streaming: false,
            },
          ]
        })
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    abortControllerRef.current?.abort()
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
  }

  const handleRetry = async () => {
    const lastUserMsgIdx = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserMsgIdx === -1) return

    const actualIdx = messages.length - 1 - lastUserMsgIdx
    // Remove everything after the last user message
    const trimmed = messages.slice(0, actualIdx)
    setMessages(trimmed)

    // Resend the last user message
    const lastUserMsg = messages[actualIdx]
    if (lastUserMsg) {
      setInput(lastUserMsg.content)
      // Auto-send after a tick
      setTimeout(() => {
        const textarea = textareaRef.current
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'
        }
      }, 50)
    }
  }

  const chatContent = (
    <>
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          {/* Model selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[oklch(0.25_0.04_260)] hover:border-[#06d6a0]/30 bg-[oklch(0.12_0.02_260)] transition-all"
            >
              <currentModel.icon className="w-4 h-4" style={{ color: currentModel.color }} />
              <span className="text-sm font-semibold" style={{ color: currentModel.color }}>
                {currentModel.name}
              </span>
              <span className="text-xs text-[oklch(0.5_0.02_200)] font-mono">v{currentModel.version}</span>
              <ChevronDown className="w-3 h-3 text-[oklch(0.5_0.02_200)]" />
            </button>

            <AnimatePresence>
              {modelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-[oklch(0.25_0.04_260)] bg-[oklch(0.1_0.02_260)] shadow-2xl overflow-hidden z-50"
                >
                  {models.map((model) => (
                    <button
                      key={model.key}
                      onClick={() => {
                        setSelectedModel(model.key)
                        setModelDropdownOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[oklch(0.15_0.03_260)] transition-colors ${
                        selectedModel === model.key ? 'bg-[oklch(0.15_0.03_260)]' : ''
                      }`}
                    >
                      <model.icon className="w-5 h-5 shrink-0" style={{ color: model.color }} />
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: model.color }}>
                            {model.name}
                          </span>
                          <span className="text-xs text-[oklch(0.4_0.02_200)] font-mono">v{model.version}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[oklch(0.5_0.02_200)]">{model.description}</span>
                          <span className="text-[10px] font-mono" style={{ color: model.color }}>{model.speed}</span>
                        </div>
                      </div>
                      {selectedModel === model.key && (
                        <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#06d6a0] animate-pulse" />
            <span className="text-xs text-[oklch(0.5_0.02_200)]">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && !isLoading && (
            <button
              onClick={handleRetry}
              className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
              title="Reintentar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-red-400 hover:bg-red-400/5 transition-all"
              title="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {!isFullscreen ? (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
              title="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all"
              title="Salir de pantalla completa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 scroll-smooth ${isFullscreen ? '' : 'h-[500px] sm:h-[550px]'}`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-6 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-[#06d6a0]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Hola, soy <span style={{ color: currentModel.color }}>{currentModel.name}</span>
            </h3>
            <p className="text-[oklch(0.5_0.02_200)] mb-8 max-w-md text-sm">
              Describe la aplicación que quieres crear y generaré el código completo para ti.
              Sin límites, sin restricciones, 100% gratis.
            </p>

            {/* Suggested prompts */}
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
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${currentModel.color}20, ${currentModel.color}10)`,
                        border: `1px solid ${currentModel.color}30`,
                      }}
                    >
                      <Bot className="w-5 h-5" style={{ color: currentModel.color }} />
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
                        [&_pre]:bg-[oklch(0.08_0.02_260)] [&_pre]:border [&_pre]:border-[oklch(0.2_0.03_260)] [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto
                        [&_code]:text-[#06d6a0] [&_code]:font-mono [&_code]:text-xs
                        [&_pre_code]:text-[oklch(0.85_0.02_200)]
                        [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                        [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2
                        [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
                        [&_p]:mb-2 [&_p]:last:mb-0
                        [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2
                        [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2
                        [&_li]:mb-1
                        [&_strong]:text-[oklch(0.9_0.02_200)] [&_strong]:font-semibold
                        [&_a]:text-[#06d6a0] [&_a]:underline
                        [&_blockquote]:border-l-2 [&_blockquote]:border-[#06d6a0]/30 [&_blockquote]:pl-3 [&_blockquote]:italic
                      ">
                        <ReactMarkdown>{message.content || ' '}</ReactMarkdown>
                        {message.streaming && (
                          <span className="inline-block w-2 h-4 bg-[#06d6a0] animate-pulse ml-0.5 align-middle" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}
                    {message.role === 'assistant' && message.model && !message.streaming && (
                      <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-2 font-mono flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        {message.model} · NexForge v0.2.0
                      </p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-[oklch(0.2_0.03_260)] border border-[oklch(0.25_0.04_260)] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-[oklch(0.6_0.02_200)]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator (only when streaming hasn't started) */}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentModel.color}20, ${currentModel.color}10)`,
                    border: `1px solid ${currentModel.color}30`,
                  }}
                >
                  <Bot className="w-5 h-5" style={{ color: currentModel.color }} />
                </div>
                <div className="bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)] rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: currentModel.color }} />
                    <span className="text-sm text-[oklch(0.5_0.02_200)]">
                      {currentModel.name} está pensando...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/80 backdrop-blur-sm px-4 sm:px-6 py-3 shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={`Pídele a ${currentModel.name} que cree tu app...`}
              className="min-h-[46px] max-h-[150px] resize-none bg-[oklch(0.12_0.02_260)] border-[oklch(0.25_0.04_260)] focus:border-[#06d6a0]/40 focus:ring-[#06d6a0]/20 text-sm rounded-xl pr-4 placeholder:text-[oklch(0.4_0.02_200)]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          {isLoading ? (
            <Button
              onClick={handleStop}
              className="bg-red-500/80 hover:bg-red-500 text-white font-semibold border-0 rounded-xl h-[46px] w-[46px] p-0 transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-semibold border-0 rounded-xl h-[46px] w-[46px] p-0 hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all disabled:opacity-40 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-2 text-center">
          NexForge v0.2.0 — 100% Gratis, Ilimitado y OpenSource · Enter para enviar, Shift+Enter nueva línea
        </p>
      </div>
    </>
  )

  // Fullscreen mode: render as fixed overlay
  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-[oklch(0.08_0.02_260)]"
      >
        {chatContent}
      </motion.div>
    )
  }

  // Embedded mode: section within the page
  return (
    <section id="chat" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06d6a0]/10 border border-[#06d6a0]/20 mb-4">
            <MessageSquare className="w-4 h-4 text-[#06d6a0]" />
            <span className="text-sm font-medium text-[#06d6a0]">Chat en Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Habla con la{' '}
            <span className="text-gradient">IA</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Elige un modelo y empieza a crear. Pídele cualquier app web y la IA
            generará el código completo para ti en tiempo real.
          </p>
        </motion.div>

        {/* Chat container */}
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
