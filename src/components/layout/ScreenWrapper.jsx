export default function ScreenWrapper({ children, padBottom = true, className = '' }) {
  return (
    <div
      className={`min-h-screen max-w-md mx-auto ${className}`}
      style={{
        paddingBottom: padBottom ? 'calc(env(safe-area-inset-bottom) + 80px)' : undefined,
      }}
    >
      {children}
    </div>
  )
}
