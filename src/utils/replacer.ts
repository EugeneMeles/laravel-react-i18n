import ReplacementsInterface from '../interfaces/replacements';
import { isValidElement, ReactNode } from 'react';

/**
 * Make the place-holder replacements on a line.
 *
 * @param message
 * @param replacements
 */
export default function replacer(message: string, replacements?: ReplacementsInterface): ReactNode[] {
  if (!replacements) return [message];

  const keys = Object.keys(replacements);
  const lowerLabels = keys.map((key) => key.toLowerCase());
  const regex = new RegExp(`(:${keys.join('|:')})`, 'gi');

  return message
    .split(regex)
    .filter(Boolean)
    .map((seg) => {
      if (!seg.startsWith(':')) return seg;

      const s = seg;
      const label = s.slice(1);
      const lowerLabel = label.toLowerCase();

      if (!lowerLabels.includes(lowerLabel)) return seg;

      if (replacements[label]) return replacements[label];

      const replacement = replacements[lowerLabel];
      if (!replacement) return seg;

      if (isValidElement(replacement)) return replacement;

      if (label === label.toUpperCase()) return replacement.toString().toUpperCase();

      if (label[0] === label[0].toUpperCase()) return capitalize(replacement.toString());

      return replacement.toString();
    });
}

/**
 * Capitalizing string.
 *
 * @param str
 */
function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}
