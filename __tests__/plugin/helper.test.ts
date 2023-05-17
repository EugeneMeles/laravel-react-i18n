import path from 'path';
import { dirnameSanitize } from '../../src/plugin/helper';

const { sep } = path;

describe('helper', () => {
  it.each([
    ['/laravel/lang/', `${sep}laravel${sep}lang${sep}`],
    ['/laravel/lang', `${sep}laravel${sep}lang${sep}`],
    ['/laravel/lang//', `${sep}laravel${sep}lang${sep}`],
    ['/laravel/lang/sub', `${sep}laravel${sep}lang${sep}sub${sep}`],

    ['\\laravel\\lang\\', `${sep}laravel${sep}lang${sep}`],
    ['\\laravel\\lang', `${sep}laravel${sep}lang${sep}`],
    ['\\laravel\\lang\\\\', `${sep}laravel${sep}lang${sep}`],
    ['\\laravel\\lang\\sub', `${sep}laravel${sep}lang${sep}sub${sep}`]
  ])('dirnameSanitize', (rawDirname, expected) => {
    expect(dirnameSanitize(rawDirname)).toEqual(expected);
  });
});
