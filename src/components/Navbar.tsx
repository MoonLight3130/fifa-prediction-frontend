import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiMenu,
  HiX,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlineSpeakerphone,
  HiOutlineShieldCheck,
} from 'react-icons/hi'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatDepartment } from '../lib/userOptions'
import TrophyLogo from './TrophyLogo'

const navLinks = [
  { to: '/', label: 'Home', icon: HiOutlineHome },
  { to: '/fixtures', label: 'Fixtures', icon: HiOutlineCalendar },
  { to: '/predict', label: 'Predict', icon: HiOutlineChartBar },
  { to: '/leaderboard', label: 'Leaderboard', icon: HiOutlineClipboardList },
  { to: '/results', label: 'Results', icon: HiOutlineDocumentText },
  { to: '/dashboard', label: 'My Dashboard', icon: HiOutlineViewGrid },
  { to: '/rules', label: 'Rules', icon: HiOutlineBookOpen },
  { to: '/announcements', label: 'Announcements', icon: HiOutlineSpeakerphone },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 sm:px-8 lg:px-10">
        {/* Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
          <TrophyLogo className="h-9 w-auto sm:h-10" />
          <div className="hidden leading-none sm:block">
            <p className="text-[13px] font-bold uppercase tracking-wide text-white sm:text-sm">
              World Cup
            </p>
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-gold-400 sm:text-[9px]">
              Prediction League
            </p>
          </div>
        </NavLink>

        {/* Desktop Nav — centered */}
        <ul className="hidden items-center justify-center gap-0 xl:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-2 py-2 text-[11.5px] font-medium tracking-wide transition-colors duration-200 xl:px-2.5 ${
                    isActive ? 'text-grass-500' : 'text-white/55 hover:text-white/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <link.icon className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-grass-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Profile + Mobile Toggle */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {user && isAdmin && (
            <NavLink
              to="/admin"
              className="hidden items-center gap-2 rounded-lg border border-grass-500/30 bg-grass-500/10 px-3 py-2 text-[12px] font-semibold text-grass-400 transition-colors hover:bg-grass-500/20 hover:text-grass-300 sm:inline-flex"
            >
              <HiOutlineShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Admin Panel</span>
            </NavLink>
          )}

          {user && (            <>
              <button
                type="button"
                aria-label="Notifications"
                className="hidden rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:block"
              >
                <HiOutlineBell className="h-5 w-5" />
              </button>

              <div ref={profileRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <span className="max-w-[120px] truncate">{user.rollNumber}</span>
                  <HiOutlineChevronDown
                    className={`h-4 w-4 text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-[#0a1628] py-1 shadow-xl">
                    <div className="border-b border-white/[0.08] px-4 py-2.5">
                      <p className="truncate text-[13px] font-medium text-white">{user.fullName}</p>
                      <p className="text-[11px] text-white/40">{formatDepartment(user.department)}</p>
                    </div>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] text-grass-400 transition-colors hover:bg-white/5 hover:text-grass-300"
                      >
                        <HiOutlineShieldCheck className="h-4 w-4" />
                        Admin Panel
                      </NavLink>
                    )}
                    <button                      type="button"
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                      }}
                      className="w-full px-4 py-2.5 text-left text-[13px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden border-t border-white/10 xl:hidden"
        >
          <ul className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-grass-500'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              </li>
            ))}
            {user && isAdmin && (
              <li className="mt-2 border-t border-white/10 pt-3">
                <NavLink
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg border border-grass-500/30 bg-grass-500/10 px-3 py-2.5 text-sm font-semibold text-grass-400"
                >
                  <HiOutlineShieldCheck className="h-4 w-4" />
                  Admin Panel
                </NavLink>
              </li>
            )}
            {user && (
              <li className={`${isAdmin ? 'mt-2' : 'mt-2 border-t border-white/10'} pt-3 pb-1`}>                <p className="px-3 pb-1 text-xs font-semibold text-white/70">{user.rollNumber}</p>
                <p className="px-3 pb-2 text-xs text-white/45">{user.fullName}</p>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="block w-full rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </motion.header>
  )
}

