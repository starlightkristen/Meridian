import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const CATEGORIES = ['All', 'Strikes', 'Grabs', 'Chokes', 'Weapons', 'Ground', 'Scenarios']

const TECHNIQUES = [
  { id: 'front-choke', name: 'Front Choke Defense', sub: 'Attacker grabs throat from front — pluck, strike, escape', cat: 'Chokes', threat: 'high' },
  { id: 'wrist-grab', name: 'Wrist Grab Release', sub: 'Single or double wrist — rotation escape + counterattack', cat: 'Grabs', threat: 'medium' },
  { id: 'bear-hug', name: 'Bear Hug Arms Free', sub: 'Arms free — drop weight, elbow, stomp, turn and strike', cat: 'Grabs', threat: 'medium' },
  { id: 'handgun-front', name: 'Handgun Front Threat', sub: 'Gun at chest — redirect, control, disarm sequence', cat: 'Weapons', threat: 'high' },
  { id: 'hair-grab', name: 'Hair Grab from Behind', sub: 'Pin hand to head, turn into attacker, strike', cat: 'Grabs', threat: 'medium' },
]

const THREAT_COLORS = {
  high: { label: '⚡ High', color: 'var(--red)' },
  medium: { label: '◉ Medium', color: 'var(--amber)' },
}

export default function KravMagaOverview() {
  const [cat, setCat] = useState('All')
  const items = cat === 'All' ? TECHNIQUES : TECHNIQUES.filter((t) => t.cat === cat)

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Martial Arts" />
      <div className="px-5 text-center -mt-1">
        <p className="text-[36px] leading-none" style={{ color: 'var(--amber)' }}>🛡️</p>
        <h1 className="mt-3 text-[26px] font-bold" style={{ color: 'var(--text)' }}>Krav Maga</h1>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--text-sub)' }}>
          Practical self-defense — real world scenarios
        </p>
      </div>

      <div className="px-5 mt-4">
        <div
          className="rounded-card px-4 py-3 text-[12px] font-medium"
          style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}
        >
          ⚠️&nbsp;&nbsp;Techniques are designed to cause injury.<br />
          Practice requires a qualified instructor.
        </div>
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
                background: active ? 'var(--amber)' : 'var(--surface)',
                color: active ? 'var(--bg)' : 'var(--text-sub)',
              }}
            >
              {c}
            </button>
          )
        })}
      </div>

      <div className="px-5 mt-4 flex flex-col gap-2.5">
        {items.map((t) => {
          const threat = THREAT_COLORS[t.threat]
          return (
            <Link
              key={t.id}
              to={`/discover/martial-arts/krav-maga/scenario/${t.id}`}
              className="relative rounded-card px-4 py-3"
              style={{ background: 'var(--surface)', minHeight: 84 }}
            >
              <span className="absolute left-0 top-[10px] w-1 h-[64px] rounded-r-[2px]" style={{ background: 'var(--amber)' }} />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                  <p className="mt-1 text-[11px]" style={{ color: 'var(--text-sub)' }}>{t.sub}</p>
                  <div className="mt-1.5 flex gap-2 items-center">
                    <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>{t.cat}</span>
                    <span className="text-[11px]" style={{ color: threat.color }}>{threat.label}</span>
                  </div>
                </div>
                <span className="text-[18px] self-center" style={{ color: 'var(--muted)' }}>›</span>
              </div>
            </Link>
          )
        })}
      </div>
    </ScreenWrapper>
  )
}
