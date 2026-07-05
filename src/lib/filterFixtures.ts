import type { FixtureStageGroup } from './api/types'

export const stageFilters = [
  { id: 'all', label: 'All' },
  { id: 'group', label: 'Group Stage' },
  { id: 'round16', label: 'Round of 16' },
  { id: 'quarter', label: 'Quarter Finals' },
  { id: 'semi', label: 'Semi Finals' },
  { id: 'third', label: 'Third Place Play-off' },
  { id: 'final', label: 'Final' },
] as const

export const groupFilters = [
  { id: 'all', label: 'All Groups' },
  ...(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const).map((g) => ({
    id: g,
    label: `Group ${g}`,
  })),
]

export const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'live', label: 'Live' },
  { id: 'finished', label: 'Finished' },
] as const

export type StageFilterId = (typeof stageFilters)[number]['id']
export type GroupFilterId = (typeof groupFilters)[number]['id']
export type StatusFilterId = (typeof statusFilters)[number]['id']

export function filterFixtureGroups(
  groups: FixtureStageGroup[],
  stage: StageFilterId,
  group: GroupFilterId,
  status: StatusFilterId,
): FixtureStageGroup[] {
  return groups
    .filter((g) => stage === 'all' || g.stage === stage)
    .map((g) => ({
      ...g,
      fixtures: g.fixtures.filter((f) => {
        const groupMatch =
          group === 'all' || f.group === `Group ${group}` || g.stage !== 'group'
        const statusMatch = status === 'all' || f.status === status
        return groupMatch && statusMatch
      }),
    }))
    .filter((g) => g.fixtures.length > 0)
}

export const resultFilters = [
  { id: 'all', label: 'All Results' },
  { id: 'group', label: 'Group Stage' },
  { id: 'knockout', label: 'Knockout Stage' },
] as const

export type ResultFilterId = (typeof resultFilters)[number]['id']
