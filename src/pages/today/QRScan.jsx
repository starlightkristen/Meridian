import { useState } from 'react'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import { saveMachineMap } from '../../lib/stubs'

const SUGGESTIONS = ['Chest Press', 'Pec Deck', 'Cable Fly', 'Seated Row', 'Lat Pulldown']

export default function QRScan() {
  const [labeled, setLabeled] = useState(false)

  const handlePick = async (exercise) => {
    await saveMachineMap('stub-qr-value', exercise)
    setLabeled(true)
  }

  return (
    <ScreenWrapper>
      <PageHeader back backLabel="Today" title="Scan Machine" subtitle="Point at any QR code on the machine" />
      <div className="px-5">
        <div
          className="relative aspect-square rounded-card overflow-hidden"
          style={{ background: 'var(--surface-hi)' }}
        >
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
            <span
              key={pos}
              className={`absolute w-9 h-9 rounded border-[3px] ${pos}`}
              style={{ borderColor: 'var(--cyan)' }}
              aria-hidden
            />
          ))}
          <span
            className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-0.5 opacity-80"
            style={{ background: 'var(--cyan)' }}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[12px]" style={{ color: 'var(--text-sub)' }}>Camera preview</p>
            <p className="text-[12px]" style={{ color: 'var(--text-sub)' }}>(browser getUserMedia API)</p>
          </div>
        </div>

        <div
          className="mt-5 rounded-card px-4 py-3"
          style={{ background: 'var(--amber-dim)' }}
        >
          <p className="text-[14px] font-bold" style={{ color: 'var(--amber)' }}>
            {labeled ? 'Saved ✓' : 'New machine — label it once'}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: 'var(--text-sub)' }}>
            What exercise do you do here?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handlePick(s)}
                className="px-2.5 py-1 rounded-pill text-[11px]"
                style={{ background: 'var(--surface-hi)', color: 'var(--text)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}
