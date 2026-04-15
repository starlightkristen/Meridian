import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import ExerciseCard from '../../components/ui/ExerciseCard'
import SkeletonCard from '../../components/ui/SkeletonCard'
import { getWorkoutForDay } from '../../lib/stubs'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TODAY_IDX = new Date().getDay() === 0 ? 5 : Math.max(0, new Date().getDay() - 1)

const ACCENTS = [
  { color: 'var(--cyan)', hex: '#33D9F2' },
  { color: 'var(--coral)', hex: '#FA7359' },
  { color: 'var(--amber)', hex: '#FFBF33' },
  { color: 'var(--purple)', hex: '#B366F2' },
  { color: 'var(--green)', hex: '#4DE680' },
]

export default function TodayGym() {
  const navigate = useNavigate()
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState(TODAY_IDX)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getWorkoutForDay(DAYS[activeDay], 'gym').then((w) => {
      if (!cancelled) {
        setWorkout(w)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [activeDay])

  const exercises = workout?.exercises ?? []

  return (
    <ScreenWrapper>
      <PageHeader
        title="Today"
        subtitle={workout?.name ? `${workout.name}  ·  ${DAYS[activeDay]}` : `${DAYS[activeDay]} · nothing scheduled`}
      />
      <div className="px-5">
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d, i) => {
            const active = i === activeDay
            return (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDay(i)}
                className="px-2.5 py-1 rounded-pill text-[11px]"
                style={{
                  background: active ? 'var(--cyan)' : 'var(--surface)',
                  color: active ? 'var(--bg)' : 'var(--text-sub)',
                }}
              >
                {d}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {loading && [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}

          {!loading && exercises.length === 0 && (
            <div
              className="rounded-card px-4 py-6 text-center"
              style={{ background: 'var(--surface)' }}
            >
              <p className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                No workout for {DAYS[activeDay]}
              </p>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--text-sub)' }}>
                Browse exercises below, or set a weekly schedule any time.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/discover"
                  className="rounded-card h-11 flex items-center justify-center text-[13px] font-medium"
                  style={{ background: 'var(--cyan)', color: 'var(--bg)' }}
                >
                  Browse exercises
                </Link>
                <Link
                  to="/onboarding/schedule"
                  className="rounded-card h-11 flex items-center justify-center text-[13px]"
                  style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}
                >
                  Set weekly schedule
                </Link>
              </div>
            </div>
          )}

          {!loading &&
            exercises.map((ex, i) => {
              const accent = ACCENTS[i % ACCENTS.length]
              return (
                <ExerciseCard
                  key={ex.id}
                  name={ex.name}
                  muscle={ex.muscle}
                  sets={ex.sets}
                  reps={ex.reps}
                  last_weight={ex.last_weight}
                  recommendation={ex.recommendation}
                  rec_note={ex.rec_note}
                  accentColor={accent.color}
                  accentHex={accent.hex}
                  onClick={() => navigate(`/today/exercise/${ex.id}`)}
                />
              )
            })}

          <Link
            to="/today/qr"
            className="rounded-card flex items-center justify-center h-12 text-[14px] gap-2 mt-1"
            style={{ background: 'var(--cyan-dim)', color: 'var(--cyan)' }}
          >
            <span>📷</span>
            <span>Scan Machine QR Code</span>
          </Link>
        </div>
      </div>
    </ScreenWrapper>
  )
}
