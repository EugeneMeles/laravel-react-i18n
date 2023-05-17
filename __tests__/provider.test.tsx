import React from 'react';
import ReplacementsInterface from '../src/interfaces/replacements';

const locales = ['de', 'en', 'fr', 'it', 'nl', 'uk'];

const tHookCases: [string, undefined | ReplacementsInterface, string | []][] = [
  ['130 Days', undefined, '130 Days'],
  [':amount Total', { amount: 'ten' }, 'Ten Total'],
  [':amount Total', { amount: 12 }, '12 Total'],
  ['Accept Invitation', undefined, 'Accept Invitation'],

  ['validation.accepted', { attribute: 'your' }, 'The your field must be accepted.'],
  ['validation.accepted', undefined, 'The :attribute field must be accepted.'],
  [
    'validation.between.array',
    { attribute: '"my custom"', min: 1, max: 10 },
    'The "my custom" field must have between 1 and 10 items.'
  ],
  ['validation.between.array', undefined, 'The :attribute field must have between :min and :max items.'],
  ['validation.custom.attribute-name.rule-name', undefined, 'custom-message'],
  ['validation.attributes', undefined, []],

  ['custom.Welcome', undefined, 'Welcome'],
  ['custom.sub_level1.text', undefined, "I'm sub level 1"],
  ['custom.sub_level1.sub_level2.text', undefined, "I'm sub level 2"],
  ['custom.sub_level1.sub_level2.sub_level3.text', undefined, "I'm sub level 3"],
  ['custom.sub_level1.sub_level2.sub_level3.sub_level4.text', undefined, "I'm sub level 4"]
];

const tChoiceHookCases: [string, number, undefined | ReplacementsInterface, string][] = [
  ['custom.apple_count', 1, undefined, '1 apple'],
  ['custom.apple_count', 10, undefined, '10 apples'],
  ['custom.min_ago', 1, undefined, '1 minute ago'],
  ['custom.min_ago', 4, undefined, '4 minutes ago'],
  ['custom.min_left_for_reason', 1, undefined, '1 minute left for :reason'],
  ['custom.min_left_for_reason', 1, { reason: 'auto logout' }, '1 minute left for auto logout'],
  ['custom.min_left_for_reason', 15, { reason: 'auto logout' }, '15 minutes left for auto logout']
];

test.todo('provider testing');
