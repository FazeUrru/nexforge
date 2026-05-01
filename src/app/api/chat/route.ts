import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ModelConfig {
  name: string
  systemPrompt: string
  temperature: number
  maxTokens: number
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'koda-1.1': {
    name: 'KODA 1.1',
    systemPrompt: `You are KODA 1.1 from NexForge v0.4.0, an advanced full-stack AI. Respond in the user's language. Review your own code for bugs before outputting. When creating apps: Plan, then Code (complete files), then Self-Review. Never use "..." - always complete code. Use React 19, Next.js 16, TypeScript, Tailwind CSS.`,
    temperature: 0.55,
    maxTokens: 2048,
  },
  'nova-0.9': {
    name: 'NOVA 0.9',
    systemPrompt: `You are NOVA 0.9 from NexForge v0.4.0, a balanced full-stack AI. Respond in the user's language. Review your responses for correctness. When creating apps: Plan, Design, Code (complete), Self-Check. React 19, Next.js 16, TypeScript, Tailwind CSS.`,
    temperature: 0.65,
    maxTokens: 1536,
  },
  'flux-0.7': {
    name: 'FLUX 0.7',
    systemPrompt: `You are FLUX 0.7 from NexForge v0.4.0, the fastest AI. Respond in the user's language. Quick-check code before output. Format: Plan, Code, Self-Check, Run. CODE FIRST, minimal talk. Complete files only. React, Next.js, Tailwind, TypeScript.`,
    temperature: 0.45,
    maxTokens: 1024,
  },
}

export const maxDuration = 120
export const dynamic = 'force-dynamic'

async function callAI(
  messages: { role: string; content: string }[],
  config: ModelConfig
): Promise<string> {
  try {
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    const content = completion.choices?.[0]?.message?.content
    if (content && content.trim().length > 0) {
      return content
    }
    return 'No pude generar una respuesta válida. Intenta de nuevo.'
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI call failed:', msg)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model } = body as {
      messages: ChatMessage[]
      model: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Se requieren mensajes válidos' }, { status: 400 })
    }

    const modelKey = model || 'koda-1.1'
    const config = MODEL_CONFIGS[modelKey]

    if (!config) {
      return NextResponse.json(
        { error: `Modelo no válido. Opciones: ${Object.keys(MODEL_CONFIGS).join(', ')}` },
        { status: 400 }
      )
    }

    // Keep last 4 messages for memory safety
    const recentMessages = messages.slice(-4)

    const result = await callAI(
      [
        { role: 'system', content: config.systemPrompt },
        ...recentMessages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      ],
      config
    )

    return NextResponse.json({
      message: result,
      model: config.name,
      modelKey,
      selfCorrected: false,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
