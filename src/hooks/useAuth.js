import { useEffect, useState } from 'react'
import { getCurrentUser, onAuthChange } from '../lib/auth'
import { getUserProfile } from '../lib/stubs'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadInitial = async () => {
      const u = await getCurrentUser()
      if (cancelled) return
      setUser(u)
      if (u) {
        const p = await getUserProfile()
        if (cancelled) return
        setProfile(p)
      }
      setLoading(false)
    }
    loadInitial()

    const { data: { subscription } } = onAuthChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const p = await getUserProfile()
        if (cancelled) return
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, loading }
}
