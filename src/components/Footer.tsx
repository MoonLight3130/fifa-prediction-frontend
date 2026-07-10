import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import TrophyLogo from './TrophyLogo'
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa6'

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/fixtures', label: 'Fixtures' },
  { to: '/predict', label: 'Predict' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

const leagueLinks = [
  { to: '/results', label: 'Results' },
  { to: '/dashboard', label: 'My Dashboard' },
  { to: '/rules', label: 'Rules' },
  { to: '/announcements', label: 'Announcements' },
]

const supportLinks = [
  { label: 'Help Center', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
]

const socialLinks = [
  { 
    icon: FaWhatsapp, 
    label: 'WhatsApp', 
    href: 'https://chat.whatsapp.com/Kc7DTXGjWUi0PbkMyPaNX2',
    hoverClass: 'hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:shadow-[0_0_12px_rgba(37,211,102,0.4)]'
  },
  { 
    icon: FaInstagram, 
    label: 'Instagram', 
    href: 'https://www.instagram.com/collegeunionmesitam?igsh=MTdxNjlobmRnYnY0bw==',
    hoverClass: 'hover:border-pink-500/50 hover:bg-gradient-to-tr hover:from-orange-500/20 hover:to-pink-500/20 hover:text-pink-500 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)]'
  },
  { 
    icon: FaLinkedinIn, 
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/haransanthosh/',
    hoverClass: 'hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:shadow-[0_0_12px_rgba(10,102,194,0.4)]'
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 text-white">
      <div className="footer-glow pointer-events-none absolute inset-0" />
      {/* Curved transition from white section */}
      <div className="pointer-events-none absolute -top-[1px] left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0V20C240 55 480 5 720 25C960 45 1200 10 1440 30V0H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-sm"
          >
            <Link to="/" className="inline-flex items-center gap-2.5">
              <TrophyLogo className="h-10 w-auto" />
              <div className="leading-none">
                <p className="text-base font-bold tracking-wide text-white">World Cup</p>
                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/55">
                  College Prediction League
                </p>
              </div>
            </Link>

            <p className="mt-5 text-[13px] leading-relaxed text-white/50">
              Join your college community in predicting World Cup match outcomes.
              Compete with friends, earn points, and climb the leaderboard.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, label, href, hoverClass }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 ${hoverClass}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Explore */}
          <FooterColumn title="Explore" delay={0.05}>
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className="text-[13px] text-white/50 transition-colors duration-200 hover:text-grass-500"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </FooterColumn>

          {/* League */}
          <FooterColumn title="League" delay={0.1}>
            {leagueLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-[13px] text-white/50 transition-colors duration-200 hover:text-grass-500"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="Support" delay={0.15}>
            {supportLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] text-white/50 transition-colors duration-200 hover:text-grass-500"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] py-7 sm:flex-row">
          <p className="text-[12px] text-white/35">
            © {new Date().getFullYear()} World Cup College Prediction League. All rights reserved to Haran.
          </p>
          <p className="text-[11px] text-white/25">
            This is an unofficial college fan prediction platform. Not affiliated with FIFA.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  delay,
  children,
}: {
  title: string
  delay: number
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </motion.div>
  )
}
