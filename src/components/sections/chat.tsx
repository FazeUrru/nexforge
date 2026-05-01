'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Cpu,
  Brain,
  Rocket,
  Send,
  Loader2,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Trash2,
  ChevronDown,
  Bot,
  User,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
}

interface ModelOption {
  key: string
  name: string
  version: string
  icon: typeof Cpu
  color: string
  description: string
}

const models: ModelOption[] = [
  {
    key: 'koda-0.7',
    name: 'KODA',
    version: '0.7',
    icon: Cpu,
    color: '#06d6a0',
    description: 'Full-stack potente',
  },
  {
    key: 'nova-0.5',
    name: 'NOVA',
    version: '0.5',
    icon: Brain,
    color: '#00ffc8',
    description: 'Equilibrado y versátil',
  },
  {
    key: 'flux-0.3',
    name: 'FLUX',
    version: '0.3',
    icon: Rocket,
    color: '#10b981',
    description: 'Velocidad extrema',
  },
]

const suggestedPrompts = [
  'Crea una app de e-commerce con carrito y pagos',
  'Genera un dashboard con gráficos y datos en tiempo real',
  'Haz un blog con CMS y sistema de comentarios',
  'Crea una app de gestión de tareas con autenticación',
  'Genera una API REST para un sistema de reservas',
  'Haz un portfolio personal con animaciones',
]

export function ChatSection() {
  const [selectedModel, setSelectedModel] = useState<string>('koda-0.7')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentModel = models.find((m) => m.key === selectedModel)!

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la respuesta')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        model: data.model,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'No se pudo conectar con el modelo. Inténtalo de nuevo.'}`,
        model: currentModel.name,
      }
      setMessages((prev) => [...prev, errorMessage])
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
    // Auto-resize
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 150) + 'px'
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
  }

  const handleRetry = async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMsg) return

    // Remove last assistant message
    setMessages((prev) => {
      const newMsgs = [...prev]
      const lastAssistantIdx = newMsgs.map((m) => m.role).lastIndexOf('assistant')
      if (lastAssistantIdx !== -1) {
        newMsgs.splice(lastAssistantIdx, 1)
      }
      return newMsgs
    })

    setIsLoading(true)
    try {
      const chatMessages = messages
        .filter((_, i) => i < messages.length && messages[messages.length - 1]?.role === 'assistant' ? i < messages.length - 1 : true)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          model: selectedModel,
        }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        model: data.model,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      // Silently fail on retry
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="chat" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06d6a0]/20 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="bg-[#06d6a0]/10 text-[#06d6a0] border-[#06d6a0]/20 mb-4">
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat en Vivo
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Habla con la{' '}
            <span className="text-gradient">IA</span>
          </h2>
          <p className="text-lg text-[oklch(0.6_0.02_200)] max-w-2xl mx-auto">
            Elige un modelo y empieza a crear. Pídele cualquier app web y la IA
            generará el código completo para ti.
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl overflow-hidden border border-[oklch(0.25_0.04_260)] bg-[oklch(0.1_0.02_260)]/80 backdrop-blur"
        >
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/60">
            <div className="flex items-center gap-3">
              {/* Model selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[oklch(0.25_0.04_260)] hover:border-[#06d6a0]/30 bg-[oklch(0.12_0.02_260)] transition-all"
                >
                  <currentModel.icon
                    className="w-4 h-4"
                    style={{ color: currentModel.color }}
                  />
                  <span className="text-sm font-semibold" style={{ color: currentModel.color }}>
                    {currentModel.name}
                  </span>
                  <span className="text-xs text-[oklch(0.5_0.02_200)]">
                    v{currentModel.version}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[oklch(0.5_0.02_200)]" />
                </button>

                <AnimatePresence>
                  {modelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-[oklch(0.25_0.04_260)] bg-[oklch(0.1_0.02_260)] shadow-xl overflow-hidden z-20"
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
                          <model.icon
                            className="w-5 h-5 shrink-0"
                            style={{ color: model.color }}
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold" style={{ color: model.color }}>
                                {model.name}
                              </span>
                              <span className="text-xs text-[oklch(0.4_0.02_200)] font-mono">
                                v{model.version}
                              </span>
                            </div>
                            <span className="text-xs text-[oklch(0.5_0.02_200)]">
                              {model.description}
                            </span>
                          </div>
                          {selectedModel === model.key && (
                            <div
                              className="ml-auto w-2 h-2 rounded-full"
                              style={{ backgroundColor: model.color }}
                            />
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
              {messages.length > 0 && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="p-2 rounded-lg text-[oklch(0.4_0.02_200)] hover:text-[#06d6a0] hover:bg-[#06d6a0]/5 transition-all disabled:opacity-50"
                  title="Reintentar último mensaje"
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
            </div>
          </div>

          {/* Messages area */}
          <div className="h-[450px] sm:h-[500px] overflow-y-auto px-4 sm:px-6 py-4 space-y-1 scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[#06d6a0]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Empieza a crear con {currentModel.name}
                </h3>
                <p className="text-sm text-[oklch(0.5_0.02_200)] mb-6 max-w-md">
                  Describe la aplicación que quieres crear y la IA generará el
                  código completo. Sin límites.
                </p>

                {/* Suggested prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedPrompts.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="text-left text-xs px-3 py-2.5 rounded-lg bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)] hover:border-[#06d6a0]/20 hover:bg-[oklch(0.14_0.02_260)] text-[oklch(0.6_0.02_200)] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
                          style={{
                            background: `${currentModel.color}15`,
                            border: `1px solid ${currentModel.color}30`,
                          }}
                        >
                          <Bot className="w-4 h-4" style={{ color: currentModel.color }} />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-[#06d6a0]/20 to-[#00ffc8]/10 border border-[#06d6a0]/15'
                            : 'bg-[oklch(0.12_0.02_260)] border border-[oklch(0.2_0.03_260)]'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        {message.role === 'assistant' && message.model && (
                          <p className="text-[10px] text-[oklch(0.4_0.02_200)] mt-2 font-mono">
                            {message.model}
                          </p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-[oklch(0.2_0.03_260)] border border-[oklch(0.25_0.04_260)] flex items-center justify-center shrink-0 mt-1">
                          <User className="w-4 h-4 text-[oklch(0.6_0.02_200)]" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${currentModel.color}15`,
                        border: `1px solid ${currentModel.color}30`,
                      }}
                    >
                      <Bot className="w-4 h-4" style={{ color: currentModel.color }} />
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-[oklch(0.2_0.03_260)] bg-[oklch(0.08_0.02_260)]/60 px-4 sm:px-6 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={`Pídele a ${currentModel.name} que cree tu app...`}
                  className="min-h-[44px] max-h-[150px] resize-none bg-[oklch(0.12_0.02_260)] border-[oklch(0.25_0.04_260)] focus:border-[#06d6a0]/40 focus:ring-[#06d6a0]/20 text-sm rounded-xl pr-4 placeholder:text-[oklch(0.4_0.02_200)]"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] font-semibold border-0 rounded-xl h-[44px] w-[44px] p-0 hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-[oklch(0.35_0.02_200)] mt-2 text-center">
              NexForge v0.2.0 — 100% Gratis, Ilimitado y OpenSource · Enter para enviar, Shift+Enter para nueva línea
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
