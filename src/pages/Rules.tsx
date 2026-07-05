import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi'
import { LEAGUE_RULE_SECTIONS, buildScoringTiersFromSettings } from '../lib/api/types'
import { fetchSettings } from '../lib/api/settings'
import { useAsync } from '../hooks/useAsync'
import { LoadingState } from '../components/ui/DataStates'
import heroBg from '../assets/hero-bg.png'

function SidebarCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default function Rules() {
  const { data: settings, loading } = useAsync(fetchSettings, [])
  const leagueRules = LEAGUE_RULE_SECTIONS
  const scoringTiers = buildScoringTiersFromSettings(settings)
  const [activeSection, setActiveSection] = useState(leagueRules[0].id)

  const current = leagueRules.find((s) => s.id === activeSection) ?? leagueRules[0]

  if (loading) {
    return (
      <div className="relative min-h-screen bg-navy-950 pt-[72px]">
        <LoadingState message="Loading rules…" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-navy-950 pt-[72px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="flex flex-col gap-4">
            <SidebarCard>
              <h3 className="text-[13px] font-semibold text-white">Contents</h3>
              <nav className="mt-3 space-y-0.5">
                {leagueRules.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors ${
                      activeSection === section.id
                        ? 'bg-grass-500/10 font-medium text-grass-500'
                        : 'text-white/55 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        activeSection === section.id ? 'bg-grass-500' : 'bg-white/25'
                      }`}
                    />
                    {section.title}
                  </button>
                ))}
              </nav>
            </SidebarCard>

            <SidebarCard>
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="h-4 w-4 text-grass-500" />
                <p className="text-[12px] font-semibold text-white">Fair Play</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/45">
                This is an unofficial college fan platform. Not affiliated with FIFA.
              </p>
            </SidebarCard>

            <SidebarCard>
              <p className="text-[12px] font-semibold text-white">Ready to play?</p>
              <Link
                to="/predict"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-grass-500 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-grass-600"
              >
                Start Predicting
              </Link>
            </SidebarCard>
          </aside>

          <main>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1628]/80">
              <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50" />
              <div className="relative px-6 py-8 sm:px-8 sm:py-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grass-500">
                  League Guide
                </p>
                <h1 className="mt-1 text-2xl font-bold uppercase tracking-wide text-white sm:text-[1.75rem]">
                  Rules
                </h1>
                <p className="mt-2 max-w-lg text-[13px] text-white/50">
                  Everything you need to know about predicting, scoring, and competing.
                </p>
              </div>
            </div>

            {/* Scoring tiers */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scoringTiers.map((tier) => (
                <div
                  key={tier.label}
                  className={`rounded-xl border p-4 ${
                    tier.points > 0
                      ? 'border-grass-500/20 bg-grass-500/5'
                      : 'border-white/[0.08] bg-white/[0.02]'
                  }`}
                >
                  <p
                    className={`text-2xl font-bold ${tier.points > 0 ? 'text-grass-500' : 'text-white/30'}`}
                  >
                    {tier.points}
                    {tier.points > 0 && (
                      <span className="ml-1 text-[12px] font-medium text-white/40">pts</span>
                    )}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-white">{tier.label}</p>
                  <p className="mt-0.5 text-[11px] text-white/45">{tier.description}</p>
                </div>
              ))}
            </div>

            {/* Active section content */}
            <article className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0a1628]/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-2.5">
                <HiOutlineBookOpen className="h-5 w-5 text-grass-500" />
                <h2 className="text-lg font-bold text-white">{current.title}</h2>
              </div>

              <div className="mt-5 space-y-4">
                {current.content.map((paragraph) => (
                  <p key={paragraph} className="text-[14px] leading-relaxed text-white/70">
                    {paragraph}
                  </p>
                ))}
              </div>

              {current.bullets && (
                <ul className="mt-5 space-y-2.5">
                  {current.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-[13px] text-white/65">
                      <HiOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-grass-500" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </article>

            {/* All sections overview */}
            <section className="mt-6 space-y-4">
              {leagueRules.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/40 p-5 sm:p-6"
                >
                  <h3 className="text-[15px] font-semibold text-white">{section.title}</h3>
                  <div className="mt-3 space-y-2">
                    {section.content.map((p) => (
                      <p key={p} className="text-[13px] leading-relaxed text-white/55">
                        {p}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-3 space-y-1.5">
                      {section.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[12px] text-white/50">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-grass-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
              <HiOutlineInformationCircle className="h-4 w-4" />
              Rules may be updated during the tournament. Check Announcements for changes.
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
