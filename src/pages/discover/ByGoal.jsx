import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const GOALS = [
  { emoji: '🔥', name: 'Burn Fat', sub: 'High rep circuits, HIIT, cardio combos', tag: '30–45 min · High intensity', accent: 'var(--coral)', tagBg: 'var(--coral-dim)' },
  { emoji: '💪', name: 'Build Muscle', sub: 'Progressive overload, compound lifts', tag: '45–60 min · Moderate intensity', accent: 'var(--cyan)', tagBg: 'var(--cyan-dim)' },
  { emoji: '🏋️', name: 'Get Stronger', sub: 'Heavy compound, low rep, long rest', tag: '45–60 min · High load', accent: 'var(--amber)', tagBg: 'var(--amber-dim)' },
  { emoji: '🧘', name: 'Recover', sub: 'Stretching, mobility, light movement', tag: '20–30 min · Low intensity', accent: 'var(--green)', tagBg: 'var(--green-dim)' },
  { emoji: '⚡', name: 'Athlete Conditioning', sub: 'Muay Thai, BJJ drills, explosive work', tag: '30–45 min · Sport-specific', accent: 'var(--purple)', tagBg: 'var(--purple-dim)' },
  { emoji: '🌅', name: 'Morning Activation', sub: 'Wake up the body, joint mobility', tag: '10–15 min · Low intensity', accent: 'var(--amber)', tagBg: 'var(--amber-dim)' },
]

export default function ByGoal() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Discover" title={<span>Choose your<br />goal today</span>} />
      <div className="px-5 flex flex-col gap-3">
        {GOALS.map((g) => (
          <button
            key={g.name}
            type="button"
            className="relative w-full rounded-card px-4 py-3 text-left"
            style={{ background: 'var(--surface)', minHeight: 96 }}
          >
            <span
              className="absolute left-0 top-[10px] w-1 h-[76px] rounded-r-[2px]"
              style={{ background: g.accent }}
              aria-hidden
            />
            <div className="flex items-start gap-3">
              <span className="text-[26px] leading-none">{g.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px]" style={{ color: 'var(--text)' }}>{g.name}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-sub)' }}>{g.sub}</p>
                <span
                  className="inline-flex mt-2 px-2.5 py-1 rounded-pill text-[11px]"
                  style={{ background: g.tagBg, color: g.accent }}
                >
                  {g.tag}
                </span>
              </div>
              <span className="text-[20px] self-center" style={{ color: 'var(--muted)' }}>›</span>
            </div>
          </button>
        ))}
      </div>
    </ScreenWrapper>
  )
}
