export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

function buildSystemPrompt(task: string, targetLanguage?: string, language?: string, description?: string): string {
  switch (task) {
    case 'complete':
      return 'You are an expert programmer. Complete the provided code. Return only the complete code, no explanations.'
    case 'fix':
      return 'You are an expert debugger. Find and fix the bug in this code. Return the fixed code with a brief comment explaining what was wrong.'
    case 'explain':
      return 'Explain this code in plain English. Be clear and concise, aimed at a developer.'
    case 'convert':
      return `Convert the provided code to ${targetLanguage || 'JavaScript'}. Return only the converted code.`
    case 'comment':
      return 'Add clear, professional docstrings and inline comments to this code. Return the full commented code.'
    case 'optimize':
      return 'Optimize and refactor this code for better performance and readability. Return the improved code with brief notes on changes.'
    case 'suggest':
      return `Suggest the best algorithm or approach for: ${description || 'the task described'}. Provide code example in ${language || 'Python'}.`
    case 'generate':
      return `Generate ${language || 'Python'} code that does the following: ${description}. Return only clean, working code.`
    default:
      return 'You are an expert programmer. Help with the following code task.'
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 503 })
    }

    const { task, code, description, language, targetLanguage } = await req.json()

    if (!task) {
      return NextResponse.json({ error: 'Missing task parameter.' }, { status: 400 })
    }

    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({ apiKey })

    const systemPrompt = buildSystemPrompt(task, targetLanguage, language, description)

    const userContent = task === 'generate' || task === 'suggest'
      ? description || 'Generate code as described.'
      : code
        ? `${code}${description ? `\n\n// Additional context: ${description}` : ''}`
        : description || 'Help me with this code task.'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    })

    const result = completion.choices[0]?.message?.content || ''
    return NextResponse.json({ result })
  } catch (err: unknown) {
    console.error('Generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error.' },
      { status: 500 }
    )
  }
}
