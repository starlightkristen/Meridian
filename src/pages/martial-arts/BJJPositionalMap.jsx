import { useState } from 'react'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const POSITIONS = [
  { id: 'standing', label: 'Standing', color: 'var(--muted)', bg: 'rgba(140,166,204,0.2)' },
  { id: 'clinch', label: 'Clinch / Takedown', color: 'var(--muted)', bg: 'rgba(140,166,204,0.2)' },
  { id: 'closed-guard', label: 'Guard (Closed)', color: 'var(--cyan)', bg: 'var(--cyan-dim)', primary: true },
  { id: 'half-guard', label: 'Half Guard', color: 'var(--purple)', bg: 'var(--purple-dim)' },
  { id: 'open-guard', label: 'Open Guard', color: 'var(--purple)', bg: 'var(--purple-dim)' },
  { id: 'side-control', label: 'Side Control', color: 'var(--amber)', bg: 'var(--amber-dim)' },
  { id: 'mount', label: 'Mount', color: 'var(--coral)', bg: 'var(--coral-dim)' },
  { id: 'back-mount', label: 'Back Mount', color: 'var(--red)', bg: 'var(--red-dim)' },
]

const DETAILS = {
  'closed-guard': {
    label: 'Closed Guard — Selected',
    attacks: ['Armbar', 'Triangle', 'Omoplata'],
    sweeps: ['Hip Bump', 'Flower Sweep', 'Scissor'],
    escapes: ['Stand Up', 'Open Guard'],
  },
}

export default function BJJPositionalMap() {
  const [selected, setSelected] = useState('closed-guard')
  const detail = DETAILS[selected] ?? DETAILS['closed-guard']

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="BJJ" title="Position Map" subtitle="Tap a position to see attacks, sweeps & escapes" />
      <div className="px-5">
        <div className="flex flex-col items-center gap-0">
          {POSITIONS.map((p, i) => (
            <div key={p.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setSelected(p.id)}
                className="px-4 py-1.5 rounded-pill text-[10px] font-semibold"
                style={{
                  background: selected === p.id ? 'var(--cyan)' : p.bg,
                  color: selected === p.id ? 'var(--bg)' : p.color,
                }}
              >
                {p.label}
              </button>
              {i < POSITIONS.length - 1 && (
                <span className="block w-0.5 h-6" style={{ background: 'var(--surface-hi)' }} />
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-5 rounded-card p-4"
          style={{ background: 'var(--cyan-dim)', minHeight: 200 }}
        >
          <p className="text-[13px]" style={{ color: 'var(--cyan)' }}>{detail.label}</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px]" style={{ color: 'var(--red)' }}>Attacks</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {detail.attacks.map((a) => (
                  <li key={a} className="text-[11px]" style={{ color: 'var(--text)' }}>• {a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px]" style={{ color: 'var(--amber)' }}>Sweeps</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {detail.sweeps.map((a) => (
                  <li key={a} className="text-[11px]" style={{ color: 'var(--text)' }}>• {a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px]" style={{ color: 'var(--cyan)' }}>Escapes</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                {detail.escapes.map((a) => (
                  <li key={a} className="text-[11px]" style={{ color: 'var(--text)' }}>• {a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}
