import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const MOVES = [
  { n: 1, name: 'Jab', side: 'Lead hand', target: 'Head', note: 'Snap, retract fast' },
  { n: 2, name: 'Cross', side: 'Rear hand', target: 'Head', note: 'Full hip rotation' },
  { n: 3, name: 'Low Kick', side: 'Rear leg', target: 'Lead thigh', note: 'Pivot, drive through' },
]

export default function CombinationCard() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Muay Thai" />
      <div className="px-5">
        <span
          className="inline-flex px-2.5 py-1 rounded-pill text-[11px]"
          style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}
        >
          🥊 Combination
        </span>
        <h1 className="mt-3 text-[22px] font-bold" style={{ color: 'var(--text)' }}>1-2-Low Kick</h1>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--text-sub)' }}>
          Core Muay Thai combination · Beginner
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {MOVES.map((m, idx) => {
            const highlight = idx === 0
            return (
              <div
                key={m.n}
                className="rounded-card px-4 py-3 flex gap-3"
                style={{ background: highlight ? 'var(--coral-dim)' : 'var(--surface)', minHeight: 96 }}
              >
                <span className="text-[22px] font-bold w-6" style={{ color: 'var(--coral)' }}>{m.n}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>{m.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-sub)' }}>{m.side}</p>
                  <p className="text-[12px] mt-1 font-medium" style={{ color: 'var(--coral)' }}>Target: {m.target}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-sub)' }}>{m.note}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="mt-4 rounded-card px-4 py-3"
          style={{ background: 'var(--surface-hi)', minHeight: 56 }}
        >
          <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>Rhythm</p>
          <p className="mt-1 text-[18px] font-bold" style={{ color: 'var(--coral)' }}>1 — 2 ——— LOW</p>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-sub)' }}>
            quick · quick · pause · power
          </p>
        </div>

        <button
          type="button"
          className="mt-6 w-full h-[52px] rounded-card font-bold text-[15px]"
          style={{ background: 'var(--coral)', color: 'var(--bg)' }}
        >
          🥊&nbsp;&nbsp;Shadow Box This Combo
        </button>
      </div>
    </ScreenWrapper>
  )
}
