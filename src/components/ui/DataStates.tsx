interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-sm text-white/50">{message}</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-center">
      <p className="text-sm text-red-300">{message}</p>
    </div>
  )
}

export function EmptyDataState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center">
      <p className="text-sm text-white/40">{message}</p>
    </div>
  )
}
