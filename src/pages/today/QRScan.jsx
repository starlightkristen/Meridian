import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import ScreenWrapper from '../../components/layout/ScreenWrapper'
import PageHeader from '../../components/layout/PageHeader'
import { getExercises, getMachineMap, saveMachineMap } from '../../lib/stubs'

export default function QRScan() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const scanningRef = useRef(true)

  const [cameraError, setCameraError] = useState(null)
  const [unknownQR, setUnknownQR] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraError('not_available')
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        loop()
      } catch (err) {
        setCameraError(err?.name === 'NotAllowedError' ? 'denied' : 'unavailable')
      }
    }

    const loop = () => {
      if (!scanningRef.current) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        })
        if (code?.data) {
          handleDetected(code.data)
          return
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    const handleDetected = async (qrValue) => {
      scanningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const known = await getMachineMap(qrValue)
      if (known?.id) {
        navigate(`/today/exercise/${known.id}`)
      } else {
        const options = await getExercises({ type: 'strength', limit: 20 })
        setSuggestions(options)
        setUnknownQR(qrValue)
      }
    }

    start()

    return () => {
      cancelled = true
      scanningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [navigate])

  const handlePickExercise = async (exerciseId) => {
    if (saving) return
    setSaving(true)
    await saveMachineMap(unknownQR, exerciseId)
    navigate(`/today/exercise/${exerciseId}`)
  }

  return (
    <ScreenWrapper>
      <PageHeader
        back
        backLabel="Today"
        title="Scan Machine"
        subtitle="Point at any QR code on the machine"
      />
      <div className="px-5">
        <div
          className="relative aspect-square rounded-card overflow-hidden"
          style={{ background: 'var(--surface-hi)' }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

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

          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>
                {cameraError === 'denied'
                  ? 'Camera access required'
                  : 'Camera not available'}
              </p>
              <p className="mt-2 text-[12px]" style={{ color: 'var(--text-sub)' }}>
                {cameraError === 'denied'
                  ? 'Allow camera in your browser settings to scan machines.'
                  : 'Use manual search to find the exercise instead.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/library')}
                className="mt-4 px-4 py-2 rounded-pill text-[12px]"
                style={{ background: 'var(--cyan)', color: 'var(--bg)' }}
              >
                Search exercises
              </button>
            </div>
          )}
        </div>

        {unknownQR && (
          <div
            className="mt-5 rounded-card px-4 py-3"
            style={{ background: 'var(--amber-dim)' }}
          >
            <p className="text-[14px] font-bold" style={{ color: 'var(--amber)' }}>
              New machine — label it once
            </p>
            <p className="mt-1 text-[12px]" style={{ color: 'var(--text-sub)' }}>
              What exercise do you do here?
            </p>
            <div className="mt-3 flex flex-wrap gap-2 max-h-52 overflow-y-auto">
              {suggestions.length === 0 && (
                <p className="text-[12px]" style={{ color: 'var(--text-sub)' }}>
                  Loading exercises...
                </p>
              )}
              {suggestions.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  disabled={saving}
                  onClick={() => handlePickExercise(ex.id)}
                  className="px-2.5 py-1 rounded-pill text-[11px] disabled:opacity-60"
                  style={{ background: 'var(--surface-hi)', color: 'var(--text)' }}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  )
}
