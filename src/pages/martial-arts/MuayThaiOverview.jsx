import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const CATEGORIES = ['All', 'Stance', 'Punches', 'Kicks', 'Elbows', 'Knees', 'Clinch', 'Defense', 'Combos']

const TECHNIQUES = [
  { id: 'teep', name: 'Teep (Push Kick)', sub: 'Long range control, distance management', cat: 'Kicks', level: 'Beginner' },
  { id: 'rear-roundhouse', name: 'Rear Roundhouse', sub: 'Hip rotation power kick — body or head', cat: 'Kicks', level: 'Beginner' },
  { id: 'lead-elbow', name: 'Lead Elbow', sub: 'Horizontal elbow from lead side, close range', cat: 'Elbows', level: 'Intermediate' },
  { id: 'clinch-knee', name: 'Clinch Knee', sub: 'Plum position, alternating knees to body', cat: 'Knees', level: 'Intermediate' },
  { id: 'combo-1-2-low', name: 'Combination 1-2-Low', sub: 'Jab · Cross · Low kick — bread and butter', cat: 'Combos', level: 'Beginner', combo: true },
]

export default function MuayThaiOverview() {
  const [cat, setCat] = useState('All')

  const items = cat === 'All' ? TECHNIQUES : TECHNIQUES.filter((t) => t.cat === cat)

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Martial Arts" />
      <div className="px-5 text-center -mt-1">
        <p className="text-[36px] leading-none" style={{ color: 'var(--coral)' }}>🥊</p>
        <h1 className="mt-3 text-[26px] font-bold" style={{ color: 'var(--text)' }}>Muay Thai</h1>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--text-sub)' }}>The Art of Eight Limbs</p>
      </div>

      <div className="px-5 mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = cat === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className="px-2.5 py-1 rounded-pill text-[11px]"
              style={{
                background: active ? 'var(--coral)' : 'var(--surface)',
                color: active ? 'var(--bg)' : 'var(--text-sub)',
              }}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="px-5 mt-4 flex flex-col gap-2.5">
        {items.map((t) => (
          <Link
            key={t.id}
            to={
              t.combo
                ? `/discover/martial-arts/muay-thai/combo/${t.id}`
                : `/discover/martial-arts/muay-thai/technique/${t.id}`
            }
            className="relative rounded-card px-4 py-3"
            style={{ background: 'var(--surface)', minHeight: 80 }}
          >
            <span className="absolute left-0 top-[10px] w-1 h-[60px] rounded-r-[2px]" style={{ background: 'var(--coral)' }} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--text-sub)' }}>{t.sub}</p>
                <div className="mt-1.5 flex gap-2">
                  <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--coral-dim)', color: 'var(--coral)' }}>{t.cat}</span>
                  <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}>{t.level}</span>
                </div>
              </div>
              <span className="text-[18px] self-center" style={{ color: 'var(--muted)' }}>›</span>
            </div>
          </Link>
        ))}
      </div>
    </ScreenWrapper>
  )
}
