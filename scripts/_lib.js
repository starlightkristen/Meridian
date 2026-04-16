// Shared helpers for seed scripts. ESM only.
// Every seed script imports from here — DRY.

import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL) {
  console.error('Missing VITE_SUPABASE_URL in .env.local')
  process.exit(1)
}
if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY in environment or .env.local')
  console.error('Get it from: Supabase dashboard → Settings → API → service_role')
  process.exit(1)
}

// Admin client — bypasses RLS. Never ship to the browser.
export const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Claude client — ANTHROPIC_API_KEY must be set in env.
export const claude = new Anthropic()

// Claude generation helper. Strips markdown code fences + parses JSON.
export async function generateJSON(prompt, { model = 'claude-opus-4-5', maxTokens = 4096 } = {}) {
  const msg = await claude.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
  const clean = text.replace(/```json\n?|\n?```/g, '').trim()
  try {
    return JSON.parse(clean)
  } catch (err) {
    throw new Error(`Claude returned invalid JSON: ${err.message}\n--- raw ---\n${text.slice(0, 500)}`)
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Fetch with retry + exponential backoff. Max 3 tries.
export async function fetchWithRetry(url, options = {}, { tries = 3, baseDelayMs = 500 } = {}) {
  let lastErr
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
      return res
    } catch (err) {
      lastErr = err
      if (attempt < tries - 1) {
        await sleep(baseDelayMs * Math.pow(2, attempt))
      }
    }
  }
  throw lastErr
}

// Batch-insert with onConflict support. Returns count of rows touched.
export async function upsertBatched(table, rows, { onConflict = 'name', batchSize = 200 } = {}) {
  let touched = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize)
    const { error, count } = await admin
      .from(table)
      .upsert(chunk, { onConflict, count: 'exact' })
    if (error) {
      console.error(`  upsert failed (batch ${i / batchSize}):`, error.message)
      throw error
    }
    touched += count ?? chunk.length
  }
  return touched
}

// ANSI color helpers (no dep).
export const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
}

// Start-of-script banner.
export function banner(title) {
  console.log('')
  console.log(c.bold(c.cyan(`━━━ ${title} ━━━`)))
}
