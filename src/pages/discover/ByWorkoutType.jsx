import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const TYPES = [
  { emoji: '🏋️', name: 'Strength Training', sub: 'Compound lifts, machines, progressive overload', loc: 'Gym + Home', accent: 'var(--cyan)' },
  { emoji: '⚡', name: 'HIIT Circuit', sub: 'High intensity intervals, minimal rest', loc: 'Bodyweight + Gym', accent: 'var(--coral)' },
  { emoji: '🤸', name: 'Bodyweight', sub: 'Push, pull, squat — no equipment needed', loc: 'Anywhere', accent: 'var(--amber)' },
  { emoji: '🧘', name: 'Pilates', sub: 'Core, control, flexibility with pilates bar', loc: 'Home', accent: 'var(--green)' },
  { emoji: '🥊', name: 'Martial Arts Conditioning', sub: 'Footwork, shadow boxing, pad combos', loc: 'Anywhere', accent: 'var(--purple)' },
  { emoji: '🌊', name: 'Mobility Flow', sub: 'Dynamic stretching, joint circles, flow', loc: 'Anywhere', accent: 'var(--green)' },
  { emoji: '🏃', name: 'Cardio', sub: 'Treadmill, bike, stair climber protocols', loc: 'Gym', accent: 'var(--coral)' },
  { emoji: '🦵', name: 'Plyometrics', sub: 'Explosive jumps, power development', loc: 'Gym + Home', accent: 'var(--amber)' },
]

export default function ByWorkoutType() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Discover" title="Workout Type" />
      <div className="px-5 flex flex-col gap-2.5">
        {TYPES.map((t) => (
          <button
            key={t.name}
            type="button"
            className="relative w-full rounded-card px-4 py-3 text-left"
            style={{ background: 'var(--surface)', minHeight: 76 }}
          >
            <span
              className="absolute left-0 top-[10px] w-1 h-[56px] rounded-r-[2px]"
              style={{ background: t.accent }}
              aria-hidden
            />
            <div className="flex items-start gap-3">
              <span className="text-[22px] leading-none">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px]" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-sub)' }}>{t.sub}</p>
                <span
                  className="inline-flex mt-1.5 px-2.5 py-1 rounded-pill text-[11px]"
                  style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}
                >
                  {t.loc}
                </span>
              </div>
              <span className="text-[18px] self-center" style={{ color: 'var(--muted)' }}>›</span>
            </div>
          </button>
        ))}
      </div>
    </ScreenWrapper>
  )
}
