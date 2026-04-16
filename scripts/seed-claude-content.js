// Static seed for content that free sources don't cover:
//   3A: 15 pilates bar exercises
//   3B: stretch gap fillers
//   3C: 10 morning mobility exercises
// Idempotent: checks existing names before inserting.

import { admin, banner, c } from './_lib.js'

async function existingNameSet() {
  const { data, error } = await admin.from('exercises').select('name')
  if (error) throw error
  return new Set(data.map((r) => r.name.toLowerCase()))
}

async function insertFresh(rows, existing) {
  const fresh = rows.filter((r) => !existing.has(r.name.toLowerCase()))
  if (fresh.length === 0) return 0
  const { error } = await admin.from('exercises').insert(fresh)
  if (error) throw error
  fresh.forEach((r) => existing.add(r.name.toLowerCase()))
  return fresh.length
}

const PILATES = [
  { name: 'Bar Squat', muscle_primary: 'quads', muscle_secondary: ['glutes'], instructions: ['Stand with feet hip-width, bar on shoulders', 'Hinge hips back, bend knees to 90°', 'Drive through heels to stand', 'Keep chest lifted throughout'], tips: ['Keep weight in heels', 'Knees track over toes'] },
  { name: 'Standing Oblique Crunch', muscle_primary: 'core', muscle_secondary: ['shoulders'], instructions: ['Hold bar overhead, feet hip-width', 'Lift one knee laterally toward elbow', 'Crunch obliques to bring bar toward knee', 'Return controlled, alternate sides'], tips: ['Move slowly for control'] },
  { name: 'Bar Hip Hinge', muscle_primary: 'hamstrings', muscle_secondary: ['glutes', 'lower back'], instructions: ['Bar across shoulders, soft knee bend', 'Hinge forward at hips keeping back flat', 'Lower until torso near parallel', 'Drive hips forward to stand'], tips: ['Feel the stretch in hamstrings'] },
  { name: 'Bar Overhead Reach', muscle_primary: 'shoulders', muscle_secondary: ['core'], instructions: ['Hold bar at chest width', 'Press overhead until arms fully extended', 'Hold 2 seconds at top', 'Lower with control'], tips: ['Engage core to protect lower back'] },
  { name: 'Bar Roll Down', muscle_primary: 'core', muscle_secondary: ['hamstrings'], instructions: ['Stand tall, bar at hips', 'Tuck chin, roll spine down vertebra by vertebra', 'Let bar slide down legs', 'Roll back up stacking spine'], tips: ['Breathe out on the way down'] },
  { name: 'Bar Chest Opener', muscle_primary: 'chest', muscle_secondary: ['shoulders'], instructions: ['Hold bar behind back, wide grip', 'Lift bar away from body, squeezing shoulder blades', 'Hold 3 seconds', 'Lower slowly'], tips: ['Great for desk posture correction'] },
  { name: 'Bar Side Bend', muscle_primary: 'core', muscle_secondary: ['back'], instructions: ['Bar on shoulders behind neck', 'Lean laterally to one side', 'Feel stretch on opposite oblique', 'Return to center, alternate'], tips: ['Keep hips square, don\'t twist'] },
  { name: 'Bar Standing Leg Lift', muscle_primary: 'hip flexors', muscle_secondary: ['core'], instructions: ['Hold bar for balance at chest', 'Lift one leg forward, knee straight', 'Hold at top for 2 seconds', 'Lower controlled, switch sides'], tips: ['Keep standing leg slightly bent'] },
  { name: 'Bar Lunge', muscle_primary: 'quads', muscle_secondary: ['glutes', 'hamstrings'], instructions: ['Bar on shoulders, step forward into lunge', 'Lower back knee toward floor', 'Front knee at 90°', 'Push off front foot to return'], tips: ['Keep torso upright'] },
  { name: 'Bar Good Morning', muscle_primary: 'lower back', muscle_secondary: ['hamstrings', 'glutes'], instructions: ['Bar across upper back', 'Hinge at hips with slight knee bend', 'Lower torso to parallel', 'Squeeze glutes to return upright'], tips: ['Keep back flat, not rounded'] },
  { name: 'Bar Romanian Deadlift', muscle_primary: 'hamstrings', muscle_secondary: ['glutes', 'lower back'], instructions: ['Hold bar in front of thighs', 'Hinge at hips, sliding bar down legs', 'Stop when you feel hamstring stretch', 'Drive hips forward to stand'], tips: ['Bar stays close to body'] },
  { name: 'Bar Bent Over Row', muscle_primary: 'back', muscle_secondary: ['biceps'], instructions: ['Hinge forward 45°, bar hanging', 'Pull bar to lower chest', 'Squeeze shoulder blades at top', 'Lower with control'], tips: ['Don\'t round your back'] },
  { name: 'Bar Shoulder Press', muscle_primary: 'shoulders', muscle_secondary: ['triceps'], instructions: ['Hold bar at collarbone height', 'Press straight overhead', 'Lock out at top', 'Lower to starting position'], tips: ['Brace core throughout'] },
  { name: 'Bar Bicep Curl', muscle_primary: 'biceps', muscle_secondary: ['forearms'], instructions: ['Hold bar with underhand grip at thighs', 'Curl bar toward shoulders', 'Squeeze at top', 'Lower slowly'], tips: ['Keep elbows pinned to sides'] },
  { name: 'Bar Core Rotation', muscle_primary: 'core', muscle_secondary: ['shoulders'], instructions: ['Hold bar at chest, arms extended', 'Rotate torso left, pivoting back foot', 'Return to center', 'Rotate right'], tips: ['Power comes from the hips'] },
].map((ex) => ({
  ...ex,
  equipment: 'pilates_bar',
  location: 'home',
  exercise_type: 'pilates',
  difficulty: 'beginner',
  default_sets: 3,
  default_reps: 15,
  default_rest_seconds: 60,
  default_hold_seconds: null,
  source: 'static',
}))

