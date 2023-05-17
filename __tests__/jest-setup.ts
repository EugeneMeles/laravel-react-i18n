import '@testing-library/jest-dom';
import fs from 'fs';
import { resolve } from 'path';
import locale from '../src/plugin/locale';
import parser from '../src/plugin/parser';

const clientFile: any = {};
const serverFile: any = {};

let files: { path: string; basename: string }[] = [];

const mock = (dirName: string) => resolve(`./__tests__/__mocks__/${dirName}`);

beforeAll(() => {
  const dirName = mock('lang');
  const phpLocales = locale.getPhpLocale(dirName);

  if (phpLocales.length > 0) {
    files = parser(dirName);
  }

  fs.readdirSync(dirName)
    .filter((basename) => !fs.statSync(dirName + '/' + basename).isDirectory() && basename.endsWith('.json'))
    .map((file) => {
      const path = dirName + '/' + file;
      clientFile[path] = import(path);
      serverFile[path] = require(path);
    });
});

export { clientFile, serverFile, mock };
