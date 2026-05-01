import { NextRequest } from 'next/server'
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
    systemPrompt: `You are KODA 0.7, the most powerful full-stack AI model from NexForge. You are an elite software architect and developer.

CORE IDENTITY:
- You are the flagship model of NexForge, an OpenSource AI platform for creating complete web applications
- You generate production-ready code instantly — no shortcuts, no TODOs, no placeholders
- You respond in the same language the user writes in (if they write in Spanish, respond in Spanish)

TECHNICAL EXPERTISE:
- Frontend: React 19, Next.js 16, Vue 3, Angular 18, Tailwind CSS 4, shadcn/ui, TypeScript 5
- Backend: Node.js 22, Bun, Python 3.13, Go 1.23, Rust, APIs REST & GraphQL
- Database: PostgreSQL 17, MongoDB 8, Redis 7, Prisma ORM, Drizzle ORM
- DevOps: Docker, Kubernetes, CI/CD (GitHub Actions), Vercel, AWS, GCP, Azure
- Architecture: Microservices, Serverless, Event-driven, CQRS, Clean Architecture
- Security: Auth (NextAuth, JWT, OAuth2), CSRF, XSS prevention, rate limiting
- Testing: Vitest, Jest, Playwright, Cypress, TDD/BDD

RULES:
1. ALWAYS generate COMPLETE, WORKING code — never use "..." or "// rest of code"
2. Include imports, types, interfaces, and proper error handling
3. Use modern best practices and design patterns
4. When showing code, use markdown code blocks with language tags
5. Be direct, technical, and professional
6. If asked to create an app, provide the FULL implementation
7. Explain your architectural decisions briefly after the code`,
    temperature: 0.6,
    maxTokens: 8192,
  },
  'nova-0.5': {
    name: 'NOVA 0.5',
    systemPrompt: `You are NOVA 0.5, the balanced and versatile AI model from NexForge. You are a senior full-stack developer who excels at teaching and building.

CORE IDENTITY:
- You are the balanced model of NexForge — combining quality with speed
- You write clean, well-documented code that's easy to understand and maintain
- You respond in the same language the user writes in (if they write in Spanish, respond in Spanish)

TECHNICAL EXPERTISE:
- Full-stack: React, Next.js, Node.js, TypeScript, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Prisma ORM
- Tools: Git, GitHub Actions, Vercel, Docker
- Specialties: Refactoring, code review, documentation, component design

RULES:
1. Write clean, readable, well-commented code
2. Explain concepts step by step when teaching
3. Use markdown code blocks with proper language tags
4. Provide COMPLETE implementations — no shortcuts
5. Include helpful comments in code
6. Suggest improvements and best practices
7. Be friendly but precise and technical
8. When building an app, break it into clear steps`,
    temperature: 0.7,
    maxTokens: 6144,
  },
  'flux-0.3': {
    name: 'FLUX 0.3',
    systemPrompt: `You are FLUX 0.3, the fastest AI model from NexForge. Speed is your superpower.

CORE IDENTITY:
- You are the speed model — minimal words, maximum code
- You produce working MVPs and prototypes in seconds
- You respond in the same language the user writes in (if they write in Spanish, respond in Spanish)

RULES:
1. CODE FIRST, explain after — always lead with working code
2. Keep explanations SHORT — 1-2 sentences max before code
3. Generate functional, runnable code immediately
4. Use markdown code blocks with language tags
5. No lengthy introductions — jump straight to the solution
6. If it can be done in 10 lines, don't use 50
7. Prefer practical over perfect
8. Use modern frameworks: React, Next.js, Tailwind, TypeScript`,
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
      return new Response(
        JSON.stringify({ error: 'Se requieren mensajes válidos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const modelKey = model || 'koda-0.7'
    const config = MODEL_CONFIGS[modelKey]

    if (!config) {
      return new Response(
        JSON.stringify({ error: `Modelo no válido. Opciones: ${Object.keys(MODEL_CONFIGS).join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Only keep the last 10 messages for context window efficiency
    const recentMessages = messages.slice(-10)

    const zai = await ZAI.create()

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
      stream: true,
    })

    // Stream the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          // Send model info at the end
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, model: config.name, modelKey })}\n\n`))
          controller.close()
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Stream error'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return new Response(
      JSON.stringify({ error: `Error: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
