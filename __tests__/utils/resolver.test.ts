import { clientFile, serverFile } from '../jest-setup';
import resolver from '../../src/utils/resolver';

const results = {
  en: {
    json: {
      '30 Days': '30 Days',
      ':amount Total': ':Amount Total',
      'Accept Invitation': 'Accept Invitation'
    },
    php: {
      'auth.failed': 'These credentials do not match our records.',
      'auth.password': 'The provided password is incorrect.',
      'auth.throttle': 'Too many login attempts. Please try again in :seconds seconds.',
      'custom.Welcome': 'Welcome',
      'custom.apple_count': ':count apple|:count apples',
      'custom.min_ago': ':count minute ago|:count minutes ago',
      'custom.sub_level1.text': "I'm sub level 1",
      'custom.sub_level1.sub_level2.text': "I'm sub level 2",
      'custom.sub_level1.sub_level2.sub_level3.text': "I'm sub level 3",
      'custom.sub_level1.sub_level2.sub_level3.sub_level4.text': "I'm sub level 4",
      'validation.accepted': 'The :attribute field must be accepted.',
      'validation.between.array': 'The :attribute field must have between :min and :max items.',
      'validation.custom.attribute-name.rule-name': 'custom-message',
      'validation.attributes': []
    }
  },
  uk: {
    json: {
      '30 Days': '30 днів',
      ':amount Total': 'Всього :amount',
      Action: 'Дія'
    },
    php: {}
  },
  it: {
    json: {},
    php: {
      'auth.failed': 'Credenziali non valide.',
      'auth.password': 'La password non è valida.',
      'auth.throttle': 'Troppi tentativi di accesso. Riprova tra :seconds secondi.'
    }
  }
};

describe('resolver', () => {
  // let clientFile: any;
  // let serverFile: any;
  //
  // beforeAll(() => {
  //   clientFile = import.meta.glob('../__mocks__/lang/*.json');
  //   serverFile = import.meta.globEager('../__mocks__/lang/*.json');
  // });

  it.each([
    ['en', results.en.json, results.en.php],
    ['uk', results.uk.json, results.uk.php],
    ['it', results.it.json, results.it.php],
    ['ro', {}, {}],
    ['error', {}, {}]
  ])('client', async (locale, resultJson, resultPhp) => {
    const promises = resolver(clientFile, locale);
    const [responseJson, responsePhp] = await Promise.all(promises);

    expect(responseJson.default).toMatchObject(resultJson);
    expect(responsePhp.default).toMatchObject(resultPhp);
  });

  it.each([
    ['en', results.en.json, results.en.php],
    ['uk', results.uk.json, results.uk.php],
    ['it', results.it.json, results.it.php],
    ['ro', {}, {}],
    ['error', {}, {}]
  ])('client', async (locale, resultJson, resultPhp) => {
    const responses = resolver(serverFile, locale);
    const [responseJson, responsePhp] = responses;

    expect(responseJson.default).toMatchObject(resultJson);
    expect(responsePhp.default).toMatchObject(resultPhp);
  });
});
