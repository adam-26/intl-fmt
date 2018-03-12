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

> [Read about the inspiration for this fork in the original react-intl issue discussing tags here.](https://github.com/yahoo/react-intl/issues/513)

> It uses the same well tested code to expose an internationalization API **without any React dependencies**

> It add supports for `Tags` in translation messages: "please <x:link>click here</x:link>"

> The only _breaking change_ is that whitespace inside **plural** ICU messages is now preserved. This may impact your existing translations.

> You _may_ need to set the `requireOther: false` option for backward compatibility if your ICU complex messages are missing the _other_ option.

#### Using React?
Use **[react-intl-fmt](https://github.com/adam-26/react-intl-format)**, _the API is compatible with [react-intl](https://github.com/yahoo/react-intl)_.

### Features

- Display numbers with separators.
- Display dates and times correctly.
- Display dates relative to "now".
- Pluralize labels in strings.
- Support for 150+ languages.
- Runs in the browser and Node.js.
- Built on standards.
- Extended to support `Tags`
- Customize the _method names_ used for formatting

> This supports the [ICU message translation format, read more about it here](https://formatjs.io/guides/message-syntax/).

> **Tags are not part of the ICU message standard**.

_Differences_ from the original package include:
 * As well as supporting ICU messages, this package also supports the use of `tags` in translations. [Whats a tag?](#whatsatag)
 * **No React dependency** - want to use `Tags` with React? See [react-intl-fmt](https://github.com/adam-26/react-intl-format), a drop-in replacement for [react-intl](https://github.com/yahoo/react-intl)

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

[Read the original react-intl issue discussing tags here.](https://github.com/yahoo/react-intl/issues/513)

[More information about using tags below](#tags).

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
 * `HtmlFormatter`: IntlHtmlFormatter - A formatter with additional methods for rendering formatted text as HTML elements
 * `addLocaleData: function`: Used to add additional locale data into the current environment
 * `defineMessages: function`: A utility method for provide a hook to babel plugins to messages at build time
 * `stringBuilderFactory`: The default factory method used to format `message` strings
 * `arrayBuilderFactory`: An alternative factory method that can be used to return formatted `message` strings as arrays
 * `stringFormatFactory`: The default factory method for formatting message argument values
 * `builderContextFactory`: The default factory for creating builder context instances

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

## Intl Formatter API

### _static_ `create(options: createFormatterOpts): IntlFmt`
A factory method for creating new `IntlFmt` classes that include _custom shorthand method names_.

Many _i18n_ packages use either `_()` or `t()` for formatting translated messages. You can now use this factory method to assign your own shorthand syntax to the `IntlFmt` class.

Define the _createFormatterOpts_:
  * `message?: string`:  The short method name for `message()`.
  * `htmlMessage?: string`: The short method name for `htmlMessage()`.
  * `date?: string`: The short method name for `date()`.
  * `time?: string`: The short method name for `time()`.
  * `number?: string`: The short method name for `number()`.
  * `relative?: string`: The short method name for `relative()`.
  * `plural?: string`: The short method name for `plural()`.

Example:
```js
import IntlFmt from 'intl-fmt';

// Create a new Formatter class
const CustomFormatter = IntlFmt.create({
  message: 'm',
  // other options here...
});

// Create a new class instance
const customFormatter = new CustomFormatter(locale, options);

// Use the shorthand methods
console.log(customerFormatter.m({ id: 'msg_id' }));
```

### Constructor `new IntlFmt(locale?: string, options: IntlFormatOptions): IntlFmt`

 * `locale` is optional, but must be defined if providing options
 * `options` can optionally be provided to modify behavior. Options include:
   * `initialNow: number | () => number` - the time value used for _now_ when rendering dates and times
   * `defaultLocale: string` - the formatters default locale, defaults to `en`
   * `defaultFormats: Object` - the formatters default formats, defaults to `{}`
   * `formats: Object` - custom formats, defaults to `{}`
   * `messages: { [id]: message }` - translated messages for the specified locale(s)
   * `requireOther: boolean` - true for ICU _plural_ and _select_ messages to **require** an `other` option (as defined in the ICU "spec"), defaults to `true`. Set this to `false` for backward compatibility with `react-intl`.
   * `onError: (message: string, exception?: Error) => void`: A function to log errors, defaults writing to `console.error`
   * `stringFormatFactory`: The factory used to create `StringFormat` instances used to format message argument values
   * `messageBuilderFactory`: The factory used to create `MessageBuilder` instances used to format `message()` output
   * `messageBuilderContextFactory`: The factory used to create `MessageBuilderContext` instances, passed to each `MessageBuilder`.

#### `locale(): string`
Returns the current locale.

#### `now(): number`
Returns the value being used to represent `now`.

#### `setNow(now?: number): void`
Sets the value used to represent `now`.

#### `message(msgDescriptor: MessageDescriptor, values?: Object, options?: MessageOptions): mixed`
Formats a message descriptor using the optionally assigned values.

#### `htmlMessage(msgDescriptor: MessageDescriptor, values?: Object, options?: MessageOptions): mixed`
Formats a HTML message descriptor using the optionally assigned values.
_This exists for backwards compatibility only_. Using this method is **not recommended**., use `message()` instead.

#### `date(value: any, options?: DateTimeFormatOptions): string`
Formats a date for the current locale.

#### `time(value: any, options?: DateTimeFormatOptions): string`
Formats a time for the current locale.

#### `number(value: any, options?: NumberFormatOptions): string`
Formats a number for the current locale.

#### `relative(value: any, options?: RelativeFormatOptions): string`
Formats a relative time for the current locale, ie: `3 hours ago`.

#### `plural(value: any, options?: PluralFormatOptions): string`
Returns a value indicating the plurality of the value.
The return value will be one of `zero, one, two, few, many, other`

#### `changeLocale(locale: string, options?: intlFormatOptionsType = {}): IntlFmt`
Returns a new `IntlFmt` instance, applying the defined locale and options.
The parent `IntlFmt` instance values will be used where no `options` as defined.

## Intl Html Formatter

### _static_ `create(options: createFormatterOpts): IntlFmt`
A factory method for creating new `IntlFmt` classes that include _custom shorthand method names_.

Many _i18n_ packages use either `_()` or `t()` for formatting translated messages. You can now use this factory method to assign your own shorthand syntax to the `IntlFmt` class.

Define the _createFormatterOpts_:
  * `message?: string`:  The short method name for `message()`.
  * `messageElement?: string`: The short method name for `messageElement()`.
  * `htmlMessage?: string`: The short method name for `htmlMessage()`.
  * `htmlMessageElement?: string`: The short method name for `htmlMessageElement()`.
  * `date?: string`: The short method name for `date()`.
  * `dateElement?: string`: The short method name for `dateElement()`.
  * `time?: string`: The short method name for `time()`.
  * `timeElement?: string`: The short method name for `timeElement()`.
  * `number?: string`: The short method name for `number()`.
  * `numberElement?: string`: The short method name for `numberElement()`.
  * `relative?: string`: The short method name for `relative()`.
  * `relativeElement?: string`: The short method name for `relativeElement()`.
  * `plural?: string`: The short method name for `plural()`.

Example:
```js
import {HtmlFormatter} from 'intl-fmt';

// Create a new Formatter class
const CustomHtmlFormatter = HtmlFormatter.create({
  message: 'm',
  messageElement: 'me',
  // other options here
});

// Create a new class instance
const customFormatter = new CustomHtmlFormatter(locale, options);

// Use the shorthand methods
console.log(customerFormatter.m({ id: 'msg_id' }));
console.log(customerFormatter.me({ id: 'msg_id' }));

```

### Constructor `new HtmlFormatter(locale?: string, options: IntlHtmlFormatOptions): IntlFmt`

 * `locale` is optional, but must be defined if providing options
 * `options` can optionally be provided to modify behavior. Options include:
   * `initialNow: number | () => number` - the time value used for _now_ when rendering dates and times
   * `defaultLocale: string` - the formatters default locale, defaults to `en`
   * `defaultFormats: Object` - the formatters default formats, defaults to `{}`
   * `formats: Object` - custom formats, defaults to `{}`
   * `messages: { [id]: message }` - translated messages for the specified locale(s)
   * `requireOther: boolean` - true for ICU _plural_ and _select_ messages to **require** an `other` option (as defined in the ICU "spec"), defaults to `true`. Set this to `false` for backward compatibility with `react-intl`.
   * `onError: (message: string, exception?: Error) => void`: A function to log errors, defaults writing to `console.error`
   * `messageBuilderFactory`: The factory used to format `message` output
   * `messageBuilderContextFactory`: The factory used to create `MessageBuilderContext` instances, passed to each `MessageBuilder`.
   * `defaultHtmlElement: string | (value) => mixed` - A string or function used to format all `*Element()` methods. ie; `span` will result in a formatted component being rendered as `<span>value</span>`.
   * `htmlElements: { [formatMethodName]: string | (value) => mixed }`: An object of key/value pairs that define the element render configuration for specific formatter(s).
   * `htmlMessageBuilderFactory`: The factory used to format `messageElement()` output
   * `htmlElementBuilderFactory`: The factory used to build HTML elements when the `tagName` is a string.

#### `locale(): string`
Returns the current locale.

#### `now(): number`
Returns the value being used to represent `now`.

#### `setNow(now?: number): void`
Sets the value used to represent `now`.

#### `message(msgDescriptor: MessageDescriptor, values?: Object, options?: MessageOptions): mixed`
Formats a message descriptor using the optionally assigned values.

#### `htmlMessage(msgDescriptor: MessageDescriptor, values?: Object, options?: MessageOptions): mixed`
Formats a HTML message descriptor using the optionally assigned values.
_This exists for backwards compatibility only_. Using this method is **not recommended**., use `message()` instead.

#### `date(value: any, options?: DateTimeFormatOptions): string`
Formats a date for the current locale.

#### `time(value: any, options?: DateTimeFormatOptions): string`
Formats a time for the current locale.

#### `number(value: any, options?: NumberFormatOptions): string`
Formats a number for the current locale.

#### `relative(value: any, options?: RelativeFormatOptions): string`
Formats a relative time for the current locale, ie: `3 hours ago`.

#### `plural(value: any, options?: PluralFormatOptions): string`
Returns a value indicating the plurality of the value.
The return value will be one of `zero, one, two, few, many, other`

#### `messageElement(msgDescriptor: MessageDescriptor, values?: Object, options?: MessageOptions): mixed`
Formats a message descriptor as a component.

#### `htmlMessageElement(msgDescriptor: MessageDescriptor, values?: Object, options?: htmlMessageOptions): mixed`
Formats a HTML message descriptor as a component.

_This exists for backwards compatibility only_. Using this method is **not recommended**, use `messageComponent()` instead.

#### `dateElement(value: any, options?: DateTimeComponentOptions): mixed`
Formats a date for the current locale as a component.

#### `timeElement(value: any, options?: DateTimeComponentOptions): mixed`
Formats a time for the current locale as a component.

#### `numberElement(value: any, options?: NumberComponentOptions): mixed`
Formats a number for the current locale.

#### `relativeElement(value: any, options?: RelativeComponentOptions): mixed`
Formats a relative time for the current locale as a component, ie: `<span>3 hours ago</span>`.

#### `changeLocale(locale: string, options?: intlFormatOptionsType = {}): IntlHtmlFmt`
Returns a new `IntlHtmlFmt` instance, applying the defined locale and options.
The parent `IntlHtmlFmt` instance values will be used where no `options` as defined.

## Tags
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
Check out the [Contributing document](https://github.com/adam-26/intl-format/blob/master/CONTRIBUTING.md) for the details. Thanks!

For bugs or issues, please open an issue, and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run npm test to verify that your code adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

License
-------

This software is free to use under the Yahoo Inc. BSD license.
See the [LICENSE file](https://github.com/adam-26/intl-format/blob/master/LICENSE.md) for license text and copyright information.

