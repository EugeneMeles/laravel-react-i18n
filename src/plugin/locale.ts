import fs from 'fs';
import path from 'path';

import { dirnameSanitize } from './helper';

export default {
  /**
   *
   * @param dirname
   */
  getJsonLocale: (dirname: string): string[] => {
    const sanitizedDirname = dirnameSanitize(dirname);

    if (!fs.existsSync(sanitizedDirname)) {
      return [];
    }

    return fs
      .readdirSync(sanitizedDirname)
      .filter((basename) => {
        const fullPath = path.join(sanitizedDirname, basename);
        return fs.statSync(fullPath).isFile() && !basename.startsWith('php_');
      })
      .map((basename) => basename.replace(/\.json$/, ''))
      .sort();
  },

  /**
   *
   * @param dirname
   */
  getPhpLocale: (dirname: string): string[] => {
    const sanitizedDirname = dirnameSanitize(dirname);

    if (!fs.existsSync(sanitizedDirname)) {
      return [];
    }

    return fs
      .readdirSync(sanitizedDirname)
      .filter((folder) => {
        const fullPath = path.join(sanitizedDirname, folder);
        return fs.statSync(fullPath).isDirectory();
      })
      .filter((folder) => {
        const phpFiles = fs.readdirSync(path.join(sanitizedDirname, folder));
        return phpFiles.some((basename) => /\.php$/.test(basename));
      })
      .sort();
  }
};
