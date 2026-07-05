type MedalType = 'gold' | 'silver' | 'bronze'

interface MedalBadgeProps {
  type: MedalType
  size?: 'sm' | 'lg'
}

const styles: Record<
  MedalType,
  { ring: string; fill: string; ribbon: string; text: string }
> = {
  gold: {
    ring: 'from-yellow-300 via-yellow-400 to-amber-600',
    fill: 'from-yellow-200 to-amber-500',
    ribbon: 'from-yellow-500 to-amber-700',
    text: 'text-amber-950',
  },
  silver: {
    ring: 'from-gray-100 via-gray-300 to-gray-500',
    fill: 'from-gray-100 to-gray-400',
    ribbon: 'from-gray-400 to-gray-600',
    text: 'text-gray-800',
  },
  bronze: {
    ring: 'from-orange-300 via-amber-500 to-orange-700',
    fill: 'from-orange-300 to-amber-600',
    ribbon: 'from-amber-600 to-orange-800',
    text: 'text-amber-950',
  },
}

const rankByType: Record<MedalType, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
}

export default function MedalBadge({ type, size = 'sm' }: MedalBadgeProps) {
  const s = styles[type]
  const rank = rankByType[type]
  const isLarge = size === 'lg'

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${isLarge ? 'h-[88px] w-[88px]' : 'h-8 w-8'}`}
    >
      <div
        className={`absolute inset-x-1 top-0 h-2 rounded-sm bg-gradient-to-b ${s.ribbon} ${isLarge ? 'inset-x-3 h-3.5' : ''}`}
      />
      <div
        className={`absolute inset-x-0 top-1.5 mx-auto w-[70%] rounded-full bg-gradient-to-b ${s.ring} p-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${isLarge ? 'top-3 w-[78%] p-[3px]' : ''}`}
      >
        <div
          className={`flex aspect-square items-center justify-center rounded-full bg-gradient-to-br ${s.fill}`}
        >
          <span
            className={`font-bold ${s.text} ${isLarge ? 'text-2xl' : 'text-[11px]'}`}
          >
            {rank}
          </span>
        </div>
      </div>
    </div>
  )
}

export function getMedalType(rank: number): MedalType | null {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return null
}
