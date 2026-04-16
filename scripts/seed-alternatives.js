// After all exercises are in place, build the alternatives graph.
// For each exercise: up to 5 others with same muscle_primary, different
// equipment, location-compatible. Prefers same location over 'anywhere'.

import { admin, banner, c } from './_lib.js'

async function main() {
  banner('STEP 6 — alternatives graph')

  const { data: exercises, error } = await admin
    .from('exercises')
    .select('id, name, muscle_primary, location, equipment, exercise_type')
    .order('muscle_primary')
  if (error) throw error
  console.log(`  loaded ${exercises.length} exercises`)

  // Group by (muscle_primary, exercise_type) — don't mix stretches into strength alternatives etc.
  const groups = new Map()
  for (const ex of exercises) {
    const key = `${ex.muscle_primary}|${ex.exercise_type}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(ex)
  }

  let updated = 0
  const UPDATE_BATCH = 100
  const pending = []

  for (const ex of exercises) {
    const siblings = groups.get(`${ex.muscle_primary}|${ex.exercise_type}`) ?? []
    const candidates = siblings
      .filter(
        (s) =>
          s.id !== ex.id &&
          (s.location === ex.location || s.location === 'anywhere' || ex.location === 'anywhere'),
      )
      .sort((a, b) => {
        // same location first
        const aScore = a.location === ex.location ? 0 : 1
        const bScore = b.location === ex.location ? 0 : 1
        if (aScore !== bScore) return aScore - bScore
        // different equipment preferred (more variety)
        const aVar = a.equipment !== ex.equipment ? 0 : 1
        const bVar = b.equipment !== ex.equipment ? 0 : 1
        return aVar - bVar
      })
      .slice(0, 5)
      .map((s) => s.id)

    if (candidates.length === 0) continue

    pending.push({ id: ex.id, alternatives: candidates })
    if (pending.length >= UPDATE_BATCH) {
      await Promise.all(
        pending.map(({ id, alternatives }) =>
          admin.from('exercises').update({ alternatives }).eq('id', id),
        ),
      )
      updated += pending.length
      process.stdout.write(`\r  updated ${updated}/${exercises.length}`)
      pending.length = 0
    }
  }

  if (pending.length > 0) {
    await Promise.all(
      pending.map(({ id, alternatives }) =>
        admin.from('exercises').update({ alternatives }).eq('id', id),
      ),
    )
    updated += pending.length
  }
  console.log('')
  console.log(c.green(`✓ assigned alternatives for ${updated} exercises`))
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
