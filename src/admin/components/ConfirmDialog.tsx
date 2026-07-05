import { motion } from 'framer-motion'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-[13px] text-white/70 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-[13px] font-semibold text-white ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-grass-500 hover:bg-grass-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
