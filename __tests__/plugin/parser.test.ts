import { mock } from '../jest-setup';
import parser from '../../src/plugin/parser';

const result = [
  {
    basename: 'php_en.json',
    path: `${mock('lang')}/php_en.json`
  },
  {
    basename: 'php_fr.json',
    path: `${mock('lang')}/php_fr.json`
  },
  {
    basename: 'php_it.json',
    path: `${mock('lang')}/php_it.json`
  }
];

describe('parser', () => {
  it.each([
    [mock('lang'), result],
    [mock('langError'), []]
  ])('parse php-file', (dirname, expected) => {
    expect(parser(dirname)).toMatchObject(expected);
  });
});
