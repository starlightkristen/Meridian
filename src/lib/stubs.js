// Data layer. Every page calls through this module.
// Signatures are stable — internals swap between stub/Supabase without page edits.

import { supabase } from './supabase'
import { getRecommendation as computeRecommendation } from './recommendations'
import { cacheGet, cacheSet, CACHE_TTL, isOnline } from './cache'

// ───────────────────────────────────────────────────────────
// Auth / Profile
// ───────────────────────────────────────────────────────────

export const getUserProfile = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()
  return data
}

export const saveUserProfile = async (profile) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ id: session.user.id, ...profile, updated_at: new Date().toISOString() })
  return !error
}

// ───────────────────────────────────────────────────────────
// Schedules
// ───────────────────────────────────────────────────────────

export const getSchedules = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []
  const { data } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', session.user.id)
    .order('day_of_week')
  return data ?? []
}

export const saveSchedule = async (schedule) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const { error } = await supabase
    .from('schedules')
    .upsert({ user_id: session.user.id, ...schedule })
  return !error
}

// ───────────────────────────────────────────────────────────
// Workout for day (with offline cache)
// ───────────────────────────────────────────────────────────

const EQUIPMENT_FOR_LOCATION = {
  gym: ['leverage machine', 'cable', 'dumbbell', 'smith machine', 'assisted'],
  home: ['barbell', 'dumbbell', 'body weight'],
  home_barbell: ['barbell'],
  home_bodyweight: ['body weight'],
  home_pilates: ['pilates_bar'],
}

const cacheKey = (day, location) => `workout_${String(day).toLowerCase()}_${location}`

export const getWorkoutForDay = async (day, location) => {
  const key = cacheKey(day, location)

  const runNetwork = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data: schedule } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('day_of_week', String(day).toLowerCase())
      .eq('location', location)
      .maybeSingle()

    if (!schedule || schedule.routine_type === 'rest') return null

    const equipment = EQUIPMENT_FOR_LOCATION[location] ?? EQUIPMENT_FOR_LOCATION.gym

    const { data: exercises } = await supabase
      .from('exercises')
      .select('*')
      .in('equipment', equipment)
      .eq('exercise_type', 'strength')
      .limit(6)

    const withHistory = await Promise.all(
      (exercises ?? []).map(async (ex) => {
        const history = await getExerciseHistory(ex.id)
        const rec = computeRecommendation(ex, history)
        return {
          ...ex,
          muscle: ex.muscle_primary,
          sets: ex.default_sets,
          reps: ex.default_reps,
          last_weight: history?.last_weight ?? null,
          recommendation: rec.weight,
          rec_note: rec.note,
        }
      }),
    )

    return {
      day,
      location,
      name: schedule.routine_type,
      exercises: withHistory,
    }
  }

  // Offline → serve cache directly
  if (!isOnline()) {
    return cacheGet(key)
  }

  try {
    const result = await runNetwork()
    if (result) cacheSet(key, result, CACHE_TTL.workout)
    return result
  } catch {
    return cacheGet(key)
  }
}

// ───────────────────────────────────────────────────────────
// Exercise history + recommendation wrapper
// ───────────────────────────────────────────────────────────

export const getExerciseHistory = async (exerciseId) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('exercise_id', exerciseId)
    .order('session_date', { ascending: false })
    .order('set_number', { ascending: true })
    .limit(10)

  if (!data || data.length === 0) return null

  const lastSession = data[0].session_date
  const lastSessionLogs = data.filter((l) => l.session_date === lastSession)
  const maxWeight = Math.max(...lastSessionLogs.map((l) => l.weight_lbs ?? 0))
  const allTimeMax = Math.max(...data.map((l) => l.weight_lbs ?? 0))

  return {
    last_weight: maxWeight,
    last_reps: lastSessionLogs[0]?.reps ?? null,
    sets_completed: lastSessionLogs.length,
    target_sets: 3,
    session_date: lastSession,
    all_time_max: allTimeMax,
  }
}

// Wrapper keeps the old `getRecommendation(exerciseId)` stub signature stable.
// The pure engine in ./recommendations.js takes (exercise, history) — this fetches both.
export const getRecommendation = async (exerciseId) => {
  const [history, { data: exercise }] = await Promise.all([
    getExerciseHistory(exerciseId),
    supabase.from('exercises').select('*').eq('id', exerciseId).maybeSingle(),
  ])
  return computeRecommendation(exercise, history)
}

// ───────────────────────────────────────────────────────────
// Logs + workout sessions
// ───────────────────────────────────────────────────────────

export const saveLogs = async (logs) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const today = new Date().toISOString().split('T')[0]
  const rows = (Array.isArray(logs) ? logs : [logs]).map((log) => ({
    user_id: session.user.id,
    session_date: today,
    ...log,
  }))
  const { error } = await supabase.from('logs').insert(rows)
  return !error
}

export const saveWorkoutSession = async (sessionData) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: session.user.id,
      session_date: new Date().toISOString().split('T')[0],
      ...sessionData,
    })
    .select()
    .single()
  return error ? null : data
}

// ───────────────────────────────────────────────────────────
// Machine map
// ───────────────────────────────────────────────────────────

export const getMachineMap = async (qrValue) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data } = await supabase
    .from('machine_map')
    .select('*, exercises(*)')
    .eq('user_id', session.user.id)
    .eq('qr_value', qrValue)
    .maybeSingle()
  return data?.exercises ?? null
}

