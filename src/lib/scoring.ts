export type MatchWinner = 'home' | 'draw' | 'away'

export function getActualWinner(homeScore: number, awayScore: number): MatchWinner {
  if (homeScore > awayScore) return 'home'
  if (awayScore > homeScore) return 'away'
  return 'draw'
}

export function calculatePoints(
  predictedWinner: MatchWinner,
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
): { points: number; label: string } {
  const actualWinner = getActualWinner(actualHome, actualAway)
  const exactScore = predictedHome === actualHome && predictedAway === actualAway
  const correctWinner = predictedWinner === actualWinner
  const goalDiff = predictedHome - predictedAway
  const actualDiff = actualHome - actualAway
  const correctGoalDiff = goalDiff === actualDiff

  if (exactScore) {
    return { points: 20, label: 'Exact Score' }
  }
  if (correctWinner) {
    return { points: 10, label: 'Correct Winner' }
  }
  if (correctGoalDiff) {
    return { points: 5, label: 'Correct Goal Difference' }
  }
  return { points: 0, label: 'No Points' }
}
