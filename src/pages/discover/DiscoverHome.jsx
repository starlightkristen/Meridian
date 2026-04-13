import { Link } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'

const CATS = [
  { to: '/discover/muscle', emoji: '💪', label: 'By Muscle Group', sub: 'Chest, back, legs...', accent: 'var(--cyan)' },
  { to: '/discover/goal', emoji: '🎯', label: 'By Goal', sub: 'Burn fat, build muscle...', accent: 'var(--coral)' },
  { to: '/discover/type', emoji: '⚡', label: 'By Workout Type', sub: 'Strength, HIIT, mobility...', accent: 'var(--amber)' },
  { to: '/discover/equipment', emoji: '🏠', label: 'By Equipment', sub: 'Gym, barbell, bodyweight...', accent: 'var(--purple)' },
  { to: '/discover/martial-arts', emoji: '🥊', label: 'Martial Arts', sub: 'Muay Thai, BJJ, Krav Maga', accent: 'var(--coral)' },
  { to: '/discover/stretch', emoji: '🧘', label: 'Stretch & Flex', sub: 'Mobility, recovery, yoga', accent: 'var(--green)' },
]

const QUICK = ['Full Body', 'Upper Body', 'Legs', 'Core', 'Stretch', 'Shadow Box']

export default function DiscoverHome() {
  return (
    <ScreenWrapper>
      <PageHeader title={<span>What do you<br />want to do?</span>} subtitle="Choose how to explore" />
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {CATS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="relative rounded-card overflow-hidden h-[110px] flex flex-col justify-between p-3.5"
              style={{ background: 'var(--surface)' }}
            >
              <span
                className="absolute top-0 left-0 right-0 h-1 rounded-b-[2px]"
                style={{ background: c.accent }}
                aria-hidden
              />
              <span className="text-[28px] leading-none mt-0.5">{c.emoji}</span>
              <div>
                <p className="font-bold text-[13px]" style={{ color: 'var(--text)' }}>{c.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-sub)' }}>{c.sub}</p>
              </div>
              <span className="absolute right-3 top-[44px] text-[18px]" style={{ color: c.accent }}>›</span>
            </Link>
          ))}
        </div>

        <p className="mt-5 text-[13px]" style={{ color: 'var(--text-sub)' }}>Quick Start</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              className="px-3 py-1.5 rounded-pill text-[11px]"
              style={{ background: 'var(--surface-hi)', color: 'var(--text)' }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </ScreenWrapper>
  )
}
