// Seed stretches from Wger REST API (free, no key).
// Fills the gap in free-exercise-db's stretching coverage.
// Idempotent: skips names already in the exercises table.

import { admin, banner, c, fetchWithRetry, sleep } from './_lib.js'

const BASE = 'https://wger.de/api/v2'
const LANG_EN = 2 // English
const PAGE_SIZE = 100

function stripHtml(html) {
  return html
    ?.replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchAllExercises() {
  const results = []
  let offset = 0
  while (true) {
    const url = `${BASE}/exerciseinfo/?format=json&language=${LANG_EN}&limit=${PAGE_SIZE}&offset=${offset}`
    const res = await fetchWithRetry(url, {}, { tries: 3, baseDelayMs: 1500 })
    const page = await res.json()
    results.push(...(page.results ?? []))
    if (!page.next) break
    offset += PAGE_SIZE
    process.stdout.write(`\r  fetched ${results.length}...`)
    await sleep(250) // be nice to the free API
  }
  console.log(`\r  fetched ${results.length} total exerciseinfos`)
  return results
}

function extractName(info) {
  // exerciseinfo returns a `translations` array — pick the English one.
  const en = (info.translations ?? []).find((t) => t.language === LANG_EN)
  return en?.name?.trim() || info.name?.trim() || null
}

function extractDescription(info) {
  const en = (info.translations ?? []).find((t) => t.language === LANG_EN)
  return stripHtml(en?.description || info.description || '')
}

async function main() {
  banner('STEP 2 — Wger stretches')

  console.log('Fetching Wger exercise catalog (paginated)...')
  const all = await fetchAllExercises()

  // Filter to stretches only.
  const stretches = all.filter((x) => {
    const catName = x.category?.name?.toLowerCase()
    return catName === 'stretching'
  })
  console.log(`  stretching category: ${stretches.length}`)

  // Load existing names to skip
  const { data: existing, error: selErr } = await admin
    .from('exercises')
    .select('name')
  if (selErr) throw selErr
  const existingNames = new Set(existing.map((r) => r.name.toLowerCase()))

  const rows = []
  for (const s of stretches) {
    const name = extractName(s)
    const description = extractDescription(s)
    if (!name) continue
    if (description.length < 20) continue
    if (existingNames.has(name.toLowerCase())) continue

    rows.push({
      name,
      muscle_primary: s.muscles?.[0]?.name_en?.toLowerCase() || 'full body',
      muscle_secondary: (s.muscles_secondary ?? [])
        .map((m) => m.name_en?.toLowerCase())
        .filter(Boolean),
      equipment: 'body weight',
      location: 'anywhere',
      exercise_type: 'stretch',
      difficulty: 'beginner',
      default_sets: 2,
      default_reps: null,
      default_rest_seconds: 0,
      default_hold_seconds: 45,
      instructions: [description],
      tips: [],
      source: 'wger',
    })
  }

  console.log(`  valid new stretches to insert: ${rows.length}`)

  let inserted = 0
  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH)
    const { error } = await admin.from('exercises').insert(chunk)
    if (error) {
      console.error(c.red(`  batch ${i / BATCH} failed:`), error.message)
      throw error
    }
    inserted += chunk.length
    process.stdout.write(`\r  inserted ${inserted}/${rows.length}`)
  }
  console.log('')
  console.log(c.green(`✓ done — ${inserted} stretches inserted`))
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
