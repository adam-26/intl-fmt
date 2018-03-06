/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// TODO: Remove unused code.
// type localeMatcher = 'best fit' | 'lookup';
// type narrowShortLong = 'narrow' | 'short' | 'long';
// type numeric2digit = 'numeric' | '2-digit';

export type intlConfigPropTypes = {
  locale: string,
  formats: Object,
  messages: Object,
  textComponent: any,

  defaultLocale: string,
  defaultFormats: Object,
};

export type intlFormatOptionsType = {
    messages?: Object,
    formats?: Object,
    defaultLocale?: string,
    defaultFormats?: Object,
    textComponent?: string,
    renderText?: (text: string) => mixed,
    formatFactories?: Object, //
    initialNow?: number
};

export type dateTimeFormatOptions = {
    localeMatcher: 'best fit' | 'lookup',
    formatMatcher: 'basic' | 'best fit',

    timeZone: string,
    hour12  : boolean,

    weekday     : 'narrow' | 'short' | 'long',
    era         : 'narrow' | 'short' | 'long',
    year        : 'numeric' | '2-digit',
    month       : 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
    day         : 'numeric' | '2-digit',
    hour        : 'numeric' | '2-digit',
    minute      : 'numeric' | '2-digit',
    second      : 'numeric' | '2-digit',
    timeZoneName: 'short' | 'long',
};

export type relativeFormatOptions = {
    style?: 'best fit' | 'numeric',
    units?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year',
};

export type numberFormatOptions = {
    localeMatcher: 'best fit' | 'lookup',

    style: 'decimal' | 'currency' | 'percent',

    currency       : string,
    currencyDisplay: 'symbol' | 'code' | 'name',

    useGrouping: boolean,

    minimumIntegerDigits    : number,
    minimumFractionDigits   : number,
    maximumFractionDigits   : number,
    minimumSignificantDigits: number,
    maximumSignificantDigits: number,
};

export type pluralFormatOptions = {
    style?: 'cardinal' | 'ordinal',
};

export type formatMessageType = (messageDescriptor: messageDescriptorType, values?: Object) => mixed;
export type formatDateType = (value: any, options?: dateTimeFormatOptions & {format?: string}) => string;
export type formatTimeType = (value: any, options?: dateTimeFormatOptions & {format?: string}) => string;
export type formatRelativeType = (value: any, options?: relativeFormatOptions & { format?: string, now?: any }) => string;
export type formatNumberType = (value: any, options?: numberFormatOptions & {format?: string}) => string;
export type formatPluralType = (value: any, options?: pluralFormatOptions) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type changeLocaleType = (locale: string, options?: intlFormatOptionsType) => IntlFormat;

export type IntlFormat = {
  formatDate: formatDateType,
  formatTime: formatTimeType,
  formatRelative: formatRelativeType,
  formatNumber: formatNumberType,
  formatPlural: formatPluralType,
  formatMessage: formatMessageType,
  formatHTMLMessage: formatMessageType,
  now: () => number,
  setNow: (initialNow: number) => void,
  changeLocale: changeLocaleType
};

// export type intlShape = { // TODO: DEL?
//   ...intlConfigPropTypes,
//   ...IntlFormatType,
//   formatters: Object,
//   now: funcReq,
// };

export type messageDescriptorType = {
  id: string,
  defaultMessage: string,
  description?: string | Object
};

// export type dateTimeFormatPropTypes = {
//   localeMatcher: localeMatcher,
//   formatMatcher: 'basic' | 'best fit',
//
//   timeZone: string,
//   hour12: boolean,
//
//   weekday: narrowShortLong,
//   era: narrowShortLong,
//   year: numeric2digit,
//   month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
//   day: numeric2digit,
//   hour: numeric2digit,
//   minute: numeric2digit,
//   second: numeric2digit,
//   timeZoneName: 'short' | 'long',
// };
//
// export type numberFormatPropTypes = {
//   localeMatcher: localeMatcher,
//
//   style: 'decimal' | 'currency' | 'percent',
//   currency: string,
//   currencyDisplay: 'symbol' | 'code' | 'name',
//   useGrouping: boolean,
//
//   minimumIntegerDigits: number,
//   minimumFractionDigits: number,
//   maximumFractionDigits: number,
//   minimumSignificantDigits: number,
//   maximumSignificantDigits: number,
// };
//
// export type relativeFormatPropTypes = {
//   style: 'best fit' | 'numeric',
//   units: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year',
// };
//
// export type pluralFormatPropTypes = {
//   style: 'cardinal' | 'ordinal'
// };
