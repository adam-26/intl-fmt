Intl Fmt
==========

This library provides an API to format dates, numbers, strings, and pluralization using ICU message format supporting tags.

[![npm](https://img.shields.io/npm/v/intl-fmt.svg)](https://www.npmjs.com/package/intl-fmt)
[![npm](https://img.shields.io/npm/dm/intl-fmt.svg)](https://www.npmjs.com/package/intl-fmt)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/intl-format/master.svg)](https://circleci.com/gh/adam-26/intl-format/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ba110ff64db325dd9e65/maintainability)](https://codeclimate.com/github/adam-26/intl-format/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ba110ff64db325dd9e65/test_coverage)](https://codeclimate.com/github/adam-26/intl-format/test_coverage)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> This is a fork of [react-intl](https://github.com/yahoo/react-intl).

> It uses the same well tested code to expose an internationalization API **without any React dependencies**

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 150+ languages.
- Runs in the browser and Node.js.
- Built on standards.
- Extended to support `Tags`

> This supports the [ICU message translation format, read more about it here](https://formatjs.io/guides/message-syntax/).

> **Tags are not part of the ICU message standard**.

_Differences_ from the original package include:
 * **No React dependency** - want to use `Tags` with React? See [react-intl-fmt](https://github.com/adam-26/react-intl-format), a drop-in replacement for [react-intl](https://github.com/yahoo/react-intl)
 * As well as supporting ICU messages, this package also supports the use of `tags` in translations. [Whats a tag?](#whatsatag)

### Whats a Tag?

A `tag` enables style _placeholders_ to be included in a translation message _without_ including any of the
style information in the translation message. Named tags can be used to provide hints about context to translators.

Tags can be used in combination with all ICU message features. Heres a quick example:

```js
import IntlFmt from 'intl-fmt';

const fmt = new IntlFmt();
const msgDescriptor = {
  id: 'demo',
  defaultMessage: 'Agree to our <x:link>terms and conditions</x:link>?'
};

const formattedMsg = fmt.message(msgDescriptor, {
  link: text => <a href='#'>{text}</a>
});

console.log(formattedMsg); // Agree to our <a href='#'>terms and conditions</a>?
```

[Read more about tags here](#tags).

Overview
--------

**Intl Fmt uses packages that are forked form [FormatJS](https://formatjs.io/).**

Intl Fmt extends the FormatJS packages to include support for `tags`.

### Original Documentation

The **original React Intl's docs** are in the [GitHub repo's Wiki Documentation](https://github.com/yahoo/react-intl/wiki/API).

The [original documentation](https://github.com/yahoo/react-intl/wiki) includes all the information you need for importing _locale data_ and the `Intl` polyfill.

The API for the the `format*` methods is almost identical. Method names have been shortened by removing the `format` prefix from each method.
See the original documentation for more detailed API information.

### Usage

You must create an _instance_ of `IntlFmt`.

```js
import IntlFmt from 'intl-fmt';
import englishMessages from './translations/en/json';

const locale = 'en';
const fmtOpts = {
  messages: englishMessages
  // set other options here
};

const fmt = new IntlFmt(locale, fmtOpts);
```

### Package Exports
 * `default`: IntlFormatter - the main class used for formatting localized values
 * `Formatter`: IntlFormatter - a named instance of the `default` export, to make browser usage easier
 * `addLocaleData: function`: Used to add additional locale data into the current environment
 * `defineMessages: function`: A utility method for provide a hook to babel plugins to messages at build time


### Locale Data

You _may_ need to [polyfill NodeJS](https://formatjs.io/guides/runtime-environments/#server) or
[polyfill the browser](https://formatjs.io/guides/runtime-environments/#client) environment for
intl-fmt to work correctly.

To use _intl-fmt_ you'll likely need to [load locale data into your Node or browser environment](https://github.com/yahoo/react-intl/wiki#loading-locale-data).
I recommend reading [the original documentation for configuring your environment]() and use that as a reference for the example below.

As you can see below, loading locale data is the same as before - you just import from `intl-fmt` instead of `react-intl`.

```js
// app.js
import {addLocaleData} from 'intl-fmt';
import en from 'intl-fmt/locale-data/en';
import fr from 'intl-fmt/locale-data/fr';
import es from 'intl-fmt/locale-data/es';

addLocaleData([...en, ...fr, ...es]);
// ...
```

Currently, **importing from a CDN is NOT supported**
_If you want CDN, please [submit an Issue/PR](https://github.com/adam-26/intl-fmt/issues/new) that publishes releases as part of the build process_
```js
// This is NOT CURRENTLY SUPPORTED
<!-- Load ReactIntl and its locale data for French. -->
<script src="https://unpkg.com/intl-fmt@latest/dist/intl-format.min.js"></script>
<script src="https://unpkg.com/intl-fmt@latest/locale-data/fr.js"></script>
<script>
    IntlFormat.addLocaleData(IntlFormatLocaleData.fr);
</script>
```

### Intl Formatter API

### Constructor `new IntlFmt(locale?: string, options: IntlFormatOptions): IntlFmt`

 * `locale` is optional, but must be defined if providing options
 * `options` can optionally be provided to modify behavior. Options include:
   * `initialNow: number` - the time value used for _now_ when rendering dates and times
   * `defaultLocale: string` - the formatters default locale, defaults to `en`
   * `defaultFormats: Object` - the formatters default formats, defaults to `{}`
   * `formats: Object` - custom formats, defaults to `{}`
   * `messages: { [id]: message }` - translated messages for the specified locale(s)
   * `requireOther: boolean` - true for ICU _plural_ and _select_ messages to **require** an `other` option (as defined in the ICU "spec"), defaults to `true`. Set this to `false` for backward compatibility with `react-intl`.
   * `textComponent: string` - A tag name that will be used to surround all rendered text. ie; `span` will result in all `message()` text being rendered in `<span>msg</span>` tags.
   * `textRenderer: (text) => string` - A function that can be used to customize all `message()` output.

#### `locale(): string`
Returns the current locale.

#### `now(): number`
Returns the value being used to represent `now`.

#### `setNow(now?: number): void`
Sets the value used to represent `now`.

#### `message(msgDescriptor: MessageDescriptor, values?: Object): string`
Formats a message descriptor using the optionally assigned values.

#### `htmlMessage(msgDescriptor: MessageDescriptor, values?: Object): string`
Formats a HTML message descriptor using the optionally assigned values.
_This exists for backwards compatibility only_. Using this method is **not recommended**., use `message()` instead.

#### `date(value: any, options?: DateTimeFormatOptions): string`
Formats a date for the current locale.

#### `time(value: any, options?: DateTimeFormatOptions): string`
Formats a time for the current locale.

#### `number(value: any, options?: NateTimeFormatOptions): string`
Formats a number for the current locale.

#### `relative(value: any, options?: RelativeFormatOptions): string`
Formats a relative time for the current locale, ie: `3 hours ago`.

#### `plural(value: any, options?: PluralFormatOptions): string`
Returns a value indicating the plurality of the value.
The return value will be one of `zero, one, two, few, many, other`

#### `changeLocale(locale: string, options?: intlFormatOptionsType = {}): IntlFmt`
Returns a new `IntlFmt` instance, applying the defined locale and options.
The parent `IntlFmt` instance values will be used where no `options` as defined.

### Tags
A `tag` enables style _placeholders_ to be included in the translation message _without_ including any of the
style information in the translation message.

This provides 3 benefits:
  1. It decouples the styling of the text from the translations, allowing the styling to change independently of translations.
  2. It allows translation messages to retain context for text that will be styled
  3. Tags can be named to provide _hints_ to translators

A tag **must** adhere to the following conventions:
 * begin with `<x:`
 * The tag name can include only numbers, ascii letters, underscore and dot `.`.
 * must be closed, self-closing tags are supported but should be used sparingly as they can be confusing for translators
 * Valid tag examples:
   * `<x:0>hello</x:0>`
   * `<x:link>click me</x:link>`
   * `<x:emoji />`

The tag value assigned to the `.format()` method **must** be a function.

Using **descriptive names** for tag names can provide hints to translators about the purpose of the tags. Tags and arguments can be used in combination in ICU message formats.

The following example uses a `{name}` argument in a tag.

```js
import IntlFmt from 'intl-fmt';

const fmt = new IntlFmt();
const msgDescriptor = {
  id: 'demo',
  defaultMessage: 'Welcome back <x:bold>{name}</x:bold>'
};

const formattedMsg = fmt.message(msgDescriptor, {
  bold: (content) => `<span class="boldText">${content}</span>`,
  name: 'Bob'
});

console.log(formattedMsg); // Welcome back <span class="boldText">Bob</span>
```

Contribute
---------
Check out the [Contributing document][CONTRIBUTING] for the details. Thanks!

For bugs or issues, please open an issue, and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run npm test to verify that your coe adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

License
-------

This software is free to use under the Yahoo Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.
