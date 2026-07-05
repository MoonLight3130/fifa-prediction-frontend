import { NavLink } from 'react-router-dom'
import { HiOutlineHome, HiOutlineMenu, HiOutlineLogout } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.08] bg-navy-950/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-white/10 p-2 text-white/70 hover:bg-white/5 lg:hidden"
        >
          <HiOutlineMenu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">League Control Center</p>
          <p className="text-sm font-semibold text-white">Administrator Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[12px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <HiOutlineHome className="h-4 w-4" />
          <span className="hidden sm:inline">View Site</span>
        </NavLink>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-[12px] font-medium text-red-300 transition-colors hover:bg-red-500/20"
        >
          <HiOutlineLogout className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
