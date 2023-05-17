<h1 align="center" style="border:none !important">
    Laravel React i18n
</h1>

<p align="center">
    <a href="https://github.com/EugeneMeles/laravel-react-i18n/actions"><img alt="GitHub Workflow Status (master)" src="https://img.shields.io/github/workflow/status/EugeneMeles/laravel-react-i18n/Tests/main"></a>
    <a href="https://www.npmjs.com/package/laravel-react-i18n"><img alt="License" src="https://img.shields.io/npm/l/laravel-react-i18n.svg?sanitize=true"></a>
    <a href="https://www.npmjs.com/package/laravel-react-i18n"><img alt="Version" src="https://img.shields.io/npm/v/laravel-react-i18n.svg"></a>
    <a href="https://www.npmjs.com/package/laravel-react-i18n"><img alt="Total Downloads" src="https://img.shields.io/npm/dt/laravel-react-i18n.svg"></a>
</p>

<p align="center">
    <b>laravel-react-i18n</b> is a <b>React</b> plugin that allows to connect your <b>Laravel</b> Framework translation
    files with <b>React</b>. It uses the same logic used on <a href="https://laravel.com/docs/8.x/localization">Laravel Localization</a>.
</p>

## Requirements
- Laravel >= 9
- Vite

## Installation

With [npm](https://www.npmjs.com):
```sh
npm i laravel-react-i18n
```

or with [yarn](https://yarnpkg.com):
```sh
yarn add laravel-react-i18n
```

## Setup


#### CSR (Client Side Rendering)

`app.tsx:`

```tsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <LaravelReactI18nProvider
        locale={'uk'}
        fallbackLocale={'en'}
        files={import.meta.glob('/lang/*.json')}
      >
        <App {...props} />
      </LaravelReactI18nProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});

```

#### SSR (Server Side Rendering)

`ssr.tsx:`

```tsx
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import route from '../../vendor/tightenco/ziggy/dist/index.m';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

const appName = 'Laravel';

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup: ({ App, props }) => {
      global.route = (name, params, absolute) =>
        route(name, params, absolute, {
          // @ts-expect-error
          ...page.props.ziggy,
          // @ts-expect-error
          location: new URL(page.props.ziggy.location),
        });

      return (
        <LaravelReactI18nProvider
          locale={'uk'}
          fallbackLocale={'en'}
          files={import.meta.glob('/lang/*.json', { eager: true })}
        >
          <App {...props} />
        </LaravelReactI18nProvider>
      );
    },
  })
);

```

#### PHP Translations Available on React

In order to load `php` translations, you can use this `Vite` plugin.

`vite.config.js:`

```js
import i18n from 'laravel-react-i18n/vite'; // <-- add this

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css',
            'resources/js/app.js'
        ]),
        react(),
        i18n(), // <-- add this
    ],
});
```

> During the `npm run dev` execution time, the plugin will create some files like this `php_{lang}.json` on your lang folder.
> And to avoid that to be commited to your code base, I suggest to your `.gitignore` this like:

```
lang/php_*.json
```

## Usage


### Provider Options

- `locale` *(optional)*: If not provided it will try to find from the `<html lang="">` tag or set `en`.
- `fallbackLocale` *(optional)*: If the `locale` was not provided or is invalid, it will try reach for this `fallbackLocale` instead, default it will try to find from the `<html lang="">` tag or set `en`.
- `files` *(required)*: The way to reach your language files.

```js
<LaravelReactI18nProvider
  locale={'ro'}
  files={import.meta.glob('/lang/*.json')}
>
...
``` 

### Hook Response:
```tsx
...
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function Component() {
    const { t, tChoice, currentLocale, setLocale, getLocales, isLocale, loading } = useLaravelReactI18n();
    ...
}

```

### `t(key: string, replacements?: {[key: string]: string | number})`

The `t()` method can translate a given message.

`lang/pt.json:`
```json
{
    "Welcome!": "Bem-vindo!",
    "Welcome, :name!": "Bem-vindo, :name!"
}
```

`welcome.tsx:`
```tsx
...
const { t } = useLaravelReactI18n();

t('Welcome!'); // Bem-vindo!
t('Welcome, :name!', { name: 'Francisco' }); // Bem-vindo Francisco!
t('Welcome, :NAME!', { name: 'Francisco' }); // Bem-vindo FRANCISCO!
t('Some untranslated'); // Some untranslated
...
```

### `tChoice(key: string, count: number, replacements?: {[key: string]: string | number})`

The `tChoice()` method can translate a given message based on a count,
there is also available an `trans_choice` alias, and a mixin called `$tChoice()`.

`lang/pt.json:`
```json
{
  "There is one apple|There are many apples": "Existe uma maça|Existe muitas maças",
  "{0} There are none|[1,19] There are some|[20,*] There are many": "Não tem|Tem algumas|Tem muitas",
  "{1} :count minute ago|[2,*] :count minutes ago": "{1} há :count minuto|[2,*] há :count minutos",
}
```

`choice.tsx:`
```tsx
...
const { tChoice } = useLaravelReactI18n()

tChoice('There is one apple|There are many apples', 1); // Existe uma maça
tChoice('{0} There are none|[1,19] There are some|[20,*] There are many', 19); // Tem algumas
tChoice('{1} :count minute ago|[2,*] :count minutes ago', 10); // Há 10 minutos.
...
```

### `currentLocale()`

The `currentLocale()` returns the locale that is currently being used.

```tsx
const { currentLocale } = useLaravelReactI18n()

currentLocale(); // en
```

### `setLocale(locale: string)`

The `setLocale()` can be used to change the locale during the runtime.

```tsx
const { currentLocale, setLocale } = useLaravelReactI18n();

function handler() {
    setLocale('it')
}

return (
    <div>
        <h1>Current locale: `{currentLocale()}`</h1>
        <button onClick={handler}>Change locale to `it`</button>
    </div>
)
```

### `getLocales()`

The `getLocales()` return string array with all locales available in folder `/lang/*`.

```text
/lang/..
  de.json
  en.json
  nl.json
  uk.json
```

`myLocales.tsx:`
```tsx
const { getLocales } = useLaravelReactI18n();

getLocales(); // ['de', 'en', 'nl', 'uk']
```

### `isLocale(locale: string)`

The `isLocale()` method checks the locale is available in folder `/lang/*`.

```tsx
const { isLocale } = useLaravelReactI18n();

isLocale('uk'); // true
isLocale('fr'); // false
```

### `loading`

The `loading` show current loading state, only on client side where you change the locale.

```tsx
const { loading, setLocale } = useLaravelReactI18n();

function handler() {
    setLocale('it')
}

if (loading) return <p>Loading...</p>;

return (
    <div>
        <h1>Current locale: `{currentLocale()}`</h1>
        <button onClick={handler}>Change locale to `it`</button>
    </div>
)
```
