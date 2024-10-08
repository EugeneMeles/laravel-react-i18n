/**
 *
 * @param files
 */
export default function recognizer(files: Record<string, unknown> | Record<string, () => Promise<unknown>>) {
  const jsonLocales = new Set<string>();
  const phpLocales = new Set<string>();
  const jsonFileLocales: Record<string, string> = {};
  const phpFileLocales: Record<string, string> = {};

  Object.keys(files).forEach((file) => {
    const match = file.match(/.*\/(php_)?(.*)\.json$/);
    if (match) {
      const [, isPhp, locale] = match;

      if (isPhp) {
        phpLocales.add(locale);
        phpFileLocales[locale] = file;
      } else {
        jsonLocales.add(locale);
        jsonFileLocales[locale] = file;
      }
    }
  });

  const locales = Array.from(new Set([...jsonLocales, ...phpLocales])).sort();

  return {
    isLocale: (locale: string): boolean => locales.includes(locale),
    getLocales: () => locales,
    isJsonLocale: (locale: string): boolean => jsonLocales.has(locale),
    getJsonLocales: () => Array.from(jsonLocales).sort(),
    isPhpLocale: (locale: string): boolean => phpLocales.has(locale),
    getPhpLocales: () => Array.from(phpLocales).sort(),
    getJsonFile: (locale: string): string => jsonFileLocales[locale],
    getPhpFile: (locale: string): string => phpFileLocales[locale]
  };
}
