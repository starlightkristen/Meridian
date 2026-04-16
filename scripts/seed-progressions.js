// Bodyweight progression ladders: push-up, pull-up, squat, plank.
// Idempotent: skips if progressions table already has >= 25 rows.

import { admin, banner, c } from './_lib.js'

const DATA = {
  push_up: [
    { level: 1, name: 'Wall Push-up', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 2, name: 'Knee Push-up', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 3, name: 'Standard Push-up', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 4, name: 'Wide Push-up', target_sets: 3, target_reps: 12, unlocks_next_at_reps: 12 },
    { level: 5, name: 'Diamond Push-up', target_sets: 3, target_reps: 10, unlocks_next_at_reps: 10 },
    { level: 6, name: 'Archer Push-up', target_sets: 3, target_reps: 8, unlocks_next_at_reps: 8 },
    { level: 7, name: 'Single-arm Push-up', target_sets: 3, target_reps: 5, unlocks_next_at_reps: null },
  ],
  pull_up: [
    { level: 1, name: 'Dead Hang', target_sets: 3, target_hold_seconds: 30, unlocks_next_at_reps: 30 },
    { level: 2, name: 'Scapular Pull', target_sets: 3, target_reps: 10, unlocks_next_at_reps: 10 },
    { level: 3, name: 'Negative Pull-up', target_sets: 3, target_reps: 5, unlocks_next_at_reps: 5 },
    { level: 4, name: 'Banded Pull-up', target_sets: 3, target_reps: 8, unlocks_next_at_reps: 8 },
    { level: 5, name: 'Pull-up', target_sets: 3, target_reps: 10, unlocks_next_at_reps: 10 },
    { level: 6, name: 'Chest-to-Bar Pull-up', target_sets: 3, target_reps: 8, unlocks_next_at_reps: 8 },
    { level: 7, name: 'Weighted Pull-up', target_sets: 3, target_reps: 5, unlocks_next_at_reps: null },
  ],
  squat: [
    { level: 1, name: 'Assisted Squat', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 2, name: 'Bodyweight Squat', target_sets: 3, target_reps: 20, unlocks_next_at_reps: 20 },
    { level: 3, name: 'Jump Squat', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 4, name: 'Bulgarian Split Squat', target_sets: 3, target_reps: 12, unlocks_next_at_reps: 12 },
    { level: 5, name: 'Assisted Pistol Squat', target_sets: 3, target_reps: 8, unlocks_next_at_reps: 8 },
    { level: 6, name: 'Pistol Squat', target_sets: 3, target_reps: 5, unlocks_next_at_reps: null },
  ],
  plank: [
    { level: 1, name: 'Knee Plank', target_sets: 3, target_hold_seconds: 20, unlocks_next_at_reps: 20 },
    { level: 2, name: 'Standard Plank', target_sets: 3, target_hold_seconds: 30, unlocks_next_at_reps: 30 },
    { level: 3, name: 'Plank Shoulder Tap', target_sets: 3, target_reps: 20, unlocks_next_at_reps: 20 },
    { level: 4, name: 'Plank Leg Lift', target_sets: 3, target_reps: 15, unlocks_next_at_reps: 15 },
    { level: 5, name: 'RKC Plank', target_sets: 3, target_hold_seconds: 20, unlocks_next_at_reps: 20 },
    { level: 6, name: 'Plank to Push-up', target_sets: 3, target_reps: 10, unlocks_next_at_reps: 10 },
    { level: 7, name: 'Dragon Flag', target_sets: 3, target_reps: 5, unlocks_next_at_reps: null },
  ],
}

async function main() {
  banner('STEP 5 — bodyweight progressions')

  const { count, error: countErr } = await admin
    .from('progressions')
    .select('id', { count: 'exact', head: true })
  if (countErr) throw countErr
  if (count >= 25) {
    console.log(`  skip — already have ${count} progression rows`)
    return
  }

  // Load existing (exercise_family, level) pairs to dedup.
  const { data: existing, error: selErr } = await admin
    .from('progressions')
    .select('exercise_family, level')
  if (selErr) throw selErr
  const existingKey = new Set(existing.map((r) => `${r.exercise_family}|${r.level}`))

  const rows = []
  for (const [family, levels] of Object.entries(DATA)) {
    for (const lvl of levels) {
      if (existingKey.has(`${family}|${lvl.level}`)) continue
      rows.push({
        exercise_family: family,
        level: lvl.level,
        name: lvl.name,
        target_sets: lvl.target_sets ?? null,
        target_reps: lvl.target_reps ?? null,
        target_hold_seconds: lvl.target_hold_seconds ?? null,
        unlocks_next_at_reps: lvl.unlocks_next_at_reps ?? null,
      })
    }
  }

  if (rows.length === 0) {
    console.log('  no new rows to insert')
    return
  }

  const { error } = await admin.from('progressions').insert(rows)
  if (error) throw error
  console.log(c.green(`✓ inserted ${rows.length} progression rows across ${Object.keys(DATA).length} families`))
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
