import { motion } from 'framer-motion'

interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-lg rounded-[20px] p-10 text-center"
      >
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-white/60">{description}</p>
        <p className="mt-6 text-sm text-white/40">Coming soon</p>
      </motion.div>
    </main>
  )
}
