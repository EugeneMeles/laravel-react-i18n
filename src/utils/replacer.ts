import ReplacementsInterface from '../interfaces/replacements';

/**
 * Make the place-holder replacements on a line.
 *
 * @param message
 * @param replacements
 */
export default function replacer(message: string, replacements?: ReplacementsInterface): string {
  if (!replacements) return message;

  const patterns = Object.entries(replacements).flatMap(([key, value]) => [
    { pattern: new RegExp(`:${key}`, 'g'), replacement: value.toString() },
    { pattern: new RegExp(`:${key.toUpperCase()}`, 'g'), replacement: value.toString().toUpperCase() },
    { pattern: new RegExp(`:${capitalize(key)}`, 'g'), replacement: capitalize(value.toString()) }
  ]);

  return patterns.reduce((result, { pattern, replacement }) => result.replace(pattern, replacement), message);
}

/**
 * Capitalizing string.
 *
 * @param str
 */
function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}
