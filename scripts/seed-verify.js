// Verify seed minimums. Exits 1 if any check fails.
// Runs 12 count queries against Supabase via admin client.

import { admin, banner, c } from './_lib.js'

const CHECKS = [
  { label: 'Total exercises',        table: 'exercises', min: 400 },
  { label: 'Gym exercises',          table: 'exercises', min: 100, filter: ['location', 'gym'] },
  { label: 'Home exercises',         table: 'exercises', min: 80,  filter: ['location', 'home'] },
  { label: 'Anywhere exercises',     table: 'exercises', min: 50,  filter: ['location', 'anywhere'] },
  { label: 'Stretches',              table: 'exercises', min: 60,  filter: ['exercise_type', 'stretch'] },
  { label: 'Pilates exercises',      table: 'exercises', min: 15,  filter: ['equipment', 'pilates_bar'] },
  { label: 'Mobility exercises',     table: 'exercises', min: 8,   filter: ['exercise_type', 'mobility'] },
  { label: 'Muay Thai techniques',   table: 'martial_arts_techniques', min: 40, filter: ['art', 'muay_thai'] },
  { label: 'Krav Maga techniques',   table: 'martial_arts_techniques', min: 30, filter: ['art', 'krav_maga'] },
  { label: 'BJJ techniques',         table: 'martial_arts_techniques', min: 35, filter: ['art', 'bjj'] },
  { label: 'Progressions',           table: 'progressions', min: 25 },
  { label: 'Exercises with images',  table: 'exercises', min: 200, notNull: 'gif_url' },
]

async function count(check) {
  let q = admin.from(check.table).select('id', { count: 'exact', head: true })
  if (check.filter) q = q.eq(check.filter[0], check.filter[1])
  if (check.notNull) q = q.not(check.notNull, 'is', null)
  const { count: n, error } = await q
  if (error) throw error
  return n ?? 0
}

async function main() {
  banner('STEP 7 — verify seed')

  let failed = 0
  console.log('')
  console.log('  Check                          Count     Min       Status')
  console.log('  ' + '─'.repeat(62))

  for (const check of CHECKS) {
    try {
      const n = await count(check)
      const pad = (s, w) => String(s).padEnd(w)
      const ok = n >= check.min
      const status = ok ? c.green('✓ pass') : c.red('✗ FAIL')
      console.log(
        `  ${pad(check.label, 30)} ${pad(n, 9)} ${pad(check.min, 9)} ${status}`,
      )
      if (!ok) failed++
    } catch (err) {
      console.log(`  ${check.label.padEnd(30)} ${c.red('ERROR')}: ${err.message}`)
      failed++
    }
  }

  console.log('')
  if (failed > 0) {
    console.log(c.red(`✗ ${failed} check(s) failed`))
    process.exit(1)
  } else {
    console.log(c.green('✓ all checks passed'))
  }
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
