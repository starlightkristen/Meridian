import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import ExerciseCard from '../../components/ui/ExerciseCard'
import SkeletonCard from '../../components/ui/SkeletonCard'
import { getWorkoutForDay } from '../../lib/stubs'

const HOME_EXERCISES = [
  { id: 101, name: 'Bench Press', muscle: 'Chest', sets: 3, reps: 10, last_weight: 135, recommendation: 140, rec_note: 'Hit all sets at 135 ✓' },
  { id: 102, name: 'Overhead Press', muscle: 'Shoulders', sets: 3, reps: 8, last_weight: 95, recommendation: 100, rec_note: 'Clean reps ✓' },
  { id: 103, name: 'Bent Over Row', muscle: 'Back', sets: 3, reps: 10, last_weight: 115, recommendation: 120, rec_note: 'Ready to add weight' },
  { id: 104, name: 'Romanian Deadlift', muscle: 'Hamstrings', sets: 3, reps: 12, last_weight: 115, recommendation: 'Hold 115', rec_note: 'Form first' },
]

export default function TodayHome() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('home')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Simulate fetch — signature stable for Session 2 swap
    getWorkoutForDay('Tue', location).then(() => setLoaded(true))
  }, [location])

  const data = location === 'home' ? HOME_EXERCISES : null

  return (
    <ScreenWrapper>
      <PageHeader title="Today" subtitle="Home · Push Day · Barbell" />
      <div className="px-5">
        <div
          className="rounded-row h-11 p-1 flex"
          style={{ background: 'var(--surface-hi)' }}
        >
          <button
            type="button"
            onClick={() => setLocation('gym')}
            className="flex-1 rounded-[14px] text-[13px] flex items-center justify-center"
            style={{
              background: location === 'gym' ? 'var(--cyan)' : 'transparent',
              color: location === 'gym' ? 'var(--bg)' : 'var(--text-sub)',
            }}
          >
            🏋️&nbsp; Gym
          </button>
          <button
            type="button"
            onClick={() => setLocation('home')}
            className="flex-1 rounded-[14px] text-[13px] flex items-center justify-center"
            style={{
              background: location === 'home' ? 'var(--cyan)' : 'transparent',
              color: location === 'home' ? 'var(--bg)' : 'var(--text-sub)',
            }}
          >
            🏠&nbsp; Home
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {!loaded
            ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : data.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  name={ex.name}
                  muscle={ex.muscle}
                  sets={ex.sets}
                  reps={ex.reps}
                  last_weight={ex.last_weight}
                  recommendation={ex.recommendation}
                  rec_note={ex.rec_note}
                  accentColor="var(--cyan)"
                  accentHex="#33D9F2"
                  onClick={() => navigate(`/today/exercise/${ex.id}`)}
                />
              ))}
        </div>
      </div>
    </ScreenWrapper>
  )
}
