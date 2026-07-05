/**
 * Check if a team name indicates an undecided/placeholder team
 * Examples: "Winner M89", "Loser M101", "Winner QF1", "TBD"
 */
export function isUndecidedTeam(teamName: string): boolean {
  if (!teamName) return true
  
  const undecidedPatterns = [
    /^Winner\s+[A-Z]+\d+$/i,  // Winner M89, Winner QF1
    /^Loser\s+[A-Z]+\d+$/i,   // Loser M101
    /^TBD$/i,                  // To Be Determined
    /^To\s+Be\s+Determined$/i, // To Be Determined
    /^Winner\s+of\s+/i,        // Winner of Match X
    /^Loser\s+of\s+/i,         // Loser of Match X
    /^-\s*$/i,                 // Just a dash
    /^\?\s*$/i,                // Just a question mark
  ]
  
  return undecidedPatterns.some(pattern => pattern.test(teamName.trim()))
}

/**
 * Check if a match has both teams finalized (no undecided teams)
 */
export function isMatchFinalized(homeTeamName: string, awayTeamName: string): boolean {
  return !isUndecidedTeam(homeTeamName) && !isUndecidedTeam(awayTeamName)
}

/**
 * Get the prediction availability status for a match
 */
export type PredictionStatus = 'open' | 'coming-soon' | 'closed'

export function getPredictionStatus(
  homeTeamName: string,
  awayTeamName: string,
  predictionDeadline: string | null | undefined,
  kickoffAt: string | null | undefined,
  predictionsOpen: boolean | undefined,
  resultPublished: boolean | undefined
): PredictionStatus {
  // Check if match is finalized
  if (!isMatchFinalized(homeTeamName, awayTeamName)) {
    return 'coming-soon'
  }
  
  // Check if predictions are manually closed or result published
  if (!predictionsOpen || resultPublished) {
    return 'closed'
  }
  
  // Check if deadline has passed
  const now = new Date()
  const deadlineTime = predictionDeadline ? new Date(predictionDeadline) : kickoffAt ? new Date(kickoffAt) : null
  
  if (deadlineTime && now > deadlineTime) {
    return 'closed'
  }
  
  return 'open'
}

/**
 * Get user-friendly message for prediction status
 */
export function getPredictionStatusMessage(status: PredictionStatus): string {
  switch (status) {
    case 'open':
      return 'Predictions are open'
    case 'coming-soon':
      return 'This match is not yet finalized. Predictions will open once both teams are confirmed.'
    case 'closed':
      return 'Predictions are closed for this match'
  }
}

/**
 * Get button text for prediction action
 */
export function getPredictionButtonText(status: PredictionStatus): string {
  switch (status) {
    case 'open':
      return 'Predict Now'
    case 'coming-soon':
      return 'Coming Soon'
    case 'closed':
      return 'Prediction Closed'
  }
}
