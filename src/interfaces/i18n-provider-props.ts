import * as React from 'react'
import { OptionsInterface } from './options'

export interface I18nProviderProps extends OptionsInterface {
  children?: React.ReactNode
  awaitLangLoad?: boolean
}
