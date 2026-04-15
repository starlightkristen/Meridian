import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OnboardingStep from './OnboardingStep'

const OPTIONS = [
  { id: 'barbell', emoji: '🏋️', name: 'Barbell + Plates', sub: 'Heavy compound lifts' },
  { id: 'dumbbells', emoji: '🪀', name: 'Dumbbells / Light weights', sub: 'Isolation & higher rep' },
  { id: 'pilates_bar', emoji: '🧘', name: 'Pilates Bar', sub: 'Core, flexibility, low impact' },
  { id: 'bodyweight', emoji: '🤸', name: 'Just bodyweight', sub: 'Always available — always on' },
]

export default function HomeEquipment() {
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state ?? {}
  const [picked, setPicked] = useState(
    new Set(prior.equipment ?? ['barbell', 'dumbbells', 'bodyweight']),
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
    navigate('/onboarding/gym', {
      state: { ...prior, equipment: [...picked] },
    })
  }

  return (
    <OnboardingStep
      step={3}
      total={4}
      title={<span>What do you<br />have at home?</span>}
      subtitle="We only show exercises you can do"
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
