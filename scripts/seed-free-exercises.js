// Seed from free-exercise-db (public domain GitHub JSON).
// Idempotent: checks existing (name,location) pairs before inserting.
// Re-run anytime without duplicates.

import { admin, banner, c, fetchWithRetry } from './_lib.js'

const RAW_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMG_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

const EQUIPMENT_TO_OURS = {
  barbell: { location: 'home', equipment: 'barbell' },
  dumbbell: { location: 'home', equipment: 'dumbbell' },
  'body only': { location: 'anywhere', equipment: 'body weight' },
  machine: { location: 'gym', equipment: 'leverage machine' },
  cable: { location: 'gym', equipment: 'cable' },
  kettlebells: { location: 'home', equipment: 'kettlebell' },
  bands: { location: 'home', equipment: 'resistance band' },
  'medicine ball': { location: 'anywhere', equipment: 'medicine ball' },
  'exercise ball': { location: 'home', equipment: 'exercise ball' },
  'foam roll': { location: 'anywhere', equipment: 'foam roller' },
  'e-z curl bar': { location: 'home', equipment: 'ez bar' },
  other: { location: 'anywhere', equipment: 'other' },
}

const MUSCLE_TO_OURS = {
  chest: 'chest',
  'middle back': 'back',
  lats: 'back',
  'lower back': 'lower back',
  traps: 'back',
  shoulders: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearms',
  abdominals: 'core',
  quadriceps: 'quads',
  hamstrings: 'hamstrings',
  glutes: 'glutes',
  calves: 'calves',
  abductors: 'glutes',
  adductors: 'inner thighs',
  neck: 'neck',
}

const CATEGORY_TO_TYPE = {
  stretching: 'stretch',
  cardio: 'cardio',
  plyometrics: 'plyometrics',
  // everything else → 'strength' (see fallback below)
}

const LEVEL_TO_DIFFICULTY = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  expert: 'advanced',
}

const mapMuscle = (m) => MUSCLE_TO_OURS[m?.toLowerCase()] ?? m?.toLowerCase() ?? null
const mapType = (cat) => CATEGORY_TO_TYPE[cat?.toLowerCase()] ?? 'strength'
const mapDifficulty = (lvl) => LEVEL_TO_DIFFICULTY[lvl?.toLowerCase()] ?? 'beginner'

function mapEquipment(raw) {
  if (!raw) return { location: 'anywhere', equipment: 'body weight' }
  const key = raw.toLowerCase()
  return EQUIPMENT_TO_OURS[key] ?? { location: 'anywhere', equipment: key }
}

function buildRow(ex, { locationOverride } = {}) {
  const { location, equipment } = mapEquipment(ex.equipment)
  const primary = mapMuscle(ex.primaryMuscles?.[0])
  if (!primary) return null

  return {
    name: ex.name,
    muscle_primary: primary,
    muscle_secondary: (ex.secondaryMuscles ?? []).map(mapMuscle).filter(Boolean),
    equipment,
    location: locationOverride ?? location,
    exercise_type: mapType(ex.category),
    difficulty: mapDifficulty(ex.level),
    default_sets: 3,
    default_reps: 10,
    default_rest_seconds: 90,
    default_hold_seconds: null,
    gif_url: ex.images?.[0] ? `${IMG_BASE}${ex.images[0]}` : null,
    instructions: ex.instructions ?? [],
    tips: [],
    source: 'free-exercise-db',
  }
}

function dedupByName(rows) {
  // Keep non-assisted preferred over assisted for same primary muscle.
  const seen = new Map() // key: name.toLowerCase() → row
  for (const r of rows) {
    const key = r.name.toLowerCase()
    if (!seen.has(key)) {
      seen.set(key, r)
      continue
    }
    const prior = seen.get(key)
    const priorAssisted = prior.name.toLowerCase().includes('assisted')
    const newAssisted = r.name.toLowerCase().includes('assisted')
    if (priorAssisted && !newAssisted) seen.set(key, r)
  }
  return [...seen.values()]
}

async function main() {
  banner('STEP 1 — free-exercise-db seed')

  console.log('Fetching exercise dataset...')
  const res = await fetchWithRetry(RAW_URL, {}, { tries: 3, baseDelayMs: 1000 })
  const raw = await res.json()
  console.log(`  got ${raw.length} exercises`)

  // Build rows. Dumbbells: insert once gym, once home (per spec).
  const rows = []
  for (const ex of raw) {
    const base = buildRow(ex)
    if (!base) continue
    rows.push(base)
    if (ex.equipment?.toLowerCase() === 'dumbbell') {
      rows.push(buildRow(ex, { locationOverride: 'gym' }))
    }
  }

  // Dedup by (name, location) — two dumbbell rows should survive (different locations).
  const byKey = new Map()
  for (const r of rows) {
    const key = `${r.name.toLowerCase()}|${r.location}`
    if (!byKey.has(key)) byKey.set(key, r)
  }
  const deduped = dedupByName([...byKey.values()])
  console.log(`  after dedup: ${deduped.length} rows`)

  // Check existing (name, location) pairs in DB to skip inserts.
  const { data: existing, error: selErr } = await admin
    .from('exercises')
    .select('name, location')
  if (selErr) throw selErr
  const existingKey = new Set(existing.map((r) => `${r.name.toLowerCase()}|${r.location}`))

  const toInsert = deduped.filter(
    (r) => !existingKey.has(`${r.name.toLowerCase()}|${r.location}`),
  )
  console.log(`  already in DB: ${existing.length}`)
  console.log(`  to insert: ${toInsert.length}`)

  // Batch insert
  let inserted = 0
  const BATCH = 200
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const chunk = toInsert.slice(i, i + BATCH)
    const { error } = await admin.from('exercises').insert(chunk)
    if (error) {
      console.error(c.red(`  insert batch ${i / BATCH} failed:`), error.message)
      throw error
    }
    inserted += chunk.length
    process.stdout.write(`\r  inserted ${inserted}/${toInsert.length}`)
  }
  console.log('')

  // Breakdown
  const byLoc = deduped.reduce((acc, r) => {
    acc[r.location] = (acc[r.location] ?? 0) + 1
    return acc
  }, {})
  console.log(c.green(`✓ done`))
  console.log(`  by location: ${JSON.stringify(byLoc)}`)
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
