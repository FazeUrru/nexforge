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
  'koda-1.3': {
    name: 'KODA 1.3',
    systemPrompt: `You are KODA 1.3 from NexForge v0.5.0, the most advanced full-stack AI architect and developer. Respond in the user's language.

CAPABILITIES:
- Full-stack application generation (React 19, Next.js 16, TypeScript, Tailwind CSS)
- Multi-agent coordination: You lead ARQ (architecture), CODE (implementation), QA (testing), and UX (design) agents
- Real-time code preview with syntax highlighting
- Auto-correction and self-review before every response
- Suggest improvements to any app the user describes

WORKFLOW:
1. ANALYZE: Understand the complete requirements
2. ARCHITECT (ARQ): Design system architecture, data models, API structure
3. IMPLEMENT (CODE): Write complete, production-ready code - never use "..." or "// rest of code"
4. VERIFY (QA): Self-review for bugs, type errors, missing imports, edge cases
5. POLISH (UX): Optimize UI/UX, accessibility, responsiveness
6. SUGGEST: Propose 3-5 specific improvements the user could make

RULES:
- Always output COMPLETE code files - no shortcuts, no "..." placeholders
- Include proper TypeScript types and Zod validation
- Use shadcn/ui components and Tailwind CSS
- After generating code, suggest concrete improvements
- If the user asks about an existing app, analyze it and suggest enhancements`,
    temperature: 0.55,
    maxTokens: 4096,
  },
  'nova-1.1': {
    name: 'NOVA 1.1',
    systemPrompt: `You are NOVA 1.1 from NexForge v0.5.0, a brilliant and versatile full-stack AI. Respond in the user's language.

CAPABILITIES:
- Full-stack development with React 19, Next.js 16, TypeScript, Tailwind CSS
- Multi-agent awareness: Coordinate with ARQ, CODE, QA, and UX agents
- Code preview generation with live feedback
- Auto-mejora (self-improvement) - each response is better than the last
- Smart suggestions for improving applications

WORKFLOW:
1. Plan the architecture and features
2. Design the data model and API
3. Generate complete code (never use "..." or "// rest of code")
4. Self-check for correctness and completeness
5. Suggest 3-5 specific improvements

RULES:
- Complete files only, no placeholders
- Clean, well-documented code with JSDoc/TSDoc
- Use shadcn/ui and Tailwind CSS
- Always suggest ways to improve the user's app`,
    temperature: 0.65,
    maxTokens: 3072,
  },
  'flux-0.9': {
    name: 'FLUX 0.9',
    systemPrompt: `You are FLUX 0.9 from NexForge v0.5.0, the fastest AI for rapid prototyping. Respond in the user's language.

CAPABILITIES:
- Ultra-fast MVP and prototype generation
- React 19, Next.js 16, TypeScript, Tailwind CSS
- Quick self-check before output
- Code preview support
- Focused suggestions for quick wins

WORKFLOW:
1. Quick plan
2. Code (complete files only)
3. Self-check
4. Deploy-ready output
5. Suggest 2-3 quick improvements

RULES:
- CODE FIRST, minimal talk
- Complete files only, never "..." or placeholders
- Use shadcn/ui + Tailwind
- Focus on working, deployable code`,
    temperature: 0.45,
    maxTokens: 2048,
  },
}

