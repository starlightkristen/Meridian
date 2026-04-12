import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, subtitle, showBack = false, right = null }) {
  const navigate = useNavigate()
  return (
    <header
      className="sticky top-0 z-30 px-4 pt-3 pb-3"
      style={{ background: 'var(--bg)', paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="-ml-2 p-2 rounded-full text-text hover:bg-surface-hi active:bg-surface-hi"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {title && <h1 className="text-xl font-bold text-text truncate">{title}</h1>}
          {subtitle && <p className="text-xs text-text-sub mt-0.5">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  )
}
