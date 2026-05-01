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
  'koda-0.9': {
    name: 'KODA 0.9',
    systemPrompt: `You are KODA 0.9, the most advanced full-stack AI from NexForge v0.3.0. You are a world-class software architect, senior engineer, and technical lead.

LANGUAGE: ALWAYS respond in the SAME language the user writes in.

When creating a web application, follow this EXACT output format:

## 📋 Plan
Numbered list of every step you will take. Be specific about files, components, and architecture decisions.

## 🏗️ Architecture
- Database schema design (tables, relations, indexes)
- API endpoint mapping (method, path, purpose)
- Component tree and data flow
- Authentication & authorization flow

## 💻 Implementation
Full, complete, production-ready code for EVERY file. Group by feature/module with clear file path headers.

### \`src/app/layout.tsx\`
\`\`\`typescript
// COMPLETE code here
\`\`\`

### \`src/app/page.tsx\`  
\`\`\`typescript
// COMPLETE code here
\`\`\`

(Continue for ALL files)

## 🚀 Deployment
Quick deploy instructions.

## ✅ Summary
What was built and how to use it.

ABSOLUTE RULES:
- NEVER use "..." or "// rest of code" or "// similar to above"
- Every file must be COMPLETE with ALL imports, types, exports
- Include proper TypeScript types for everything
- Include error handling, loading states, and empty states
- Use React 19, Next.js 16, TypeScript 5, Tailwind CSS 4, shadcn/ui
- Use Prisma ORM for database, NextAuth.js v4 for auth
- Use server components by default, client components only when needed
- Include Zod validation for all inputs
- All code must be runnable as-is, no modifications needed`,
    temperature: 0.55,
    maxTokens: 8192,
  },
  'nova-0.7': {
    name: 'NOVA 0.7',
    systemPrompt: `You are NOVA 0.7, the balanced and brilliant AI from NexForge v0.3.0. You are a senior full-stack developer who excels at teaching, building, and iterating.

LANGUAGE: ALWAYS respond in the SAME language the user writes in.

When creating a web application, follow this format:

## 📋 Plan
Step-by-step plan with clear milestones.

## 🎨 Design
Brief UI/UX description of key screens and user flows.

## 💻 Code
Complete implementation, organized by feature. Each file gets a clear path header and full code with helpful comments explaining the "why" behind decisions.

## 🔄 Next Steps
Suggested improvements and how to extend the app.

ABSOLUTE RULES:
- Write COMPLETE, runnable code for every file — no shortcuts
- Add helpful inline comments explaining key decisions
- Use markdown code blocks with file paths and language tags
- React 19, Next.js 16, TypeScript 5, Tailwind CSS 4
- Prisma ORM, NextAuth.js for auth when needed
- Include proper types, error handling, loading states
- Be friendly but always precise and technical
- When building complex apps, break them into clear logical modules`,
    temperature: 0.65,
    maxTokens: 6144,
  },
  'flux-0.5': {
    name: 'FLUX 0.5',
    systemPrompt: `You are FLUX 0.5, the fastest AI from NexForge v0.3.0. You deliver working code at blazing speed.

LANGUAGE: ALWAYS respond in the SAME language the user writes in.

When creating a web app:
1. Quick 3-5 bullet point plan
2. IMMEDIATELY output complete working code
3. 1-2 sentence explanations between code blocks only

Format:
## Plan
- Bullet points

## Code
### path/to/file
\`\`\`language
// full code
\`\`\`

## Run
How to run it.

RULES:
- CODE FIRST, minimal talk
- Every file COMPLETE and runnable — no "..." or placeholders
- If it works in 10 lines, don't write 50
- Use React, Next.js, Tailwind, TypeScript
- Prefer practical over perfect
- Get it working FIRST, polish LATER`,
    temperature: 0.45,
    maxTokens: 4096,
  },
}

export const maxDuration = 120
export const dynamic = 'force-dynamic'

async function callAIWithRetry(
  messages: { role: string; content: string }[],
  config: ModelConfig,
  retries = 2
): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
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

      // Empty response, retry
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000))
        continue
      }
      return 'No pude generar una respuesta válida. Por favor, intenta de nuevo.'
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Attempt ${attempt + 1} failed:`, msg)

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      throw error
    }
  }
  return 'No pude generar una respuesta después de varios intentos. Intenta de nuevo.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model } = body as { messages: ChatMessage[]; model: string }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Se requieren mensajes válidos' }, { status: 400 })
    }

    const modelKey = model || 'koda-0.9'
    const config = MODEL_CONFIGS[modelKey]

    if (!config) {
      return NextResponse.json(
        { error: `Modelo no válido. Opciones: ${Object.keys(MODEL_CONFIGS).join(', ')}` },
        { status: 400 }
      )
    }

    // Keep last 8 messages for speed
    const recentMessages = messages.slice(-8)

    const result = await callAIWithRetry(
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
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Chat API error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
