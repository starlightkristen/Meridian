// Progressive overload engine. Pure functions — no I/O.

export function getRecommendation(exercise, history) {
  if (!history || history.last_weight == null) {
    return {
      weight: 0,
      note: 'First time — start light, focus on form',
    }
  }
  const { last_weight, sets_completed, target_sets } = history
  const completionRate = sets_completed / (target_sets ?? 3)

  if (completionRate >= 1) {
    return {
      weight: last_weight + 5,
      note: `Hit all ${target_sets} sets ✓ — ready to go up`,
    }
  }
  if (completionRate >= 0.66) {
    return {
      weight: last_weight,
      note: 'Almost there — same weight, finish all sets',
    }
  }
  return {
    weight: Math.max(0, last_weight - 5),
    note: 'Drop back — nail the form first',
  }
}

export function detectPR(exerciseId, newWeight, history) {
  if (!history?.all_time_max) return true
  return newWeight > history.all_time_max
}

export function calculateVolume(logs) {
  return logs.reduce(
    (sum, log) => sum + ((log.weight_lbs ?? 0) * (log.reps ?? 0)),
    0,
  )
}

export function calculatePlates(targetLbs, barWeightLbs = 45) {
  const plateSizes = [45, 35, 25, 10, 5, 2.5]
  let remaining = (targetLbs - barWeightLbs) / 2
  const plates = []
  for (const size of plateSizes) {
    while (remaining >= size) {
      plates.push(size)
      remaining -= size
      remaining = Math.round(remaining * 10) / 10
    }
  }
  return plates
}
