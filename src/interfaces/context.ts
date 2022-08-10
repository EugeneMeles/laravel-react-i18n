import { ReplacementsInterface } from './replacements'

export interface ContextInterface {
  t?: (key: string, replacements?: ReplacementsInterface) => string
  tChoice?: (key: string, number: number, replacements?: ReplacementsInterface) => string
  setLang?: (lang: string) => void
  isLoaded?: (lang?: string) => boolean
  getActiveLanguage?: () => string
}
