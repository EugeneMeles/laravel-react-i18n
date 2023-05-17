import replacer from '../../src/utils/replacer';

it.each([
  ['some text', ':replace', 'some text'],
  ['some  text', ':replace', 'some  text'],
  [' some text ', ' :replace ', 'some text'],
  [' some text ', ':replace', ' some text '],
  ['\nsome text', '\n:replace', 'some text'],
  ['some\ntext', ':replace', 'some\ntext'],

  ['"some text"', '":replace"', 'some text'],
  ['<div>some text</div>', '<div>:replace</div>', 'some text'],

  ['some text', ':replace', 'some text'],
  ['Some text', ':Replace', 'some text'],
  ['SOME TEXT', ':REPLACE', 'some text'],

  ['Lorem Ipsum some text', 'Lorem Ipsum :replace', 'some text'],
  ['some text Lorem Ipsum', ':replace Lorem Ipsum', 'some text'],
  ['Lorem Ipsum some text Lorem Ipsum', 'Lorem Ipsum :replace Lorem Ipsum', 'some text'],

  ['some text some text', ':replace :replace', 'some text'],
  [':anyReplace', ':anyReplace', 'some text']
])('replacer', (expected, message, replace) => {
  expect(replacer(message, { replace })).toBe(expected);
});

test('Sentence replace', () => {
  const expected =
    'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

  const message =
    'It has survived not only :count centuries, but also the leap into :epochType typesetting, remaining :remaining unchanged.';

  const replacements = { count: 'five', epochType: 'electronic', remaining: 'essentially' };

  expect(replacer(message, replacements)).toBe(expected);
});
