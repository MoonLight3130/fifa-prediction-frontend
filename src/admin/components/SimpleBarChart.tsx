interface SimpleBarChartProps {
  data: { label: string; value: number }[]
  color?: string
}

export default function SimpleBarChart({ data, color = '#22c55e' }: SimpleBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-[12px]">
            <span className="text-white/60">{item.label}</span>
            <span className="font-medium text-white">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
