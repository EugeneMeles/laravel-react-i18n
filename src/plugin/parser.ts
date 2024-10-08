import fs from 'fs';
import path from 'path';
import { fromString } from 'php-array-reader';

import { dirnameSanitize } from './helper';

/**
 *
 * Parse array of PHP file.
 *
 * @param dirname
 */
export default function parser(dirname: string): { path: string; basename: string }[] {
  const sanitizedDirname = dirnameSanitize(dirname);

  if (!fs.existsSync(sanitizedDirname)) {
    return [];
  }

  return fs
    .readdirSync(sanitizedDirname)
    .filter((locale) => fs.statSync(path.join(sanitizedDirname, locale)).isDirectory())
    .sort()
    .map((locale) => {
      const translations = convertToDottedKey(getObjectTranslation(path.join(sanitizedDirname, locale)));
      return { locale, trans: translations };
    })
    .filter(({ trans }) => Object.keys(trans).length > 0)
    .map(({ locale, trans }) => {
      const basename = `php_${locale}.json`;
      fs.writeFileSync(path.join(sanitizedDirname, basename), JSON.stringify(trans));

      return { basename, path: path.join(sanitizedDirname, basename) };
    });
}

/**
 *
 * @param source
 * @param target
 * @param keys
 */
function convertToDottedKey(
  source: Record<string, unknown>,
  target: Record<string, string> = {},
  keys: string[] = []
): Record<string, string> {
  Object.entries(source).forEach(([key, value]) => {
    const newPrefix = [...keys, key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      convertToDottedKey(value as Record<string, unknown>, target, newPrefix);
    } else {
      target[newPrefix.join('.')] = value as string;
    }
  });

  return target;
}

/**
 *
 * @param dirname
 */
function getObjectTranslation(dirname: string): Record<string, unknown> {
  const translations: Record<string, unknown> = {};

  fs.readdirSync(dirname).forEach((basename) => {
    const absoluteFile = path.join(dirname, basename);
    const key = basename.replace(/\.\w+$/, '');

    if (fs.statSync(absoluteFile).isDirectory()) {
      translations[key] = getObjectTranslation(absoluteFile);
    } else {
      const fileContent = fs.readFileSync(absoluteFile, 'utf-8');
      translations[key] = fromString(fileContent);
    }
  });

  return translations;
}
