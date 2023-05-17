import { createContext } from 'react';

import ContextInterface from './interfaces/context';

export const Context = createContext<ContextInterface>({
  t: (key) => '',
  tChoice: (key) => '',
  currentLocale: () => '',
  getLocales: () => [''],
  isLocale: (locale) => true,
  loading: true,
  setLocale: (locale) => {}
});
