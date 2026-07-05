import { HiOutlineInbox } from 'react-icons/hi'

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
      <HiOutlineInbox className="h-10 w-10 text-white/20" />
      <p className="mt-3 text-[13px] text-white/40">{message}</p>
    </div>
  )
}