export const saveMachineMap = async (qrValue, exerciseId) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  const { error } = await supabase
    .from('machine_map')
    .upsert({
      user_id: session.user.id,
      qr_value: qrValue,
      exercise_id: exerciseId,
    })
  return !error
}

// ───────────────────────────────────────────────────────────
// Stats + history
// ───────────────────────────────────────────────────────────

export const getStats = async (range = '30d') => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { workouts: 0, prs: 0, volume: 0, streak: 0 }

  const days = parseInt(range) || 30
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().split('T')[0]

  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .gte('session_date', sinceStr)
    .order('session_date', { ascending: false })

  const workouts = sessions?.length ?? 0
  const volume = sessions?.reduce((sum, s) => sum + (s.total_volume_lbs ?? 0), 0) ?? 0
  const prs = sessions?.filter((s) => s.prs_hit && s.prs_hit.length > 0).length ?? 0

  let streak = 0
  if (sessions && sessions.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    const dates = [...new Set(sessions.map((s) => s.session_date))].sort().reverse()
    let current = new Date(today)
    for (const date of dates) {
      const d = new Date(date)
      const diff = Math.round((current - d) / (1000 * 60 * 60 * 24))
      if (diff <= 1) {
        streak++
        current = d
      } else {
        break
      }
    }
  }

  return { workouts, volume, prs, streak }
}

export const getWorkoutSessions = async (limit = 20, offset = 0) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []
  const { data } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('session_date', { ascending: false })
    .range(offset, offset + limit - 1)
  return data ?? []
}

// ───────────────────────────────────────────────────────────
// Exercise library
// ───────────────────────────────────────────────────────────

export const getExercises = async (filters = {}) => {
  let query = supabase.from('exercises').select('*')
  if (filters.muscle) query = query.eq('muscle_primary', filters.muscle)
  if (filters.equipment) query = query.eq('equipment', filters.equipment)
  if (filters.location) query = query.eq('location', filters.location)
  if (filters.type) query = query.eq('exercise_type', filters.type)
  if (filters.q) query = query.ilike('name', `%${filters.q}%`)
  if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
  query = query.order('name').limit(filters.limit ?? 50)
  const { data } = await query
  return data ?? []
}

// ───────────────────────────────────────────────────────────
// Stretch
// ───────────────────────────────────────────────────────────

const STRETCH_CATEGORIES = [
  { slug: 'morning', label: 'Morning Mobility', muscle: null },
  { slug: 'pre_workout', label: 'Pre-Workout Dynamic', muscle: null },
  { slug: 'post_workout', label: 'Post-Workout Static', muscle: null },
  { slug: 'lower_body', label: 'Lower Body Focus', muscle: ['hamstrings', 'quads', 'glutes', 'calves'] },
  { slug: 'upper_body', label: 'Upper Body Focus', muscle: ['chest', 'shoulders', 'back', 'arms'] },
  { slug: 'full_body', label: 'Full Body Flow', muscle: null },
  { slug: 'hip_spine', label: 'Hip Flexor & Spine', muscle: ['hip flexors', 'spine'] },
  { slug: 'evening', label: 'Evening Wind Down', muscle: null },
]

export const getStretchCategories = async () => {
  const withCounts = await Promise.all(
    STRETCH_CATEGORIES.map(async (cat) => {
      let query = supabase
        .from('exercises')
        .select('id', { count: 'exact', head: true })
        .eq('exercise_type', 'stretch')
      if (cat.muscle) query = query.in('muscle_primary', cat.muscle)
      const { count } = await query
      return { slug: cat.slug, label: cat.label, count: count ?? 0 }
    }),
  )
  return withCounts
}

const CATEGORY_MUSCLE_MAP = {
  morning: null,
  pre_workout: null,
  post_workout: null,
  lower_body: ['hamstrings', 'quads', 'glutes', 'calves', 'hip flexors'],
  upper_body: ['chest', 'shoulders', 'back', 'biceps', 'triceps'],
  full_body: null,
  hip_spine: ['hip flexors', 'spine', 'lower back'],
  evening: null,
}

export const getStretchSession = async (category) => {
  let query = supabase.from('exercises').select('*').eq('exercise_type', 'stretch')
  const muscles = CATEGORY_MUSCLE_MAP[category]
  if (muscles) query = query.in('muscle_primary', muscles)
  const { data } = await query.limit(8)
  return data ?? []
}

// ───────────────────────────────────────────────────────────
// Martial arts
// ───────────────────────────────────────────────────────────

export const getMartialArtsTechniques = async (art, category) => {
  let query = supabase.from('martial_arts_techniques').select('*').eq('art', art)
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  query = query.order('difficulty').order('name')
  const { data } = await query
  return data ?? []
}

// ───────────────────────────────────────────────────────────
// Progressions
// ───────────────────────────────────────────────────────────

export const getProgressions = async (exerciseFamily) => {
  const { data: { session } } = await supabase.auth.getSession()

  const { data: progressions } = await supabase
    .from('progressions')
    .select('*')
    .eq('exercise_family', exerciseFamily)
    .order('level')

  if (!session || !progressions) return progressions ?? []

  const { data: userProgress } = await supabase
    .from('user_progressions')
    .select('*')
    .eq('user_id', session.user.id)
    .in('progression_id', progressions.map((p) => p.id))

  return progressions.map((p) => {
    const up = userProgress?.find((u) => u.progression_id === p.id)
    return { ...p, status: up?.status ?? 'locked' }
  })
}
