import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import Pill from '../../components/ui/Pill'
import RestTimer from '../../components/ui/RestTimer'
import { getExerciseHistory, getRecommendation, getWorkoutForDay, saveLogs } from '../../lib/stubs'

export default function ExerciseLog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState(null)
  const [rec, setRec] = useState(null)
  const [sets, setSets] = useState([
    { weight: 90, reps: 10, done: true },
    { weight: 90, reps: null, done: false },
    { weight: null, reps: null, done: false },
  ])

  useEffect(() => {
    Promise.all([
      getWorkoutForDay('Tue', 'gym'),
      getRecommendation(id),
      getExerciseHistory(id),
    ]).then(([workout, r]) => {
      const found = workout.exercises.find((e) => String(e.id) === String(id)) ?? workout.exercises[0]
      setExercise(found)
      setRec(r)
    })
  }, [id])

  const toggleSet = (i) => {
    setSets((prev) =>
      prev.map((s, idx) =>
        idx === i ? { ...s, done: !s.done } : s,
      ),
    )
  }

  const handleNext = async () => {
    await saveLogs({ exercise_id: id, sets })
    navigate('/today/complete')
  }

  if (!exercise) {
    return (
      <ScreenWrapper>
        <PageHeader back backLabel="Push Day" title="Loading..." />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Push Day" title={exercise.name} />
      <div className="px-5">
        <Pill
          label={`${exercise.muscle}  ·  Primary`}
          bg="var(--cyan-dim)"
          color="var(--cyan)"
        />

        {rec && (
          <div
            className="mt-3 rounded-card px-4 py-3"
            style={{ background: 'var(--cyan-dim)' }}
          >
            <p className="text-[11px] font-medium" style={{ color: 'var(--cyan)' }}>
              Recommended today
            </p>
            <p className="mt-1.5 text-[13px] font-bold" style={{ color: 'var(--text)' }}>
              {rec.weight} lbs — {rec.note}
            </p>
          </div>
        )}

        <p className="mt-5 text-[13px]" style={{ color: 'var(--text-sub)' }}>
          Log Your Sets
        </p>
        <div className="mt-2.5 flex flex-col gap-2">
          {sets.map((s, i) => {
            const active = s.done
            return (
              <div
                key={i}
                className="rounded-card h-14 px-3 flex items-center justify-between"
                style={{
                  background: active ? 'var(--cyan-dim)' : 'var(--surface-hi)',
                }}
              >
                <span
                  className="text-[13px] w-12"
                  style={{ color: active ? 'var(--cyan)' : 'var(--text-sub)' }}
                >
                  Set {i + 1}
                </span>
                <div
                  className="h-9 w-[88px] rounded-lg flex items-center gap-1 px-2.5 justify-center"
                  style={{
                    background: active ? 'var(--bg)' : 'var(--surface)',
                  }}
                >
                  <span className="text-[10px]" style={{ color: 'var(--text-sub)' }}>lbs</span>
                  <span
                    className="text-[17px] font-bold"
                    style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
                  >
                    {s.weight ?? '—'}
                  </span>
                </div>
                <div
                  className="h-9 w-[68px] rounded-lg flex items-center gap-1 px-2 justify-center"
                  style={{
                    background: active ? 'var(--bg)' : 'var(--surface)',
                  }}
                >
                  <span className="text-[10px]" style={{ color: 'var(--text-sub)' }}>reps</span>
                  <span
                    className="text-[17px] font-bold"
                    style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
                  >
                    {s.reps ?? '—'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSet(i)}
                  aria-label={active ? 'Uncheck set' : 'Check set'}
                  className="text-[18px] font-bold w-6"
                  style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
                >
                  {active ? '✓' : '○'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-4">
          <RestTimer seconds={90} />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="mt-6 w-full h-13 rounded-card font-bold text-[15px]"
          style={{ background: 'var(--cyan)', color: 'var(--bg)', height: 52 }}
        >
          Next: Shoulder Press →
        </button>
      </div>
    </ScreenWrapper>
  )
}
