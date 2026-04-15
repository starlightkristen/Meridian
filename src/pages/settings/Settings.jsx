import { useNavigate } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import { signOut } from '../../lib/auth'

const SCHEDULE = [
  { day: 'Monday', routine: 'Pull Day' },
  { day: 'Tuesday', routine: 'Push Day' },
  { day: 'Thursday', routine: 'Legs' },
  { day: 'Saturday', routine: 'Full Body' },
]

const MACHINE_MAP = [
  'QR-A4F2 → Chest Press',
  'QR-B891 → Leg Press',
  'QR-C32D → Seated Row',
]

const EQUIPMENT = [
  { name: 'Barbell + Plates', on: true },
  { name: 'Dumbbells', on: true },
  { name: 'Bodyweight', on: true },
  { name: 'Pilates Bar', on: false },
]

const GOALS = [
  'Build Muscle + Lose Fat',
  'Current: 142 lbs',
]

function Section({ title, children }) {
  return (
    <div className="mt-5">
      <p className="text-[13px]" style={{ color: 'var(--text-sub)' }}>{title}</p>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  )
}

function Row({ label }) {
  return (
    <button
      type="button"
      className="rounded-card h-11 px-4 flex items-center justify-between text-left"
      style={{ background: 'var(--surface)' }}
    >
      <span className="text-[13px]" style={{ color: 'var(--text)' }}>{label}</span>
      <span className="text-[18px]" style={{ color: 'var(--muted)' }}>›</span>
    </button>
  )
}

export default function Settings() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/onboarding')
  }

  return (
    <ScreenWrapper>
      <PageHeader title="Settings" />
      <div className="px-5">
        <Section title="Workout Schedule">
          {SCHEDULE.map((s) => <Row key={s.day} label={`${s.day} → ${s.routine}`} />)}
        </Section>

        <Section title="Machine Map">
          {MACHINE_MAP.map((m) => <Row key={m} label={m} />)}
        </Section>

        <Section title="Home Equipment">
          {EQUIPMENT.map((e) => (
            <Row key={e.name} label={`${e.name}  ${e.on ? '✓' : '—'}`} />
          ))}
        </Section>

        <Section title="Goals">
          {GOALS.map((g) => <Row key={g} label={g} />)}
        </Section>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 w-full h-12 rounded-card text-[14px] font-medium"
          style={{ background: 'var(--red-dim)', color: 'var(--red)' }}
        >
          Sign Out
        </button>
      </div>
    </ScreenWrapper>
  )
}
