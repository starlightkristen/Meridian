import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const MUSCLES = [
  { name: 'Chest', count: 12, accent: 'var(--cyan)' },
  { name: 'Back', count: 14, accent: 'var(--cyan)' },
  { name: 'Shoulders', count: 10, accent: 'var(--coral)' },
  { name: 'Arms — Biceps', count: 8, accent: 'var(--coral)' },
  { name: 'Arms — Triceps', count: 9, accent: 'var(--coral)' },
  { name: 'Core & Abs', count: 11, accent: 'var(--amber)' },
  { name: 'Legs — Quads', count: 10, accent: 'var(--amber)' },
  { name: 'Legs — Hamstrings', count: 8, accent: 'var(--amber)' },
  { name: 'Glutes', count: 9, accent: 'var(--purple)' },
  { name: 'Calves', count: 5, accent: 'var(--purple)' },
]

export default function ByMuscleGroup() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Discover" title="Muscle Group" subtitle="Tap a muscle to see all exercises" />
      <div className="px-5">
        <div
          className="rounded-card h-[160px] flex items-center justify-center"
          style={{ background: 'var(--surface-hi)' }}
        >
          <p className="text-[12px]" style={{ color: 'var(--text-sub)' }}>
            Anterior / Posterior muscle map
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {MUSCLES.map((m) => (
            <button
              key={m.name}
              type="button"
              className="relative w-full h-[52px] rounded-card pl-4 pr-4 flex items-center justify-between"
              style={{ background: 'var(--surface)' }}
            >
              <span
                className="absolute left-0 top-[10px] w-1 h-8 rounded-r-[2px]"
                style={{ background: m.accent }}
                aria-hidden
              />
              <span className="text-[14px]" style={{ color: 'var(--text)' }}>{m.name}</span>
              <span className="flex items-center gap-3">
                <span className="text-[12px]" style={{ color: 'var(--text-sub)' }}>{m.count} exercises</span>
                <span className="text-[18px]" style={{ color: 'var(--muted)' }}>›</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  )
}
