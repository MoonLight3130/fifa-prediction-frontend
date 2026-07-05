import type { InputHTMLAttributes, ReactNode } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  hint?: string
  rightElement?: ReactNode
}

export default function AuthInput({
  label,
  icon,
  hint,
  rightElement,
  className = '',
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-white/90">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-grass-500">
          {icon}
        </span>
        <input
          {...props}
          className={`w-full rounded-lg border border-white/15 bg-[#0a1628]/80 py-3 pl-11 pr-4 text-[13px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-grass-500/50 focus:ring-1 focus:ring-grass-500/25 ${rightElement ? 'pr-11' : ''} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {hint && <p className="text-[11px] text-white/35">{hint}</p>}
    </div>
  )
}
