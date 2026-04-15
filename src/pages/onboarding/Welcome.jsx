import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../../lib/auth'

export default function Welcome() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState(null)

  const handleSendLink = async (e) => {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    setError(null)
    const { error: err } = await signIn(email.trim())
    if (err) {
      setError(err.message || 'Something went wrong')
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  const handleStart = () => navigate('/onboarding/goals')

  return (
    <div
      className="min-h-screen w-full max-w-[390px] mx-auto flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
        <div
          className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center"
          style={{ background: 'var(--cyan)' }}
        >
          <span className="text-[28px] font-bold" style={{ color: 'var(--bg)' }}>G</span>
        </div>
        <h1 className="mt-5 text-[30px] font-bold" style={{ color: 'var(--text)' }}>GymTracker</h1>
        <p className="mt-2 text-[15px]" style={{ color: 'var(--text-sub)' }}>
          Your workouts. Your progress.<br />No fluff.
        </p>
      </div>

      <div className="px-5 pb-10">
        {status === 'sent' ? (
          <div
            className="rounded-card p-4 text-center"
            style={{ background: 'var(--green-dim)', color: 'var(--green)' }}
          >
            <p className="text-[15px] font-bold">Check your email</p>
            <p className="mt-1 text-[12px]" style={{ color: 'var(--text-sub)' }}>
              We sent a magic link to {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendLink} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              className="rounded-card h-12 px-4 text-[14px] outline-none"
              style={{
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid transparent',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending' || !email}
              className="w-full h-[52px] rounded-card font-bold text-[16px] disabled:opacity-60"
              style={{ background: 'var(--cyan)', color: 'var(--bg)' }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Magic Link'}
            </button>
            {error && (
              <p className="text-[12px] text-center" style={{ color: 'var(--red)' }}>
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleStart}
              className="mt-1 text-[13px]"
              style={{ color: 'var(--text-sub)' }}
            >
              Already signed in? <span style={{ color: 'var(--cyan)' }}>Continue setup</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
