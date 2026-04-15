import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import { saveWorkoutSession } from '../../lib/stubs'

const STATS = [
  { value: '4,200 lbs', label: 'Volume' },
  { value: '2', label: 'PRs Hit' },
  { value: '5 wks', label: 'Streak' },
]

export default function WorkoutComplete() {
  const navigate = useNavigate()
  const saved = useRef(false)

  useEffect(() => {
    if (saved.current) return
    saved.current = true
    saveWorkoutSession({
      routine_type: 'push',
      location: 'gym',
      duration_minutes: 42,
      exercises_completed: 6,
      total_volume_lbs: 4200,
      prs_hit: [],
    })
  }, [])

  return (
    <ScreenWrapper>
      <div className="pt-20 pb-8 text-center">
        <p className="text-[60px] leading-none">🏆</p>
        <h1 className="mt-5 text-[34px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
          Workout<br />Complete!
        </h1>
        <p className="mt-3 text-[13px]" style={{ color: 'var(--text-sub)' }}>
          Push Day&nbsp;&nbsp;·&nbsp;&nbsp;6 exercises&nbsp;&nbsp;·&nbsp;&nbsp;42 min
        </p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-card text-center py-3"
            style={{ background: 'var(--surface)', minHeight: 72 }}
          >
            <p className="text-[22px] font-bold leading-none" style={{ color: 'var(--cyan)' }}>
              {s.value}
            </p>
            <p className="mt-2 text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 mt-4">
        <div
          className="rounded-card h-12 flex items-center justify-center text-[13px] gap-2"
          style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}
        >
          🏆&nbsp;&nbsp;2 new PRs this session — tap to see
        </div>
      </div>

      <div className="px-5 mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/today')}
          className="w-full h-[52px] rounded-card font-bold text-[15px]"
          style={{ background: 'var(--cyan)', color: 'var(--bg)' }}
        >
          Back to Today
        </button>
        <button
          type="button"
          className="w-full h-11 rounded-card text-[14px] font-medium"
          style={{ background: 'var(--surface-hi)', color: 'var(--text-sub)' }}
        >
          Share Workout
        </button>
      </div>
    </ScreenWrapper>
  )
}
