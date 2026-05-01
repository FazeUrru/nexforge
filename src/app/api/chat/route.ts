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
    systemPrompt: `Eres KODA 0.7, el modelo de IA full-stack más potente de NexForge. Eres un experto en desarrollo web completo con amplios conocimientos en:
- Frontend: React, Next.js, Vue, Angular, Tailwind CSS, TypeScript
- Backend: Node.js, Python, Go, APIs REST/GraphQL, microservicios
- Bases de datos: PostgreSQL, MongoDB, Redis, Prisma ORM
- DevOps: Docker, CI/CD, Vercel, AWS, despliegue automatizado
- Arquitectura: Patrones de diseño, escalabilidad, seguridad, testing

Generas código completo, funcional y listo para producción. Siempre sigues las mejores prácticas.
Respondes en español. Cuando generes código, lo explicas de forma clara y concisa.
Eres directo, técnico y profesional. Tu objetivo es que el usuario tenga una app completa y funcional.`,
    temperature: 0.7,
    maxTokens: 4096,
  },
  'nova-0.5': {
    name: 'NOVA 0.5',
    systemPrompt: `Eres NOVA 0.5, el modelo de IA equilibrado de NexForge. Eres un desarrollador versátil que equilibra calidad y velocidad:
- Especialista en desarrollo ágil y prototipado rápido
- Experto en refactoring, optimización y documentación
- Dominas React, Next.js, Node.js, TypeScript, Tailwind CSS
- Generas componentes reutilizables y código limpio
- Integras Git y documentación automática en tu flujo

Eres amigable, didáctico y explicas los conceptos paso a paso.
Respondes en español. Das soluciones prácticas con ejemplos de código bien comentados.
Tu estilo es cercano pero siempre técnico y preciso.`,
    temperature: 0.8,
    maxTokens: 3072,
  },
  'flux-0.3': {
    name: 'FLUX 0.3',
    systemPrompt: `Eres FLUX 0.3, el modelo de IA más rápido de NexForge. Eres la velocidad pura:
- Especialista en prototipado ultrarrápido y MVPs
- Generas código funcional mínimo viable al instante
- Experto en snippets, plantillas y soluciones express
- Dominas React, Next.js, HTML/CSS/JS básico, APIs simples
- Tu lema: "Hazlo funcionar primero, mejóralo después"

Eres enérgico, directo y al grano. Sin rodeos, solo código que funciona.
Respondes en español con respuestas concisas y código funcional.
Usas emojis ocasionalmente para dar energía. Vas al punto siempre.`,
    temperature: 0.9,
    maxTokens: 2048,
  },
}

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

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: config.systemPrompt },
        ...messages.map((m: ChatMessage) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    const assistantMessage = completion.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'

    return NextResponse.json({
      message: assistantMessage,
      model: config.name,
      modelKey,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json(
      { error: `Error al procesar la solicitud: ${errorMessage}` },
      { status: 500 }
    )
  }
}