const STRETCH_GAPS = [
  { name: 'Kneeling Hip Flexor Stretch', muscle_primary: 'hip flexors', instructions: ['Kneel on one knee, other foot forward', 'Shift weight forward until stretch felt in front of rear hip', 'Keep torso upright, squeeze rear glute', 'Hold 45 seconds, switch sides'] },
  { name: 'Couch Stretch', muscle_primary: 'hip flexors', instructions: ['Place rear foot on a wall or couch behind you', 'Front foot flat, lunge position', 'Drive hips forward for deep hip flexor stretch', 'Hold 45 seconds per side'] },
  { name: 'Standing Hip Flexor Reach', muscle_primary: 'hip flexors', instructions: ['Staggered stance, rear heel lifted', 'Tuck pelvis under, reach same-side arm overhead', 'Lean slightly away from rear leg', 'Hold 30 seconds per side'] },
  { name: 'Half-Kneeling Psoas Stretch', muscle_primary: 'hip flexors', instructions: ['Half-kneeling, squeeze rear glute', 'Tuck pelvis under and shift forward', 'Raise same-side arm for deeper stretch', 'Hold 45 seconds'] },
  { name: 'Thoracic Rotation on Floor', muscle_primary: 'thoracic spine', instructions: ['Lie on side, knees bent 90°', 'Top arm opens toward ceiling and behind', 'Follow hand with eyes, let torso rotate', 'Hold 3 seconds, return, repeat 8 times'] },
  { name: 'Cat-Cow Thoracic Focus', muscle_primary: 'thoracic spine', instructions: ['All fours, hands under shoulders', 'Round upper back toward ceiling (cat)', 'Drop chest toward floor, lift head (cow)', 'Move slowly, 10 reps'] },
  { name: 'Thread the Needle', muscle_primary: 'thoracic spine', instructions: ['All fours position', 'Slide one arm under body across the floor', 'Let shoulder and head rest on ground', 'Hold 30 seconds per side'] },
  { name: 'Foam Roller Thoracic Extension', muscle_primary: 'thoracic spine', instructions: ['Lie on foam roller across upper back', 'Support head with hands', 'Gently extend over roller', 'Move roller to different segments, 30 seconds each'] },
  { name: 'Neck Side Bend Stretch', muscle_primary: 'neck', instructions: ['Sit or stand tall', 'Tilt ear toward shoulder', 'Gently press with same-side hand', 'Hold 30 seconds per side'] },
  { name: 'Chin Tuck Stretch', muscle_primary: 'neck', instructions: ['Sit tall, eyes forward', 'Draw chin straight back (double chin)', 'Hold 5 seconds, release', 'Repeat 10 times'] },
  { name: 'Neck Rotation Stretch', muscle_primary: 'neck', instructions: ['Sit tall, rotate head to one side', 'Look over shoulder as far as comfortable', 'Hold 20 seconds', 'Repeat other side'] },
  { name: 'Wrist Flexor Stretch', muscle_primary: 'forearms', instructions: ['Extend arm forward, palm up', 'Use other hand to pull fingers downward', 'Keep elbow straight', 'Hold 30 seconds per arm'] },
  { name: 'Wrist Extensor Stretch', muscle_primary: 'forearms', instructions: ['Extend arm forward, palm down', 'Use other hand to press back of hand down', 'Keep elbow straight', 'Hold 30 seconds per arm'] },
  { name: 'Prayer Stretch', muscle_primary: 'forearms', instructions: ['Press palms together at chest height', 'Lower hands while keeping palms together', 'Feel stretch in inner wrists/forearms', 'Hold 30 seconds'] },
].map((ex) => ({
  ...ex,
  muscle_secondary: [],
  equipment: 'body weight',
  location: 'anywhere',
  exercise_type: 'stretch',
  difficulty: 'beginner',
  default_sets: 2,
  default_reps: null,
  default_rest_seconds: 0,
  default_hold_seconds: 45,
  tips: [],
  source: 'static',
}))

