import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-white/45">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {trend && <p className="mt-1 text-[11px] text-grass-400">{trend}</p>}
        </div>
        <div className="rounded-xl bg-grass-500/10 p-3 text-grass-400">{icon}</div>
      </div>
    </motion.div>
  )
}
