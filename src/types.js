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

export type htmlElementType = string | (text: string) => mixed;

export type intlFormatOptionsType = {
    messages?: Object,
    formats?: Object,
    defaultLocale?: string,
    defaultFormats?: Object,
    requireOther: true,
    formatFactories?: Object,
    initialNow?: number | () => number,

    // message builders
    messageBuilderFactory: () => messageBuilderType,

    onError?: (message: string, exception?: Error) => void,

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

export type htmlElementBuilderType = {
    appendOpeningTag: (token: string) => void,
    appendClosingTag: (token: string) => void,
    appendChildren: (token: any) => void,
    build: () => mixed
};

export type intlHtmlFormatOptionsType = {
    ...intlFormatOptionsType,
    ...htmlElementOptions,
    defaultTagName: htmlElementType
};

export type htmlElementOptions = {
    tagName?: htmlElementType,
    htmlMessageBuilderFactory?: () => messageBuilderType,
    htmlElementBuilderFactory?: () => htmlElementBuilderType
};

export type dateOptions = {
    ...dateTimeFormatOptions,
    format?: string
};

export type dateElementOptions = {
    ...dateOptions,
    ...htmlElementOptions
};

export type relativeFormatOptions = {
    style?: 'best fit' | 'numeric',
    units?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year',
};

export type relativeOptions = {
    ...relativeFormatOptions,
    format?: string,
    now?: any
};

export type relativeElementOptions = {
    ...relativeOptions,
    ...htmlElementOptions
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

export type numberOptions = {
    ...numberFormatOptions,
    format?: string
};

export type numberElementOptions = {
    ...numberOptions,
    ...htmlElementOptions
};

export type pluralFormatOptions = {
    style?: 'cardinal' | 'ordinal',
};

export type messageOptions = {
    messageBuilderFactory?: () => messageBuilderType,
};

export type messageElementOptions = {
    ...messageOptions,
    ...htmlElementOptions
};

export type htmlMessageOptions = {
    ...htmlElementOptions
};

export type changeLocaleType = (locale: string, options?: intlFormatOptionsType) => IntlFormat;
export type formatMessageType = (messageDescriptor: messageDescriptorType, values?: Object, options?: messageOptions) => mixed;
export type formatDateType = (value: any, options?: dateOptions) => string;
export type formatTimeType = (value: any, options?: dateOptions) => string;
export type formatRelativeType = (value: any, options?: relativeOptions) => string;
export type formatNumberType = (value: any, options?: numberOptions) => string;
export type formatPluralType = (value: any, options?: pluralFormatOptions) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type formatMessageComponentType = (messageDescriptor: messageDescriptorType, values?: Object, options?: messageElementOptions) => mixed;
export type formatDateComponentType = (value: any, options?: dateElementOptions) => string;
export type formatTimeComponentType = (value: any, options?: dateElementOptions) => string;
export type formatRelativeComponentType = (value: any, options?: relativeElementOptions) => string;
export type formatNumberComponentType = (value: any, options?: numberElementOptions) => string;

export type IntlFormat = {
    now: () => number,
    setNow: (initialNow: number) => void,
    changeLocale: changeLocaleType,

    // Backward compatibility
    formatPlural: formatPluralType,
    formatDate: formatDateType,
    formatTime: formatTimeType,
    formatRelative: formatRelativeType,
    formatNumber: formatNumberType,
    formatMessage: formatMessageType,
    formatHTMLMessage: formatMessageType,

    // Short method names
    plural: formatPluralType,
    date: formatDateType,
    time: formatTimeType,
    relative: formatRelativeType,
    number: formatNumberType,
    message: formatMessageType,
    htmlMessage: formatMessageType,
};

export type HtmlIntlFormat = {
    ...IntlFormat,

    dateComponent: formatDateComponentType,
    timeComponent: formatTimeComponentType,
    relativeComponent: formatRelativeComponentType,
    numberComponent: formatNumberComponentType,
    messageComponent: formatMessageComponentType,
    htmlMessageComponent: formatMessageComponentType,
};

export type messageDescriptorType = {
  id: string,
  defaultMessage: string,
  description?: string | Object
};
