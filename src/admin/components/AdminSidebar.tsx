import { NavLink } from 'react-router-dom'
import {
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineHome,
  HiOutlineSpeakerphone,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineX,
  HiOutlineClipboardCheck,
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineHome, end: true },
  { to: '/admin/matches', label: 'Matches', icon: HiOutlineViewGrid },
  { to: '/admin/participants', label: 'Participants', icon: HiOutlineUserGroup },
  { to: '/admin/predictions', label: 'Predictions', icon: HiOutlineClipboardList },
  { to: '/admin/announcements', label: 'Announcements', icon: HiOutlineSpeakerphone },
  { to: '/admin/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/admin/activity', label: 'Activity Log', icon: HiOutlineClipboardCheck },
  { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { user } = useAuth()

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.08] bg-[#0a1628] transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-grass-500">
              Admin Panel
            </p>
            <p className="text-sm font-bold text-white">FIFA Prediction League</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 lg:hidden"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-grass-500/15 text-grass-400'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon className="h-[18px] w-[18px]" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <p className="truncate text-[12px] font-medium text-white">{user?.fullName}</p>
          <p className="text-[11px] text-white/40">{user?.rollNumber}</p>
        </div>
      </aside>
    </>
  )
}
