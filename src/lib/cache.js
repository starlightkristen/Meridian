// localStorage cache with TTL. Safe to fail silently on storage errors (private mode, quota).

export const CACHE_TTL = {
  workout: 7 * 24 * 60 * 60 * 1000, // 7 days
  history: 24 * 60 * 60 * 1000, // 1 day
  profile: 60 * 60 * 1000, // 1 hour
}

export const cacheSet = (key, data, ttl) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, expires: Date.now() + ttl }),
    )
  } catch {
    // ignore quota / unavailable storage
  }
}

export const cacheGet = (key) => {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    const { data, expires } = JSON.parse(item)
    if (Date.now() > expires) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch {
    return null
  }
}

export const cacheClear = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const isOnline = () =>
  typeof navigator === 'undefined' ? true : navigator.onLine
