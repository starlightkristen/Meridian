import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OnboardingStep from './OnboardingStep'

const OPTIONS = [
  { id: 'build_muscle', emoji: '💪', name: 'Build Muscle', sub: 'Strength & size' },
  { id: 'lose_fat', emoji: '🔥', name: 'Lose Fat', sub: 'Burn calories, lean out' },
  { id: 'cardio', emoji: '❤️', name: 'Cardio Fitness', sub: 'Endurance & heart health' },
  { id: 'flexibility', emoji: '🧘', name: 'Flexibility', sub: 'Move better, feel better' },
]

export default function Goals() {
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state ?? {}
  const [picked, setPicked] = useState(
    new Set(prior.goals ?? ['build_muscle', 'lose_fat']),
  )

  const toggle = (id) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleNext = () => {
    navigate('/onboarding/schedule', {
      state: { ...prior, goals: [...picked] },
    })
  }

  return (
    <OnboardingStep
      step={1}
      total={4}
      title={<span>What are your<br />goals?</span>}
      subtitle="Pick all that apply"
      cta="Next →"
      onCta={handleNext}
    >
      <div className="flex flex-col gap-2.5">
        {OPTIONS.map((o) => {
          const on = picked.has(o.id)
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              className="rounded-card px-4 py-3 flex items-start gap-3 text-left"
              style={{
                background: on ? 'var(--cyan-dim)' : 'var(--surface)',
                minHeight: 72,
              }}
            >
              <span className="text-[22px]">{o.emoji}</span>
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
      </div>
    </OnboardingStep>
  )
}
