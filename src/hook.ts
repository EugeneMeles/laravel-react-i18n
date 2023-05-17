import { useContext } from 'react';

import { Context } from './context';

import ContextInterface from './interfaces/context';

export default function useLaravelReactI18n<T extends string = string>() {
  return useContext<ContextInterface<T>>(Context);
}
