import { motion } from 'framer-motion'
import { HiOutlineIdentification } from 'react-icons/hi'
import { MdOutlineTimer } from 'react-icons/md'
import { GiTrophyCup } from 'react-icons/gi'
import { IoStatsChart } from 'react-icons/io5'

const steps = [
  {
    icon: HiOutlineIdentification,
    title: 'Register',
    description: 'Sign up with your details',
  },
  {
    icon: MdOutlineTimer,
    title: 'Predict',
    description: 'Predict winner & final score',
  },
  {
    icon: GiTrophyCup,
    title: 'Earn Points',
    description: 'Score points for correct predictions',
  },
  {
    icon: IoStatsChart,
    title: 'Climb Rankings',
    description: 'Climb the leaderboard',
  },
]

export default function HowToPlay() {
  return (
    <section className="bg-white px-5 pb-16 pt-20 sm:px-8 lg:px-10 lg:pb-20 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold text-[#0f172a] sm:text-[1.75rem]"
        >
          How to Play
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-[20px] border border-gray-200/90 bg-white shadow-[0_4px_32px_rgba(15,23,42,0.06)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`group flex flex-col items-center px-6 py-10 text-center transition-colors hover:bg-slate-50/80 ${
                  i < steps.length - 1 ? 'lg:border-r lg:border-gray-200/80' : ''
                } ${i % 2 === 0 && i < steps.length - 1 ? 'sm:border-r sm:border-gray-200/80' : ''} ${
                  i < 2 ? 'sm:border-b sm:border-gray-200/80 lg:border-b-0' : ''
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-slate-200/80">
                  <step.icon
                    className="h-7 w-7 text-[#1e293b] transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.2}
                  />
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-[#0f172a]">{step.title}</h3>
                <p className="mt-1.5 max-w-[180px] text-[13px] leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
