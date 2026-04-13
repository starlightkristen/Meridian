import { Link } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const ARTS = [
  {
    to: '/discover/martial-arts/muay-thai',
    emoji: '🥊',
    name: 'Muay Thai',
    sub: 'The Art of Eight Limbs',
    stats: '60 techniques · 30 combinations',
    pills: ['Strikes', 'Kicks', 'Elbows', 'Knees', 'Clinch'],
    accent: 'var(--coral)',
    pillBg: 'var(--coral-dim)',
  },
  {
    to: '/discover/martial-arts/krav-maga',
    emoji: '🛡️',
    name: 'Krav Maga',
    sub: 'Practical self-defense',
    stats: '40 techniques · 25 scenarios',
    pills: ['Defense', 'Scenarios', 'Weapons'],
    accent: 'var(--amber)',
    pillBg: 'var(--amber-dim)',
  },
  {
    to: '/discover/martial-arts/bjj',
    emoji: '🤼',
    name: 'BJJ',
    sub: 'Brazilian Jiu-Jitsu',
    stats: '50 techniques · 12 positions',
    pills: ['Positions', 'Submissions', 'Escapes'],
    accent: 'var(--purple)',
    pillBg: 'var(--purple-dim)',
  },
]

export default function MartialArtsHome() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Discover" title="Martial Arts" subtitle="Technique, conditioning & forms" />
      <div className="px-5 flex flex-col gap-3">
        {ARTS.map((a) => (
          <Link
            key={a.name}
            to={a.to}
            className="relative rounded-card overflow-hidden p-4"
            style={{ background: 'var(--surface)', minHeight: 140 }}
          >
            <span className="absolute top-0 left-0 right-0 h-1 rounded-b-[2px]" style={{ background: a.accent }} />
            <div className="flex gap-3 items-start">
              <span className="text-[36px] leading-none">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-bold" style={{ color: 'var(--text)' }}>{a.name}</p>
                <p className="text-[12px] mt-1" style={{ color: 'var(--text-sub)' }}>{a.sub}</p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: a.accent }}>{a.stats}</p>
              </div>
              <span className="text-[22px] font-bold" style={{ color: a.accent }}>›</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.pills.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-pill text-[11px]"
                  style={{ background: a.pillBg, color: a.accent }}
                >
                  {p}
                </span>
              ))}
            </div>
          </Link>
        ))}

        <button
          type="button"
          className="rounded-card flex items-center gap-3 px-4 py-4 text-left"
          style={{ background: 'var(--surface-hi)' }}
        >
          <span className="text-[22px]">📖</span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>
              Fundamentals &amp; How to Practice
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-sub)' }}>
              Solo drilling, partner work, safety
            </p>
          </div>
          <span className="text-[18px]" style={{ color: 'var(--muted)' }}>›</span>
        </button>
      </div>
    </ScreenWrapper>
  )
}
