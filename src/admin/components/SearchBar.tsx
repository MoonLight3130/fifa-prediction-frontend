interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-[#0a1628] px-4 py-2.5 text-[13px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-grass-500/40"
    />
  )
}
