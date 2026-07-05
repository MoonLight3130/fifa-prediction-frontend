import type { SelectHTMLAttributes, ReactNode } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import type { SelectOption } from '../../lib/userOptions'

interface AuthSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon: ReactNode
  placeholder: string
  options: SelectOption[]
}

export default function AuthSelect({
  label,
  icon,
  placeholder,
  options,
  ...props
}: AuthSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-white/90">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-grass-500">
          {icon}
        </span>
        <select
          {...props}
          value={props.value ?? ''}
          className="w-full appearance-none rounded-lg border border-white/15 bg-[#0a1628]/80 py-3 pl-11 pr-10 text-[13px] text-white outline-none transition-colors focus:border-grass-500/50 focus:ring-1 focus:ring-grass-500/25 [&>option]:bg-navy-900"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  )
}
