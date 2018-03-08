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

export type componentType = string | (text: string) => mixed;

export type intlFormatOptionsType = {
    messages?: Object,
    formats?: Object,
    defaultLocale?: string,
    defaultFormats?: Object,
    requireOther: true,
    formatFactories?: Object,
    initialNow?: number | () => number,

    // message builders
    textMessageBuilderFactory: () => messageBuilderType,
    componentMessageBuilderFactory: () => messageBuilderType,

    // render opts
    defaultComponent?: componentType,
    components?: { [name]: componentType },

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

export type componentBuilderType = {
    appendOpeningTag: (token: string) => void,
    appendClosingTag: (token: string) => void,
    appendChildren: (token: any) => void,
    build: () => mixed
};

export type componentBuilderFactoryType = () => componentBuilderType;

export type componentOptions = {
    component?: componentType,
    componentBuilderFactory?: componentBuilderFactoryType
};

export type dateOptions = {
    ...dateTimeFormatOptions,
    format?: string
};

export type dateComponentOptions = {
    ...dateOptions,
    ...componentOptions
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

export type relativeComponentOptions = {
    ...relativeOptions,
    ...componentOptions
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

export type numberComponentOptions = {
    ...numberOptions,
    ...componentOptions
};

export type pluralFormatOptions = {
    style?: 'cardinal' | 'ordinal',
};

export type messageOptions = {
    messageBuilderFactory?: () => messageBuilderType,
};

export type messageComponentOptions = {
    ...messageOptions,
    ...componentOptions
};

export type htmlMessageOptions = {
    ...componentOptions
};

export type changeLocaleType = (locale: string, options?: intlFormatOptionsType) => IntlFormat;
export type formatMessageType = (messageDescriptor: messageDescriptorType, values?: Object, options?: messageOptions) => mixed;
export type formatDateType = (value: any, options?: dateOptions) => string;
export type formatTimeType = (value: any, options?: dateOptions) => string;
export type formatRelativeType = (value: any, options?: relativeOptions) => string;
export type formatNumberType = (value: any, options?: numberOptions) => string;
export type formatPluralType = (value: any, options?: pluralFormatOptions) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type formatMessageComponentType = (messageDescriptor: messageDescriptorType, values?: Object, options?: messageComponentOptions) => mixed;
export type formatDateComponentType = (value: any, options?: dateComponentOptions) => string;
export type formatTimeComponentType = (value: any, options?: dateComponentOptions) => string;
export type formatRelativeComponentType = (value: any, options?: relativeComponentOptions) => string;
export type formatNumberComponentType = (value: any, options?: numberComponentOptions) => string;


export type IntlFormat = {
    now: () => number,
    setNow: (initialNow: number) => void,
    changeLocale: changeLocaleType,

    formatPlural: formatPluralType,
    formatDate: formatDateType,
    formatTime: formatTimeType,
    formatRelative: formatRelativeType,
    formatNumber: formatNumberType,
    formatMessage: formatMessageType,
    formatHTMLMessage: formatMessageType,

    plural: formatPluralType,
    date: formatDateType,
    time: formatTimeType,
    relative: formatRelativeType,
    number: formatNumberType,
    message: formatMessageType,
    htmlMessage: formatMessageType,

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
