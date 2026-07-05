import { getFlagSrc, resolveFlagCode } from '../lib/flags'

const sizeClasses = {
  sm: 'h-5 w-7',
  md: 'h-7 w-10',
  lg: 'h-14 w-[4.5rem]',
} as const

interface FlagProps {
  code: string
  size?: keyof typeof sizeClasses
  className?: string
  alt?: string
}

export default function Flag({ code, size = 'md', className = '', alt }: FlagProps) {
  const resolved = resolveFlagCode(code)
  const normalized = resolved ?? code.toUpperCase()
  const src = getFlagSrc(code)

  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px] font-bold text-white/40 ${sizeClasses[size]} ${className}`}
        aria-label={alt ?? `${normalized} flag unavailable`}
      >
        {normalized}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? `${normalized} flag`}
      className={`rounded-md object-cover shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${sizeClasses[size]} ${className}`}
      loading="lazy"
      decoding="async"
    />
  )
}
