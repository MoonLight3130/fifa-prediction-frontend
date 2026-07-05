import { motion } from 'framer-motion'
import { HiOutlineSpeakerphone } from 'react-icons/hi'
import { fetchPublishedAnnouncements } from '../lib/api/announcements'
import { useAsync } from '../hooks/useAsync'
import { ErrorState, LoadingState } from '../components/ui/DataStates'
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

export default function Announcements() {
  const { data: announcementsData, loading, error } = useAsync(fetchPublishedAnnouncements, [])
  const announcements = announcementsData ?? []

  return (
    <div className="min-h-screen bg-navy-950">
      <section
        className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-10 pt-24 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.98) 100%), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-grass-500">
              League Updates
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Announcements</h1>
            <p className="mx-auto mt-3 max-w-xl text-[14px] text-white/50">
              Stay updated with the latest league news, match updates, and important notices.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingState message="Loading announcements..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : announcements.length === 0 ? (
          <SidebarCard className="text-center">
            <HiOutlineSpeakerphone className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-3 text-[14px] text-white/50">No announcements published yet.</p>
          </SidebarCard>
        ) : (
          <div className="space-y-4">
            {announcements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SidebarCard>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {item.priority === 'high' && (
                        <span className="mb-2 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
                          Important
                        </span>
                      )}
                      <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/60">{item.body}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] text-white/30">
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                </SidebarCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
