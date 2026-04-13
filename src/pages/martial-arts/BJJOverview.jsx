import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const TECHNIQUES = [
  { id: 'triangle', name: 'Triangle Choke', from: 'Closed Guard', type: 'Submission', typeColor: 'var(--red)', typeBg: 'var(--red-dim)', accent: 'var(--red)', level: 'Intermediate' },
  { id: 'hip-bump', name: 'Hip Bump Sweep', from: 'Closed Guard', type: 'Sweep', typeColor: 'var(--amber)', typeBg: 'var(--amber-dim)', accent: 'var(--amber)', level: 'Beginner' },
  { id: 'americana', name: 'Americana', from: 'Mount', type: 'Submission', typeColor: 'var(--red)', typeBg: 'var(--red-dim)', accent: 'var(--red)', level: 'Beginner' },
  { id: 'rnc', name: 'Rear Naked Choke', from: 'Back Mount', type: 'Submission', typeColor: 'var(--red)', typeBg: 'var(--red-dim)', accent: 'var(--red)', level: 'Beginner' },
  { id: 'kimura', name: 'Kimura', from: 'Side Control', type: 'Submission', typeColor: 'var(--red)', typeBg: 'var(--red-dim)', accent: 'var(--red)', level: 'Beginner' },
  { id: 'old-school', name: 'Old School Sweep', from: 'Half Guard', type: 'Sweep', typeColor: 'var(--amber)', typeBg: 'var(--amber-dim)', accent: 'var(--amber)', level: 'Intermediate' },
  { id: 'upa', name: 'Upa (Bridge & Roll)', from: 'Guard', type: 'Escape', typeColor: 'var(--cyan)', typeBg: 'var(--cyan-dim)', accent: 'var(--cyan)', level: 'Beginner' },
]

export default function BJJOverview() {
  const [view, setView] = useState('techniques')

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Martial Arts" />
      <div className="px-5 text-center -mt-1">
        <p className="text-[36px] leading-none" style={{ color: 'var(--purple)' }}>🤼</p>
        <h1 className="mt-3 text-[24px] font-bold" style={{ color: 'var(--text)' }}>Brazilian Jiu-Jitsu</h1>
      </div>

      <div className="px-5 mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('techniques')}
            className="flex-1 h-10 rounded-card text-[13px] font-medium"
            style={{
              background: view === 'techniques' ? 'var(--purple)' : 'var(--surface-hi)',
              color: view === 'techniques' ? 'var(--bg)' : 'var(--text-sub)',
            }}
          >
            Techniques
          </button>
          <Link
            to="/discover/martial-arts/bjj/map"
            className="flex-1 h-10 rounded-card text-[13px] font-medium flex items-center justify-center"
            style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}
          >
            Position Map
          </Link>
        </div>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-2.5">
        {TECHNIQUES.map((t) => (
          <Link
            key={t.id}
            to={`/discover/martial-arts/bjj/technique/${t.id}`}
            className="relative rounded-card px-4 py-3"
            style={{ background: 'var(--surface)', minHeight: 72 }}
          >
            <span className="absolute left-0 top-[10px] w-1 h-[52px] rounded-r-[2px]" style={{ background: t.accent }} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--text-sub)' }}>From: {t.from}</p>
                <div className="mt-1.5 flex gap-2">
                  <span className="px-2.5 py-1 rounded-pill text-[11px]" style={{ background: t.typeBg, color: t.typeColor }}>{t.type}</span>
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