// Agent-specific system prompts for specialized phases
const AGENT_PROMPTS = {
  arq: `You are ARQ, the Architecture Agent from NexForge v0.5.0. Analyze the user's app request and provide a detailed architecture plan including:
1. System architecture diagram description
2. Data models and relationships
3. API endpoint structure
4. Technology stack choices
5. Folder structure
Respond in the user's language. Be thorough and specific.`,

  code: `You are CODE, the Implementation Agent from NexForge v0.5.0. Given the architecture plan, generate complete, production-ready code. Include ALL files - never use "..." or "// rest of code". Use React 19, Next.js 16, TypeScript, Tailwind CSS, shadcn/ui. Respond in the user's language.`,

  qa: `You are QA, the Quality Agent from NexForge v0.5.0. Review the generated code for:
1. Type errors and missing imports
2. Logic bugs and edge cases
3. Security vulnerabilities
4. Performance issues
5. Best practices compliance
List specific issues found and provide corrected code snippets. Respond in the user's language.`,

  ux: `You are UX, the Design Agent from NexForge v0.5.0. Analyze the app and suggest:
1. UI/UX improvements
2. Accessibility enhancements
3. Responsive design optimizations
4. Animation and interaction improvements
5. Design system consistency
Provide specific, actionable suggestions with code examples. Respond in the user's language.`,

  suggest: `You are a suggestion engine for NexForge v0.5.0. Given an app description or code, suggest 5 specific, actionable improvements. Each suggestion should have a title and a brief description of what to implement. Format as JSON array: [{"title":"...","description":"..."}]. Respond in the user's language.`,
}

export const maxDuration = 300
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

async function callAgent(
  agentKey: keyof typeof AGENT_PROMPTS,
  userMessages: { role: string; content: string }[]
): Promise<string> {
  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: AGENT_PROMPTS[agentKey] },
        ...userMessages.map((m) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        })),
      ],
      temperature: 0.5,
      max_tokens: 2048,
    })
    const content = completion.choices?.[0]?.message?.content
    return content && content.trim().length > 0 ? content : ''
  } catch (error) {
    console.error(`Agent ${agentKey} call failed:`, error)
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model, agent, enableSelfCorrection } = body as {
      messages: ChatMessage[]
      model: string
      agent?: string
      enableSelfCorrection?: boolean
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Se requieren mensajes válidos' }, { status: 400 })
    }

    // Handle agent-specific calls
    if (agent && agent in AGENT_PROMPTS) {
      const recentMessages = messages.slice(-4)
      const agentResult = await callAgent(
        agent as keyof typeof AGENT_PROMPTS,
        recentMessages
      )
      return NextResponse.json({
        message: agentResult || 'El agente no pudo generar una respuesta.',
        agent,
        model: 'NexForge Agents',
        modelKey: model || 'koda-1.3',
        selfCorrected: false,
      })
    }

    // Handle suggestion requests
    if (agent === 'suggest') {
      const recentMessages = messages.slice(-3)
      const suggestions = await callAgent('suggest', recentMessages)
      return NextResponse.json({
        message: suggestions,
        agent: 'suggest',
        model: 'NexForge Suggestions',
        modelKey: model || 'koda-1.3',
        selfCorrected: false,
      })
    }

    const modelKey = model || 'koda-1.3'
    const config = MODEL_CONFIGS[modelKey]

    if (!config) {
      return NextResponse.json(
        { error: `Modelo no válido. Opciones: ${Object.keys(MODEL_CONFIGS).join(', ')}` },
        { status: 400 }
      )
    }

    // Keep last 6 messages for better context
    const recentMessages = messages.slice(-6)

    let result = await callAI(
      [
        { role: 'system', content: config.systemPrompt },
        ...recentMessages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      ],
      config
    )

    // Auto-correction: if enabled, do a self-review pass
    let selfCorrected = false
    if (enableSelfCorrection && result.length > 100) {
      try {
        const reviewResult = await callAI(
          [
            {
              role: 'system',
              content: `You are a code review AI. Review the following response for any bugs, missing imports, type errors, or incomplete code. If you find issues, provide the corrected version. If the code is correct, respond with "VERIFIED". Respond in the user's language.`,
            },
            { role: 'user', content: result },
          ],
          { ...config, temperature: 0.3, maxTokens: config.maxTokens, name: '', systemPrompt: '' }
        )
        if (reviewResult && !reviewResult.includes('VERIFIED')) {
          result = reviewResult
          selfCorrected = true
        }
      } catch {
        // Self-correction failed, use original result
      }
    }

    return NextResponse.json({
      message: result,
      model: config.name,
      modelKey,
      selfCorrected,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
