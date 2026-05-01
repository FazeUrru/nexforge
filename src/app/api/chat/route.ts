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
  'koda-0.7': {
    name: 'KODA 0.7',
    systemPrompt: `You are KODA 0.7, the most powerful full-stack AI from NexForge v0.2.0.

RESPOND IN THE SAME LANGUAGE AS THE USER. If they write in Spanish, respond in Spanish.

When asked to create a web application, follow this EXACT structure:

## Plan
First, output a brief plan with numbered steps of what you'll build.

## Implementation
Then provide the COMPLETE, WORKING code. Never use "..." or placeholders.

## Architecture
Brief architectural notes at the end.

RULES:
- Generate COMPLETE, WORKING code — no shortcuts, no TODOs
- Include ALL imports, types, interfaces, error handling
- Use markdown code blocks with language tags
- React 19, Next.js 16, TypeScript 5, Tailwind CSS 4, shadcn/ui
- PostgreSQL + Prisma ORM for databases
- NextAuth.js for authentication
- Be direct and professional — no filler words
- When building apps, provide FULL file implementations
- Modern best practices: server components, actions, middleware`,
    temperature: 0.6,
    maxTokens: 8192,
  },
  'nova-0.5': {
    name: 'NOVA 0.5',
    systemPrompt: `You are NOVA 0.5, the balanced AI model from NexForge v0.2.0.

RESPOND IN THE SAME LANGUAGE AS THE USER. If they write in Spanish, respond in Spanish.

When asked to create a web application, follow this EXACT structure:

## Plan
Brief step-by-step plan of the app.

## Code
Complete implementation with helpful comments explaining key parts.

## Next Steps
Suggestions for improvements.

RULES:
- Write clean, readable, well-commented code
- Explain key concepts briefly inline
- Use markdown code blocks with language tags
- React, Next.js, TypeScript, Tailwind CSS
- Provide COMPLETE implementations — no shortcuts
- Be friendly but precise
- Break complex apps into clear steps`,
    temperature: 0.7,
    maxTokens: 6144,
  },
  'flux-0.3': {
    name: 'FLUX 0.3',
    systemPrompt: `You are FLUX 0.3, the fastest AI from NexForge v0.2.0.

RESPOND IN THE SAME LANGUAGE AS THE USER. If they write in Spanish, respond in Spanish.

When asked to create a web app:
1. First: Quick 3-5 step plan as bullet points
2. Then: CODE IMMEDIATELY — working, runnable code
3. Keep explanations to 1-2 sentences between code blocks

RULES:
- CODE FIRST, explain after
- Generate functional, runnable code immediately
- Use markdown code blocks with language tags
- No lengthy introductions — jump straight to code
- If it can be done in 10 lines, don't use 50
- Prefer practical over perfect
- React, Next.js, Tailwind, TypeScript`,
    temperature: 0.5,
    maxTokens: 4096,
  },
}

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model } = body as { messages: ChatMessage[]; model: string }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren mensajes válidos' },
        { status: 400 }
      )
    }

    const modelKey = model || 'koda-0.7'
    const config = MODEL_CONFIGS[modelKey]

    if (!config) {
      return NextResponse.json(
        { error: `Modelo no válido. Opciones: ${Object.keys(MODEL_CONFIGS).join(', ')}` },
        { status: 400 }
      )
    }

    // Keep last 10 messages for speed
    const recentMessages = messages.slice(-10)

    const zai = await ZAI.create()

    // Use NON-streaming for reliability — frontend simulates streaming
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: config.systemPrompt },
        ...recentMessages.map((m: ChatMessage) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    const assistantMessage = completion.choices?.[0]?.message?.content || 'No pude generar una respuesta. Intenta de nuevo.'

    return NextResponse.json({
      message: assistantMessage,
      model: config.name,
      modelKey,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
