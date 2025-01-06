import React from "react"
import replacer from '../../src/utils/replacer';

it.each([
  [['some text'], ':replace', 'some text'],
  [['some  text'], ':replace', 'some  text'],
  [[' ', 'some text', ' '], ' :replace ', 'some text'],
  [['some text'], ':replace', 'some text'],
  [['\n', 'some text'], '\n:replace', 'some text'],
  [['some text'], ':replace', 'some text'],

  [['"', 'some text', '"'], '":replace"', 'some text'],
  [['<div>', 'some text', '</div>'], '<div>:replace</div>', 'some text'],

  [['some text'], ':replace', 'some text'],
  [['Some text'], ':Replace', 'some text'],
  [['SOME TEXT'], ':REPLACE', 'some text'],

  [['Lorem Ipsum ', 'some text'], 'Lorem Ipsum :replace', 'some text'],
  [['some text', ' Lorem Ipsum'], ':replace Lorem Ipsum', 'some text'],
  [['Lorem Ipsum ', 'some text', ' Lorem Ipsum'], 'Lorem Ipsum :replace Lorem Ipsum', 'some text'],

  [['some text', ' ', 'some text'], ':replace :replace', 'some text'],
  [[':anyReplace'], ':anyReplace', 'some text']
])('replacer', (expected, message, replace) => {
  expect(replacer(message, { replace })).toStrictEqual(expected);
});

test('Sentence replace', () => {
  const expected = [
    'It has survived not only ',
    'five', // count
    ' centuries, but also the leap into ',
    'electronic', // epocheType
    ' typesetting, remaining ',
    'essentially', // remaining
    ' unchanged.'
  ];

  const message = 'It has survived not only :count centuries, but also the leap into :epochType typesetting, remaining :remaining unchanged.';

  const replacements = { count: 'five', epochType: 'electronic', remaining: 'essentially' };

  expect(replacer(message, replacements)).toStrictEqual(expected);
});

test('Components replace', () => {
  const linkElement = React.createElement('a', { href: 'https://example.com', key: 'link' }, 'here');
  const boldElement = React.createElement('b', { key: 'bold' }, 'important');

  const expected = [
    'Click ',
    linkElement,
    ' to visit our website. This is ',
    boldElement,
    '.'
  ];

  const message = 'Click :link to visit our website. This is :bold.';

  const replacements = {
    link: linkElement,
    bold: boldElement
  };

  expect(replacer(message, replacements)).toStrictEqual(expected);
});
