import { useParams } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const DATA = {
  'rear-roundhouse': {
    title: ['Rear Roundhouse', 'Kick (Te Tat)'],
    category: '🥊 Kicks',
    level: 'Beginner',
    steps: [
      'Start in Muay Thai stance, weight centered.',
      'Pivot on lead foot, turn hips fully.',
      'Drive rear knee up, then extend leg.',
      'Strike with the shin — not the foot.',
      'Chamber back, return to stance.',
    ],
    tip: 'Tip: Hip rotation = power. Arm swings = balance.',
    combos: ['1-2-Low Kick', '1-2-Body-Low', 'Teep-Cross-Low'],
  },
}

const DEFAULT = DATA['rear-roundhouse']

export default function TechniqueDetail() {
  const { id } = useParams()
  const t = DATA[id] || DEFAULT

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Muay Thai" />
      <div className="px-5">
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}>
            {t.category}
          </span>
          <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}>
            {t.level}
          </span>
        </div>
        <h1 className="mt-3 text-[24px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
          {t.title.map((line, i) => <div key={i}>{line}</div>)}
        </h1>

        <div
          className="mt-4 rounded-card h-[180px] flex items-center justify-center"
          style={{ background: 'var(--surface-hi)' }}
        >
          <p className="text-[12px]" style={{ color: 'var(--text-sub)' }}>
            Animated GIF — technique demo
          </p>
        </div>

        <div className="mt-4 rounded-card p-4" style={{ background: 'var(--surface)' }}>
          <p className="text-[12px]" style={{ color: 'var(--coral)' }}>Step by step</p>
          <ol className="mt-2 flex flex-col gap-2.5">
            {t.steps.map((s, i) => (
              <li key={i} className="text-[12px]" style={{ color: 'var(--text-sub)' }}>
                {i + 1}. {s}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12px]" style={{ color: 'var(--coral)' }}>{t.tip}</p>
        </div>

        <p className="mt-5 text-[12px]" style={{ color: 'var(--text-sub)' }}>
          Combos featuring this technique
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {t.combos.map((c) => (
            <span
              key={c}
              className="px-2.5 py-1 rounded-pill text-[11px]"
              style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  )
}
