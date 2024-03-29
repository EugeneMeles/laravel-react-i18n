import ReplacementsInterface from '../interfaces/replacements';

/**
 * Make the place-holder replacements on a line.
 *
 * @param message
 * @param replacements
 */
export default function replacer(message: string, replacements?: ReplacementsInterface): string {
  Object.entries(replacements || []).forEach(([key, value]) => {
    message = message
      .replaceAll(`:${key}`, value.toString())
      .replaceAll(`:${key.toUpperCase()}`, value.toString().toUpperCase())
      .replaceAll(`:${capitalize(key)}`, capitalize(value.toString()));
  });

  return message;
}

/**
 * Capitalizing string.
 *
 * @param str
 */
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
