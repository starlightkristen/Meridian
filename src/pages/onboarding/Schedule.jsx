import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OnboardingStep from './OnboardingStep'

const DAY_CODES = [
  { label: 'Mon', code: 'monday' },
  { label: 'Tue', code: 'tuesday' },
  { label: 'Wed', code: 'wednesday' },
  { label: 'Thu', code: 'thursday' },
  { label: 'Fri', code: 'friday' },
  { label: 'Sat', code: 'saturday' },
  { label: 'Sun', code: 'sunday' },
]

const ROUTINES = [
  { id: 'rest', name: 'Rest', color: 'var(--muted)', bg: 'rgba(114,140,179,0.15)' },
  { id: 'push', name: 'Push Day', color: 'var(--cyan)', bg: 'var(--cyan-dim)' },
  { id: 'pull', name: 'Pull Day', color: 'var(--coral)', bg: 'var(--coral-dim)' },
  { id: 'legs', name: 'Legs', color: 'var(--amber)', bg: 'var(--amber-dim)' },
  { id: 'full_body', name: 'Full Body', color: 'var(--coral)', bg: 'var(--coral-dim)' },
  { id: 'upper', name: 'Upper', color: 'var(--cyan)', bg: 'var(--cyan-dim)' },
  { id: 'lower', name: 'Lower', color: 'var(--amber)', bg: 'var(--amber-dim)' },
]

const DEFAULT_SCHEDULE = {
  monday: 'pull',
  tuesday: 'push',
  wednesday: 'rest',
  thursday: 'legs',
  friday: 'push',
  saturday: 'full_body',
  sunday: 'rest',
}

export default function Schedule() {
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state ?? {}
  const [schedule, setSchedule] = useState(prior.schedule ?? DEFAULT_SCHEDULE)

  const cycle = (day) => {
    setSchedule((prev) => {
      const i = ROUTINES.findIndex((r) => r.id === prev[day])
      const next = ROUTINES[(i + 1) % ROUTINES.length].id
      return { ...prev, [day]: next }
    })
  }

  const handleNext = () => {
    navigate('/onboarding/equipment', {
      state: { ...prior, schedule },
    })
  }

  return (
    <OnboardingStep
      step={2}
      total={4}
      title={<span>Set your<br />schedule</span>}
      subtitle="Tap a day to cycle through splits"
      cta="Next →"
      onCta={handleNext}
    >
      <div className="flex flex-col gap-2">
        {DAY_CODES.map(({ label, code }) => {
          const routineId = schedule[code] ?? 'rest'
          const routine = ROUTINES.find((r) => r.id === routineId) ?? ROUTINES[0]
          return (
            <button
              key={code}
              type="button"
              onClick={() => cycle(code)}
              className="rounded-card px-4 flex items-center justify-between text-left"
              style={{ background: 'var(--surface)', minHeight: 52 }}
            >
              <span className="text-[14px]" style={{ color: 'var(--text)' }}>{label}</span>
              <span
                className="px-2.5 py-1 rounded-pill text-[11px]"
                style={{ background: routine.bg, color: routine.color }}
              >
                {routine.name}
              </span>
            </button>
          )
        })}
      </div>
    </OnboardingStep>
  )
}
