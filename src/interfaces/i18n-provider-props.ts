import { ReactNode } from 'react';

import OptionsInterface from './options';

/**
 *
 */
export default interface I18nProviderProps extends OptionsInterface {
  children: ReactNode;
  ssr?: boolean;
}
