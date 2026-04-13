import { useMemo, useState } from 'react'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const PLATES = [45, 35, 25, 10, 5, 2.5]
const QUICK = [95, 115, 135, 155, 185, 205]

// Greedy plate decomposition for one side of the bar
function computePlates(target, bar) {
  const sideWeight = Math.max(0, (target - bar) / 2)
  let remaining = sideWeight
  const chosen = []
  for (const p of PLATES) {
    while (remaining >= p - 0.001) {
      chosen.push(p)
      remaining = +(remaining - p).toFixed(2)
    }
  }
  return { chosen, remainder: remaining, sideWeight }
}

export default function PlateCalculator() {
  const [target, setTarget] = useState(135)
  const [bar, setBar] = useState(45)

  const { chosen, remainder, sideWeight } = useMemo(
    () => computePlates(target, bar),
    [target, bar],
  )

  const formula = `${bar} + ${sideWeight * 2} = ${bar + sideWeight * 2} lbs${remainder < 0.01 ? '  ✓' : `  (− ${remainder.toFixed(2)})`}`

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Bench Press" title="Plate Calculator" />
      <div className="px-5">
        <div className="rounded-card p-4" style={{ background: 'var(--surface)' }}>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-sub)' }}>
            Target Weight
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setTarget((t) => Math.max(bar, t - 5))}
              aria-label="Decrease"
              className="w-[60px] h-[60px] rounded-card text-[24px] font-bold"
              style={{ background: 'var(--surface-hi)', color: 'var(--text)' }}
            >
              −
            </button>
            <div className="text-center">
              <p className="text-[40px] font-bold leading-none" style={{ color: 'var(--cyan)' }}>
                {target}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: 'var(--text-sub)' }}>lbs</p>
            </div>
            <button
              type="button"
              onClick={() => setTarget((t) => t + 5)}
              aria-label="Increase"
              className="w-[60px] h-[60px] rounded-card text-[24px] font-bold"
              style={{ background: 'var(--surface-hi)', color: 'var(--cyan)' }}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBar(bar === 45 ? 35 : 45)}
          className="mt-3 w-full h-11 rounded-card text-[13px] font-medium text-left px-4"
          style={{ background: 'var(--surface-hi)', color: 'var(--text)' }}
        >
          Bar weight: {bar} lbs&nbsp;&nbsp;▾
        </button>

        <div
          className="mt-4 rounded-card text-center py-5"
          style={{ background: 'var(--surface)' }}
        >
          <p className="text-[14px] font-bold" style={{ color: 'var(--cyan)' }}>
            {chosen.length > 0 ? `[${chosen.join('][')}] ══ BAR ══ [${[...chosen].reverse().join('][')}]` : '══ BAR ══'}
          </p>
          <p className="mt-2 text-[12px]" style={{ color: 'var(--text-sub)' }}>
            Each side: {chosen.length} × plates
          </p>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--cyan)' }}>
            {formula}
          </p>
        </div>

        <p className="mt-5 text-[13px]" style={{ color: 'var(--text-sub)' }}>
          Quick targets
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setTarget(q)}
              className="px-2.5 py-1 rounded-pill text-[11px]"
              style={{
                background: target === q ? 'var(--cyan)' : 'var(--surface-hi)',
                color: target === q ? 'var(--bg)' : 'var(--text)',
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full h-[52px] rounded-card font-bold text-[15px]"
          style={{ background: 'var(--cyan)', color: 'var(--bg)' }}
        >
          Use {target} lbs for this set
        </button>
      </div>
    </ScreenWrapper>
  )
}
