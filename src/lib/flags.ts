import br from '../assets/flags/br.svg'
import es from '../assets/flags/es.svg'
import de from '../assets/flags/de.svg'
import pt from '../assets/flags/pt.svg'
import nl from '../assets/flags/nl.svg'
import ar from '../assets/flags/ar.svg'
import fr from '../assets/flags/fr.svg'
import uy from '../assets/flags/uy.svg'
import mx from '../assets/flags/mx.svg'
import eng from '../assets/flags/eng.svg'
import ca from '../assets/flags/ca.svg'
import ma from '../assets/flags/ma.svg'
import jp from '../assets/flags/jp.svg'
import rs from '../assets/flags/rs.svg'
import us from '../assets/flags/us.svg'
import be from '../assets/flags/be.svg'
import eg from '../assets/flags/eg.svg'
import no from '../assets/flags/no.svg'
import ch from '../assets/flags/ch.svg'
import co from '../assets/flags/co.svg'
import py from '../assets/flags/py.svg'

/** ISO 3166-1 alpha-2 codes, plus ENG for England (no ISO code). */
export type FlagCode =
  | 'BR'
  | 'ES'
  | 'DE'
  | 'PT'
  | 'NL'
  | 'AR'
  | 'FR'
  | 'UY'
  | 'MX'
  | 'ENG'
  | 'CA'
  | 'MA'
  | 'JP'
  | 'RS'
  | 'US'
  | 'BE'
  | 'EG'
  | 'NO'
  | 'CH'
  | 'CO'
  | 'PY'

export const flagSources: Record<FlagCode, string> = {
  BR: br,
  ES: es,
  DE: de,
  PT: pt,
  NL: nl,
  AR: ar,
  FR: fr,
  UY: uy,
  MX: mx,
  ENG: eng,
  CA: ca,
  MA: ma,
  JP: jp,
  RS: rs,
  US: us,
  BE: be,
  EG: eg,
  NO: no,
  CH: ch,
  CO: co,
  PY: py,
}

/** FIFA 3-letter codes and common aliases mapped to flag assets. */
const flagAliases: Record<string, FlagCode> = {
  USA: 'US',
  UNITED_STATES: 'US',
  BEL: 'BE',
  BELGIUM: 'BE',
  EGY: 'EG',
  EGYPT: 'EG',
  NOR: 'NO',
  NORWAY: 'NO',
  SUI: 'CH',
  SWITZERLAND: 'CH',
  COL: 'CO',
  COLOMBIA: 'CO',
  PAR: 'PY',
  PARAGUAY: 'PY',
  BRA: 'BR',
  BRAZIL: 'BR',
  ESP: 'ES',
  SPAIN: 'ES',
  GER: 'DE',
  GERMANY: 'DE',
  POR: 'PT',
  PORTUGAL: 'PT',
  NED: 'NL',
  NETHERLANDS: 'NL',
  ARG: 'AR',
  ARGENTINA: 'AR',
  FRA: 'FR',
  FRANCE: 'FR',
  URU: 'UY',
  URUGUAY: 'UY',
  MEX: 'MX',
  MEXICO: 'MX',
  CAN: 'CA',
  CANADA: 'CA',
  MAR: 'MA',
  MOROCCO: 'MA',
  JPN: 'JP',
  JAPAN: 'JP',
  SRB: 'RS',
  SERBIA: 'RS',
  ENG: 'ENG',
  ENGLAND: 'ENG',
}

export function resolveFlagCode(code: string): FlagCode | undefined {
  const normalized = code.trim().toUpperCase()
  if (normalized in flagSources) {
    return normalized as FlagCode
  }
  return flagAliases[normalized]
}

export function isFlagCode(code: string): code is FlagCode {
  return resolveFlagCode(code) !== undefined
}

export function getFlagSrc(code: string): string | undefined {
  const resolved = resolveFlagCode(code)
  return resolved ? flagSources[resolved] : undefined
}

/** FIFA-style 3-letter abbreviations for display labels. */
export const flagAbbreviations: Record<FlagCode, string> = {
  BR: 'BRA',
  ES: 'ESP',
  DE: 'GER',
  PT: 'POR',
  NL: 'NED',
  AR: 'ARG',
  FR: 'FRA',
  UY: 'URU',
  MX: 'MEX',
  ENG: 'ENG',
  CA: 'CAN',
  MA: 'MAR',
  JP: 'JPN',
  RS: 'SRB',
  US: 'USA',
  BE: 'BEL',
  EG: 'EGY',
  NO: 'NOR',
  CH: 'SUI',
  CO: 'COL',
  PY: 'PAR',
}

export function getFlagAbbreviation(code: string): string {
  const resolved = resolveFlagCode(code)
  if (!resolved) return code.toUpperCase()
  return flagAbbreviations[resolved]
}
