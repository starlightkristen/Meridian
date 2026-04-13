import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const SECTIONS = [
  {
    label: 'IMMEDIATE',
    color: 'var(--red)',
    bg: 'rgba(242,89,89,0.1)',
    items: ['Tuck chin — protect airway', 'Pluck hands outward simultaneously', 'Burst forward into attacker'],
  },
  {
    label: 'ATTACK',
    color: 'var(--amber)',
    bg: 'rgba(255,191,51,0.1)',
    items: ['Palm heel to nose', 'Knee to groin', 'Eye strike if still holding'],
  },
  {
    label: 'ESCAPE',
    color: 'var(--green)',
    bg: 'rgba(77,230,128,0.1)',
    items: ['Create distance', 'Scan for additional threats', 'Run if possible'],
  },
]

export default function ScenarioDetail() {
  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Krav Maga" />
      <div className="px-5">
        <div className="flex gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>
            🛡️ Chokes
          </span>
          <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>
            ⚡ High Threat
          </span>
        </div>
        <h1 className="mt-3 text-[24px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
          Front Choke<br />Defense
        </h1>

        <div
          className="mt-5 rounded-card px-4 py-3"
          style={{ background: 'var(--red-dim)' }}
        >
          <p className="text-[10px] font-bold" style={{ color: 'var(--red)' }}>SITUATION</p>
          <p className="mt-2 text-[13px] font-medium" style={{ color: 'var(--text)' }}>
            Attacker grabs your throat from the front<br />
            with one or both hands.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {SECTIONS.map((s) => (
            <div key={s.label} className="rounded-card px-4 py-3" style={{ background: s.bg }}>
              <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.label}</p>
              <ul className="mt-2 flex flex-col gap-2">
                {s.items.map((it) => (
                  <li key={it} className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>• {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-5 rounded-card px-4 py-3 text-[11px]"
          style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}
        >
          ⚠️&nbsp;&nbsp;Practice in slow motion with a partner first.<br />
          Never apply full force during training.
        </div>
      </div>
    </ScreenWrapper>
  )
}
