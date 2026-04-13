import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const EQUIPMENT = [
  { emoji: '🏋️', name: 'Barbell', sub: 'Bench, squat, deadlift, overhead press', loc: 'Gym', accent: 'var(--cyan)' },
  { emoji: '💪', name: 'Dumbbells', sub: 'Press, row, curl, lunge — works anywhere', loc: 'Gym + Home', accent: 'var(--coral)' },
  { emoji: '🎛️', name: 'Machines', sub: 'Cable, smith machine, plate-loaded', loc: 'Gym', accent: 'var(--amber)' },
  { emoji: '🤸', name: 'Bodyweight', sub: 'Push-ups, pull-ups, squats, planks', loc: 'Anywhere', accent: 'var(--green)' },
  { emoji: '🪢', name: 'Resistance Bands', sub: 'Travel-friendly, joint-safe resistance', loc: 'Home', accent: 'var(--purple)' },
  { emoji: '🧘', name: 'Pilates Bar', sub: 'Core and control with light resistance', loc: 'Home', accent: 'var(--green)' },
  { emoji: '🔔', name: 'Kettlebell', sub: 'Swings, goblet squats, TGU, snatches', loc: 'Gym + Home', accent: 'var(--amber)' },
  { emoji: '📦', name: 'Box / Bench', sub: 'Step-ups, box jumps, incline press', loc: 'Gym + Home', accent: 'var(--coral)' },
]

export default function ByEquipment() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Discover" title="Equipment" subtitle="Filter exercises by what you have" />
      <div className="px-5 flex flex-col gap-2.5">
        {EQUIPMENT.map((t) => (
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
