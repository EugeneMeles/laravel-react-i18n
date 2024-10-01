import { getPluralIndex } from '../contrib/get-plural-index';

/**
 * Select a proper translation string based on the given number.
 *
 * @param message
 * @param number
 * @param locale
 */
export default function pluralization(message: string, number: number, locale: string): string {
  let segments = message.split('|');
  const extracted = extract(segments, number);

  if (extracted !== null) {
    return extracted.trim();
  }

  segments = stripConditions(segments);
  const pluralIndex = getPluralIndex(locale, number);

  return segments.length === 1 || !segments[pluralIndex] ? segments[0] : segments[pluralIndex];
}

/**
 * Extract a translation string using inline conditions.
 *
 * @param segments
 * @param number
 */
function extract(segments: string[], number: number): string | null {
  let result: string | null = null;

  segments.forEach((segment) => {
    if (result !== null) return;
    result = extractFromString(segment, number);
  });

  return result;
}

/**
 * Get the translation string if the condition matches.
 *
 * @param part
 * @param number
 */
function extractFromString(part: string, number: number): string | null {
  const matches = part.match(/^[{[]([^,{}\[\]]*),?([^{}\[\]]*)[}\]]([\s\S]*)/);

  if (!matches) return null;

  const [, from, to, value] = matches;

  if ((from === '*' || number >= parseFloat(from)) && (to === '*' || number <= parseFloat(to))) {
    return value;
  }

  return from && parseFloat(from) === number ? value : null;
}

/**
 * Strip the inline conditions from each segment, just leaving the text.
 *
 * @param segments
 */
function stripConditions(segments: string[]): string[] {
  return segments.map((part) => part.replace(/^[{[]([^[\]{}]*)[}\]]/, ''));
}
