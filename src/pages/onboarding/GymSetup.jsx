import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OnboardingStep from './OnboardingStep'
import { saveSchedule, saveUserProfile } from '../../lib/stubs'

const OPTIONS = [
  { id: 'planet_fitness', name: 'Planet Fitness', sub: 'Machines, cables, dumbbells — no barbells' },
  { id: 'home_only', name: 'Home gym only', sub: 'Use your home equipment settings' },
  { id: 'other_gym', name: 'Other gym', sub: 'Customize available equipment' },
]

export default function GymSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state ?? {}
  const [picked, setPicked] = useState(prior.gym_type ?? 'planet_fitness')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleDone = async () => {
    if (saving) return
    setSaving(true)
    setError(null)

    const profileOk = await saveUserProfile({
      goals: prior.goals ?? [],
      gym_type: picked,
      home_equipment: prior.equipment ?? [],
      location_preference: picked === 'home_only' ? 'home' : 'gym',
    })

    if (!profileOk) {
      setError('Could not save profile — please try again')
      setSaving(false)
      return
    }

    const schedule = prior.schedule ?? {}
    const defaultLocation = picked === 'home_only' ? 'home' : 'gym'
    const rows = Object.entries(schedule).map(([day_of_week, routine_type]) => ({
      day_of_week,
      routine_type,
      location: defaultLocation,
    }))

    for (const row of rows) {
      // Best-effort per day; we already know profile saved.
      await saveSchedule(row)
    }

    navigate('/today')
  }

  return (
    <OnboardingStep
      step={4}
      total={4}
      title="Your gym"
      subtitle="Where do you train?"
      cta={saving ? 'Saving...' : `Let's go! →`}
      onCta={handleDone}
    >
      <div className="flex flex-col gap-2.5">
        {OPTIONS.map((o) => {
          const on = picked === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setPicked(o.id)}
              className="rounded-card px-4 py-3 flex items-start gap-3 text-left"
              style={{
                background: on ? 'var(--cyan-dim)' : 'var(--surface)',
                minHeight: 72,
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold" style={{ color: on ? 'var(--cyan)' : 'var(--text)' }}>
                  {o.name}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-sub)' }}>{o.sub}</p>
              </div>
              <span className="text-[17px] font-bold self-center" style={{ color: on ? 'var(--cyan)' : 'var(--muted)' }}>
                {on ? '✓' : '○'}
              </span>
            </button>
          )
        })}
        {error && (
          <p className="text-[12px] text-center mt-2" style={{ color: 'var(--red)' }}>
            {error}
          </p>
        )}
      </div>
    </OnboardingStep>
  )
}
