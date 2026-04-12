import { NavLink } from 'react-router-dom'
import { LayoutGrid, Target, LineChart, Settings } from 'lucide-react'

const tabs = [
  { to: '/discover', label: 'Discover', Icon: LayoutGrid },
  { to: '/today', label: 'Today', Icon: Target },
  { to: '/progress', label: 'Progress', Icon: LineChart },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export default function NavBar() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-white/5"
      style={{ background: 'var(--surface)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex justify-around items-stretch h-16 max-w-md mx-auto">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `h-full flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-cyan' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{label}</span>
                  <span
                    className={`block w-1 h-1 rounded-full -mt-0.5 ${
                      isActive ? 'bg-cyan' : 'bg-transparent'
                    }`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
