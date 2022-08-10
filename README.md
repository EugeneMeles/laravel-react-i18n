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

> **Note:** this repo is a fork of [laravel-vue-i18n](https://github.com/xiCO2k/laravel-vue-i18n), renamed and port to React.

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

> If you want to see a screencast on how to setup check out this video: [How to use Laravel Vue i18n plugin](https://www.youtube.com/watch?v=ONRo8-i5Qsk).

### With Vite

```js
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { LaravelReactI18nProvider } from 'Modules/laraval-react-i18n'

const el = document.getElementById('app');

createRoot(el).render(
    <LaravelReactI18nProvider
      lang={'en'}
      fallbackLang={'pt'}
      resolve={async (lang) => {
        const langs = import.meta.glob('../../lang/*.json')
        return await langs[`../../lang/${lang}.json`]()
    }}>
      <App/>
    </LaravelReactI18nProvider>
)
```

#### SSR (Server Side Rendering)

For Server Side Rendering the resolve method should not receive a `Promise` and instead take advantage of the `globEager` method like this:

```js
createRoot(el).render(
    <LaravelReactI18nProvider
        lang={'en'}
        fallbackLang={'pt'}
        resolve={async (lang) => {
            const langs = import.meta.globEager('../../lang/*.json')
            return await langs[`../../lang/${lang}.json`]()
        }
    }>
        <App/>
    </LaravelReactI18nProvider>
)
```

#### PHP Translations Available on React

In order to load `php` translations, you can use this `Vite` plugin.

```js
// vite.config.js
import i18n from 'laravel-react-i18n/vite';

export default defineConfig({
    plugins: [
        laravel([
            'resources/css/app.css',
            'resources/js/app.js'
        ]),
        react(),

        // Laravel >= 9
        i18n(),

        // Laravel < 9, since the lang folder is inside the resources folder
        // you will need to pass as parameter:
        // i18n('resources/lang'),
    ],
});
```

> During the `npm run dev` execution time, the plugin will create some files like this `php_{lang}.json` on your lang folder.
> And to avoid that to be commited to your code base, I suggest to your `.gitignore` this like:

```bash
lang/php_*.json
```
### Usage

```jsx
import * as React from 'react'
import { useLaravelReactI18n } from 'laraval-react-i18n'

export default function App() {
    const { t, tChoice } = useLaravelReactI18n()

    
    return (
        <div>
            <h1>{ t('Welcome :name!', { name: 'Francisco' }) }.</h1>
            <div>Logged in { tChoice('{1} :count minute ago|[2,*] :count minutes ago', 10) }</div>
        </div>
    )
}

```

### Provider Options

- `lang` *(optional)*: If not provided it will try to find from the `<html lang="pt">` tag.
- `fallbackLang` *(optional)*: If the `lang` was not provided or is invalid, it will try reach for this `fallbackLang` instead, default is: `en`.
- `resolve` *(required)*: The way to reach your language files.
- `hideFirstLoad` *(optional)*: Hide first untranslate render (default: `true`).

```js
    <LaravelReactI18nProvider
      lang={'pt'}
      resolve={lang => import(`../../lang/${lang}.json`)}>
```

### `t(message: string, replacements: {})`

The `t()` method can translate a given message.

```js
// lang/pt.json
{
    "Welcome!": "Bem-vindo!",
    "Welcome, :name!": "Bem-vindo, :name!"
}

const { t } = useLaravelReactI18n()

t('Welcome!'); // Bem-vindo!
t('Welcome, :name!', { name: 'Francisco' }) // Bem-vindo Francisco!
t('Welcome, :NAME!', { name: 'Francisco' }) // Bem-vindo FRANCISCO!
```

### `tChoice(message: string, count: number, replacements: {})`

The `tChoice()` method can translate a given message based on a count,
there is also available an `trans_choice` alias, and a mixin called `$tChoice()`.

```js
// lang/pt.json
{
    "There is one apple|There are many apples": "Existe uma maça|Existe muitas maças",
    "{0} There are none|[1,19] There are some|[20,*] There are many": "Não tem|Tem algumas|Tem muitas",
    "{1} :count minute ago|[2,*] :count minutes ago": "{1} há :count minuto|[2,*] há :count minutos",
}

const { tChoice } = useLaravelReactI18n()

tChoice('There is one apple|There are many apples', 1); // Existe uma maça
tChoice('{0} There are none|[1,19] There are some|[20,*] There are many', 19); // Tem algumas
tChoice('{1} :count minute ago|[2,*] :count minutes ago', 10); // Há 10 minutos.
```
### `setLang(lang: string)`

The `setLang()` can be used to change the location during the runtime.

```jsx
const { t, setLang } = useLaravelReactI18n()

function handler() {
    setLang('pt')
}

return (
    <div>
        <h1>{t('auth.failed')}</h1>
        <button onClick={handler}>Set lang</button>
    </div>
)
```

### `getActiveLanguage()`

The `getActiveLanguage()` returns the language that is currently being used.

```jsx
const { getActiveLanguage } = useLaravelReactI18n()

getActiveLanguage(); // en
```

### `isLoaded(lang?: string)`

The `isLoaded()` method checks if the language is loaded.
If the `lang` parameter is not passed it will check for the actual language set.

```jsx
const { isLoaded } = useLaravelReactI18n()

isLoaded(); // true
isLoaded('fr'); // false
```
