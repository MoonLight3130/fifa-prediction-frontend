import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineInformationCircle } from 'react-icons/hi'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const icons = {
  success: HiOutlineCheckCircle,
  error: HiOutlineExclamation,
  info: HiOutlineInformationCircle,
}

const styles = {
  success: 'border-grass-500/30 bg-grass-500/10 text-grass-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
}

export default function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] shadow-xl ${styles[toast.type]}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{toast.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
