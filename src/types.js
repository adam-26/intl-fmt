/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

export type messageBuilderType = {
    appendText: (msg: mixed) => void,
    appendSimpleMessage: (msg: mixed) => void,
    appendFormattedMessage: (msg: mixed) => void,
    appendTag: (msg: mixed) => void,
    build: () => mixed;
};

export type nestedRenderOptionsType = {
    message?: string,
    htmlMessage?: string,
    date?: string,
    time?: string,
    number?: string,
    relative?: string,
};

export type intlFormatOptionsType = {
    messages?: Object,
    formats?: Object,
    defaultLocale?: string,
    defaultFormats?: Object,
    requireOther: true,
    formatFactories?: Object,
    initialNow?: number | () => number,
    messageBuilderFactory: () => messageBuilderType,

    // render opts
    defaultComponent?: string,
    defaultRenderer?: (text: string) => mixed,
    htmlElements?: nestedRenderOptionsType,
    renderMethods?: nestedRenderOptionsType,

    // Deprecated
    textRenderer?: (text: string) => mixed,
    textComponent?: string,
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

export type formatMessageType = (messageDescriptor: messageDescriptorType, values?: Object, msgBuilderFactory?: () => messageBuilderType) => mixed;
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

export type messageDescriptorType = {
  id: string,
  defaultMessage: string,
  description?: string | Object
};