const MOBILITY = [
  { name: 'Arm Circles', muscle_primary: 'shoulders', instructions: ['Stand tall, extend arms to sides', 'Circle forward 15 times', 'Circle backward 15 times'] },
  { name: 'Hip Circles', muscle_primary: 'hip flexors', instructions: ['Stand on one leg, hold wall if needed', 'Draw large circles with lifted knee', '10 circles each direction, each leg'] },
  { name: 'Ankle Circles', muscle_primary: 'calves', instructions: ['Lift one foot off ground', 'Rotate ankle in full circles', '10 each direction per ankle'] },
  { name: 'Cat-Cow Flow', muscle_primary: 'thoracic spine', instructions: ['All fours position', 'Alternate between rounding and arching spine', 'Match movement to breath, 1 minute'] },
  { name: 'World\'s Greatest Stretch', muscle_primary: 'hip flexors', instructions: ['Lunge forward, place both hands inside front foot', 'Rotate torso and reach top arm to ceiling', 'Return hand to floor, switch sides', '5 per side'] },
  { name: 'Leg Swings', muscle_primary: 'hamstrings', instructions: ['Hold wall for balance', 'Swing one leg forward and back like a pendulum', '15 swings per leg, increase range gradually'] },
  { name: 'Thoracic Windmill', muscle_primary: 'thoracic spine', instructions: ['Lie on side, knees stacked and bent', 'Top arm sweeps over body in an arc', 'Follow hand with eyes, let chest open', '8 per side'] },
  { name: 'Inchworm', muscle_primary: 'hamstrings', instructions: ['Stand tall, fold forward, walk hands out to plank', 'Walk feet toward hands', 'Stand up and repeat 5 times'] },
  { name: 'Deep Squat Hold', muscle_primary: 'hip flexors', instructions: ['Squat as deep as comfortable, heels down', 'Press elbows against inner knees', 'Hold 30 seconds, breathe deeply'] },
  { name: 'Neck CARs', muscle_primary: 'neck', instructions: ['Stand tall, chin to chest', 'Slowly roll head in largest circle possible', 'Keep shoulders still, 3 circles each direction'] },
].map((ex) => ({
  ...ex,
  muscle_secondary: [],
  equipment: 'body weight',
  location: 'anywhere',
  exercise_type: 'mobility',
  difficulty: 'beginner',
  default_sets: 1,
  default_reps: null,
  default_rest_seconds: 0,
  default_hold_seconds: 30,
  tips: [],
  source: 'static',
}))

async function main() {
  banner('STEP 3 — static content (pilates / stretch gaps / mobility)')

  const existing = await existingNameSet()

  console.log(c.cyan('\n3A — pilates bar exercises'))
  const p = await insertFresh(PILATES, existing)
  console.log(c.green(`  ✓ ${p} inserted`))

  console.log(c.cyan('\n3B — stretch gap fillers'))
  const s = await insertFresh(STRETCH_GAPS, existing)
  console.log(c.green(`  ✓ ${s} inserted`))

  console.log(c.cyan('\n3C — morning mobility'))
  const m = await insertFresh(MOBILITY, existing)
  console.log(c.green(`  ✓ ${m} inserted`))

  console.log(c.green(`\n✓ done — +${p} pilates, +${s} stretch, +${m} mobility`))
}

main().catch((err) => {
  console.error(c.red('FAILED:'), err.message)
  process.exit(1)
})
