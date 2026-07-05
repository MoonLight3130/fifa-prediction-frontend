export type MatchStatus =
  | 'Upcoming'
  | 'Ongoing'
  | 'Live'
  | 'Finished'
  | 'Delayed'
  | 'Cancelled'

export interface Team {
  name: string
  code?: string
}

export interface Match {
  id: string
  stage: string
  stageLabel: string
  group?: string
  matchCode?: string
  date: string
  time: string
  kickoffAt?: string | null
  predictionDeadline?: string | null
  predictionsOpen: boolean
  homeTeam: Team
  awayTeam: Team
  venue?: string
  hostCity?: string
  status: MatchStatus
  homeScore: number | null
  awayScore: number | null
  resultPublished: boolean
}

export interface Fixture {
  id: string
  matchCode?: string
  stage: string
  group?: string
  date: string
  time: string
  home: Team
  away: Team
  homeScore?: number | null
  awayScore?: number | null
  status: 'upcoming' | 'live' | 'finished'
  venue?: string
  hostCity?: string
  kickoffAt?: string | null
  predictionsOpen?: boolean
}

export interface FixtureStageGroup {
  stage: string
  title: string
  icon: string
  viewLink: string
  fixtures: Fixture[]
}

export interface MatchResult {
  matchId: string
  stage: 'group' | 'knockout'
  stageLabel: string
  group?: string
  date: string
  time: string
  home: Team & { code?: string }
  away: Team & { code?: string }
  homeScore: number
  awayScore: number
  venue?: string
  hostCity?: string
}

export interface Prediction {
  id: string
  matchId: string
  rollNumber: string
  fullName: string
  department: string
  semester: string
  winner: 'home' | 'draw' | 'away'
  homeScore: number
  awayScore: number
  pointsEarned: number
  pointsLabel: string
  submittedAt: string
}

export interface LeaderboardEntry {
  rank: number
  rollNumber: string
  name: string
  totalPoints: number
  correctWinners: number
  exactScores: number
  predictionsSubmitted?: number
  department?: string
  semester?: string
  status?: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  priority: 'normal' | 'high'
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  tournamentName: string
  season: string
  tournamentLogo: string
  pointsExactScore: number
  pointsCorrectWinner: number
  pointsGoalDifference: number
  registrationOpen: boolean
  predictionsLocked: boolean
  siteName: string
  collegeName: string
  contactEmail: string
  maintenanceMode: boolean
  announcementBanner: string
  homepageBanner: string
  themeAccent: string
  updatedAt?: string
}

export interface Participant {
  id: string
  fullName: string
  rollNumber: string
  department: string
  semester: string
  role: string
  status: string
  totalPoints: number
  correctWinnerPredictions: number
  exactScorePredictions: number
  predictionsSubmitted: number
  rank: number
}

export interface ActivityLogEntry {
  id: string
  action: string
  details: string
  adminRollNumber: string
  timestamp: string
}

export interface HomeStats {
  totalMatches: number
  liveMatches: number
  totalPredictions: number
  totalParticipants: number
}

export interface RuleSection {
  id: string
  title: string
  content: string[]
  bullets?: string[]
}

export interface ScoringTierDisplay {
  label: string
  points: number
  description: string
}

export const LEAGUE_RULE_SECTIONS: RuleSection[] = [
  {
    id: 'overview',
    title: 'League Overview',
    content: [
      'The World Cup College Prediction League is an unofficial fan competition for students to predict FIFA World Cup match outcomes, earn points, and compete on the college leaderboard.',
      'All registered students with a valid roll number can participate. One account per student.',
    ],
  },
  {
    id: 'joining',
    title: 'How to Join',
    content: ['Getting started takes only a few minutes:'],
    bullets: [
      'Register with your full name, roll number, department, and year/semester.',
      'Log in using your roll number and password.',
      'Browse fixtures and submit predictions before each match deadline.',
      'Track your points on the dashboard and climb the leaderboard.',
    ],
  },
  {
    id: 'predictions',
    title: 'Making Predictions',
    content: [
      'For each match, you must predict the winner (or draw) and the full-time score.',
      'Predictions can be submitted or edited until the match kickoff time or admin deadline.',
      'Once the match starts or predictions are closed, entries are locked and cannot be changed.',
      'You may predict any published fixture — group stage and knockout rounds.',
    ],
    bullets: [
      'Select the winning team or choose Draw.',
      'Enter your predicted home and away scores.',
      'Confirm your details and submit before the deadline.',
    ],
  },
  {
    id: 'scoring',
    title: 'Scoring System',
    content: [
      'Points are awarded after the final whistle based on how accurate your prediction was. Only the highest applicable tier is awarded per match (points do not stack).',
    ],
    bullets: [
      'Exact Score — highest tier (correct winner and exact home/away score).',
      'Correct Winner — middle tier (correct outcome but not the exact score).',
      'Correct Goal Difference — lower tier (same goal difference as the actual result).',
      'No match points — 0 points if none of the above apply.',
    ],
  },
  {
    id: 'leaderboard',
    title: 'Leaderboard & Rankings',
    content: [
      'The leaderboard ranks all participants by total points earned across all completed matches.',
      'In case of a tie, players with more exact score predictions rank higher, followed by more correct winner predictions.',
      'Rankings update automatically when match results are published.',
    ],
    bullets: [
      'Total Points — cumulative score from all finished matches.',
      'Correct Winners — count of matches where you predicted the right outcome.',
      'Exact Scores — count of matches where you predicted the precise final score.',
    ],
  },
  {
    id: 'deadlines',
    title: 'Deadlines & Locking',
    content: [
      'Each fixture displays a countdown showing time remaining before predictions close.',
      'All times on the website are shown in your local timezone.',
      'Late submissions after kickoff will not be accepted under any circumstances.',
    ],
  },
  {
    id: 'conduct',
    title: 'Fair Play & Conduct',
    content: [
      'This is a college fan prediction platform and is not affiliated with FIFA or any official World Cup organisation.',
      'Any attempt to manipulate the leaderboard, share accounts, or submit fraudulent entries may result in disqualification.',
      'The league organisers reserve the right to update these rules and announce changes via the Announcements page.',
    ],
  },
]

export function buildScoringTiersFromSettings(settings?: AppSettings | null): ScoringTierDisplay[] {
  const exact = settings?.pointsExactScore ?? 20
  const winner = settings?.pointsCorrectWinner ?? 10
  const diff = settings?.pointsGoalDifference ?? 5
  return [
    { label: 'Exact Score', points: exact, description: 'Correct winner and exact final score' },
    { label: 'Correct Winner', points: winner, description: 'Right outcome, wrong score' },
    { label: 'Goal Difference', points: diff, description: 'Same goal difference as actual result' },
    { label: 'No Points', points: 0, description: 'Incorrect prediction' },
  ]
}

export const SCORING_TIERS = buildScoringTiersFromSettings()

export function formatRank(rank: number): string {
  const suffix =
    rank % 10 === 1 && rank % 100 !== 11
      ? 'st'
      : rank % 10 === 2 && rank % 100 !== 12
        ? 'nd'
        : rank % 10 === 3 && rank % 100 !== 13
          ? 'rd'
          : 'th'
  return `${rank}${suffix}`
}
