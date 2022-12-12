import * as React from 'react'
import { Context } from './context'
import { I18nProviderProps } from './interfaces/i18n-provider-props'
import { LanguageInterface } from './interfaces/language'
import { LanguageJsonFileInterface } from './interfaces/language-json-file'
import { OptionsInterface } from './interfaces/options'
import { avoidExceptionOnPromise, avoidException } from './utils/avoid-exceptions'
import { hasPhpTranslations } from './utils/has-php-translations'
import { ReplacementsInterface } from './interfaces/replacements'
import { choose } from './pluralization'

const isServer = typeof window === 'undefined'

/**
 * The default options.
 */
const defaultOptions: OptionsInterface = {
  lang: !isServer && document.documentElement.lang ? document.documentElement.lang.replace('-', '_') : null,
  fallbackLang: 'en',
  resolve: (lang: string) => new Promise((resolve) => resolve({ default: {} }))
}

/**
 * Laravel React I18n Provider:
 */
export function LaravelReactI18nProvider({
  awaitLangLoad = isServer,
  children,
  ...currentOptions
}: I18nProviderProps): JSX.Element {
  const [options, setOptions] = React.useState<OptionsInterface>({ ...defaultOptions, ...currentOptions })
  const [loaded, setLoaded] = React.useState<LanguageInterface[]>([])
  const [activeMessages, setActiveMessages] = React.useState<object>({})

  React.useEffect(() => {
    if (isServer) {
      loadLanguage(options.lang || options.fallbackLang)
    } else {
      loadLanguageAsync(options.lang || options.fallbackLang)
    }
  }, [options.lang])

  /**
   * Checks if the language is loaded.
   */
  function isLoaded(lang?: string): boolean {
    lang ??= getActiveLanguage()

    return loaded.some((row) => row.lang.replace(/[-_]/g, '-') === lang.replace(/[-_]/g, '-'))
  }

  /**
   * Loads the language async.
   */
  function loadLanguage(lang: string, dashLangTry: boolean = false): void {
    const loadedLang: LanguageInterface = loaded.find((row) => row.lang === lang)

    if (loadedLang) {
      setLanguage(loadedLang)
      return
    }

    const { default: messages } = resolveLang(options.resolve, lang)

    applyLanguage(lang, messages, dashLangTry, loadLanguage)
  }

  /**
   * Set current language.
   */
  function setLang(lang) {
    setOptions({ ...options, lang })
  }

  /**
   * Loads the language file.
   */
  function loadLanguageAsync(lang: string, dashLangTry = false): Promise<string | void> {
    const loadedLang: LanguageInterface = loaded.find((row) => row.lang === lang)

    if (loadedLang) {
      return Promise.resolve(setLanguage(loadedLang))
    }

    return resolveLangAsync(options.resolve, lang).then(({ default: messages }) => {
      applyLanguage(lang, messages, dashLangTry, loadLanguageAsync)
    })
  }

  /**
   * Applies the language data and saves it to the loaded storage.
   */
  function applyLanguage(
    lang: string,
    messages: { [key: string]: string },
    dashLangTry: boolean = false,
    callable: Function
  ): string {
    if (Object.keys(messages).length < 1) {
      if (/[-_]/g.test(lang) && !dashLangTry) {
        return callable(
          lang.replace(/[-_]/g, (char) => (char === '-' ? '_' : '-')),
          true
        )
      }

      if (lang !== options.fallbackLang) {
        return callable(options.fallbackLang)
      }
    }

    const data: LanguageInterface = { lang, messages }
    setLoaded([data])

    return setLanguage(data)
  }

  /**
   * Get the translation for the given key.
   */
  function trans(key: string, replacements: ReplacementsInterface = {}): string {
    return wTrans(key, replacements)
  }

  /**
   * Get the translation for the given key and watch for any changes.
   */
  function wTrans(key: string, replacements: ReplacementsInterface = {}): string {
    key = key.replace(/\//g, '.')

    if (!activeMessages[key]) {
      activeMessages[key] = key
    }

    return makeReplacements(activeMessages[key], replacements)
  }

  /**
   * Translates the given message based on a count.
   */
  function transChoice(key: string, number: number, replacements: ReplacementsInterface = {}): string {
    return wTransChoice(key, number, replacements)
  }

  /**
   * Translates the given message based on a count and watch for changes.
   */
  function wTransChoice(key: string, number: number, replacements: ReplacementsInterface = {}): string {
    const message = wTrans(key, replacements)

    replacements.count = number.toString()

    return makeReplacements(choose(message, number, options.lang), replacements)
  }

  /**
   * Returns the current active language.
   */
  function getActiveLanguage(): string {
    return options.lang || options.fallbackLang
  }

  /**
   * Sets the language messages to the activeMessages.
   */
  function setLanguage({ lang, messages }: LanguageInterface): string {
    if (!isServer) {
      // When setting the HTML lang attribute, hyphen must be use instead of underscore.
      document.documentElement.setAttribute('lang', lang.replace('_', '-'))
    }

    setOptions({ ...options, lang })

    const am = {}
    for (const [key, value] of Object.entries(messages)) {
      am[key] = value
      setActiveMessages({ ...activeMessages, ...am })
    }

    for (const [key] of Object.entries(am)) {
      if (!messages[key]) {
        setActiveMessages({ ...activeMessages, [key]: null })
      }
    }

    return lang
  }

  /**
   * It resolves the language file or data, from direct data, syncrone.
   */
  function resolveLang(
    callable: Function,
    lang: string,
    data: { [key: string]: string } = {}
  ): LanguageJsonFileInterface {
    if (!Object.keys(data).length) {
      data = avoidException(callable, lang)
    }

    if (hasPhpTranslations(isServer)) {
      return {
        default: {
          ...data,
          ...avoidException(callable, `php_${lang}`)
        }
      }
    }

    return { default: data }
  }

  /**
   * It resolves the language file or data, from direct data, require or Promise.
   */
  async function resolveLangAsync(callable: Function, lang: string): Promise<LanguageJsonFileInterface> {
    let data = avoidException(callable, lang)

    if (!(data instanceof Promise)) {
      return resolveLang(callable, lang, data)
    }

    if (hasPhpTranslations(isServer)) {
      const phpLang = await avoidExceptionOnPromise(callable(`php_${lang}`))
      const jsonLang = await avoidExceptionOnPromise(data)

      return new Promise((resolve) =>
        resolve({
          default: {
            ...phpLang,
            ...jsonLang
          }
        })
      )
    }

    return new Promise(async (resolve) =>
      resolve({
        default: await avoidExceptionOnPromise(data)
      })
    )
  }

  /**
   * Make the place-holder replacements on a line.
   */
  function makeReplacements(message: string, replacements?: ReplacementsInterface): string {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

    Object.entries(replacements || []).forEach(([key, value]) => {
      value = value.toString()

      message = message
        .replace(`:${key}`, value)
        .replace(`:${key.toUpperCase()}`, value.toUpperCase())
        .replace(`:${capitalize(key)}`, capitalize(value))
    })

    return message
  }

  if (awaitLangLoad && !isLoaded(options?.lang)) {
    return React.createElement(React.Fragment)
  }

  return React.createElement(
    Context.Provider,
    {
      value: {
        t: trans,
        tChoice: transChoice,
        getActiveLanguage,
        isLoaded,
        setLang
      }
    },
    children
  )
}
