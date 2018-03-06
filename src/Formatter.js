// @flow
import memoizeIntlConstructor from "intl-format-cache";
import IntlRelativeFormat from "tag-relativeformat";
import IntlMessageFormat from 'tag-messageformat';
import invariant from 'invariant';
import IntlPluralFormat from "./plural";
import * as format from "./format";
import { hasLocaleData } from "./locale-data-registry";
import {intlFormatPropNames} from "./utils";
import type {
    dateTimeFormatOptions,
    numberFormatOptions,
    pluralFormatOptions,
    relativeFormatOptions,
    messageDescriptorType,
    intlFormatOptionsType
} from "./types";

const defaultMessages = {};
const IS_PROD = process.env.NODE_ENV === 'production';


const defaultOpts = {
    messages: null,
    formats: null,
    defaultLocale: 'en',
    defaultFormats: {},
    textComponent: null,
    textRenderer: null,
    requireOther: true
};

const optionNames = Object.keys(defaultOpts);

function getDefaultTextRenderer(textComponent) {
    return (text) => `<${textComponent}>${text}</${textComponent}>`;
}

export default class Formatter {

    constructor(locale: string = 'en', options?: intlFormatOptionsType = {}) {
        const {
            initialNow,
            formatFactories,
            ...configOpts
        } = Object.assign({ initialNow: Date.now() }, defaultOpts, options);
        const { textComponent, textRenderer } = configOpts;

        if (textRenderer !== null) {
            invariant(typeof textRenderer === 'function', '[Intl Format] Formatter constructor expects the `textRenderer` option to be a function.');
        }

        // Used to stabilize time when performing an initial rendering so that
        // all relative times use the same reference "now" time.
        this.setNow(initialNow);
        this._config = this._getLocaleConfig(locale, configOpts);
        this._textRenderer = textRenderer || (textComponent !== null ? getDefaultTextRenderer(textComponent) : null);
        this._hasTextRenderer = this._textRenderer !== null;

        // Creating `Intl*` formatters is expensive. If there's a parent
        // `Formatter`, then its formatters will be used. Otherwise, this
        // memoize the `Intl*` constructors and cache them for the lifecycle of
        // this Formatter instance.
        this._formatterState = {
            ...(formatFactories || this._getFormatFactories()),
            now: () => this._initialNow
        };

        this._formatters = this._bindFormatters(this._config, this._formatterState)
    }

    _getFormatFactories() {
        return {
            getDateTimeFormat: memoizeIntlConstructor(Intl.DateTimeFormat),
            getNumberFormat: memoizeIntlConstructor(Intl.NumberFormat),
            getMessageFormat: memoizeIntlConstructor(IntlMessageFormat),
            getRelativeFormat: memoizeIntlConstructor(IntlRelativeFormat),
            getPluralFormat: memoizeIntlConstructor(IntlPluralFormat)
        };
    }

    _getLocaleConfig(locale: string, options) {
        const {
            messages,
            formats,
            defaultLocale,
            defaultFormats
        } = options;

        if (!hasLocaleData(locale)) {
            if (IS_PROD) {
                console.error(
                    `[Intl Format] Missing locale data for locale: "${locale}". ` +
                    `Using default locale: "${defaultLocale}" as fallback.`
                );
            }

            // Since there's no registered locale data for `locale`, this will
            // fallback to the `defaultLocale` to make sure things can render.
            // The `messages` are overridden to the `defaultProps` empty object
            // to maintain referential equality across re-renders. It's assumed
            // each `formatMessage(msgProps, values)` contains a `defaultMessage` prop.
            return {
                ...options,
                locale: defaultLocale,
                formats: defaultFormats,
                messages: defaultMessages,
            };
        }

        return {
            ...options,
            locale: locale || defaultLocale,
            formats: formats || defaultFormats,
            messages: messages || defaultMessages
        };
    }

    _bindFormatters(config, formatterState): Object {
        return intlFormatPropNames.reduce((boundFormatFns, name) => {
            if (name !== 'now') {
                boundFormatFns[name] = format[name].bind(null, config, formatterState);
            }

            return boundFormatFns;
        }, {});
    }

    // method to extend/change the current Formatter and return a NEW instance
    changeLocale(locale: string, options?: intlFormatOptionsType = {}): Formatter {
        invariant(typeof locale === 'string', 'locale string value is required.');

        const { now, ...formatFactories } = this._formatterState;
        const newOpts = optionNames.reduce((newOpts, optName) => {
            newOpts[optName] = typeof options[optName] !== 'undefined' ? options[optName] : this._config[optName];
            return newOpts;
        }, {});

        return new Formatter(locale, {
            ...newOpts,
            formatFactories,
            initialNow: options.initialNow || now()
        });
    }

    locale() {
        return this._config.locale;
    }

    now(): number {
        return this._initialNow;
    }

    setNow(initialNow?: number): void {
        this._initialNow = isFinite(initialNow) ? Number(initialNow) : Date.now();
    }

    message(
        messageDescriptor: messageDescriptorType,
        values?: Object = {}
        ): string | mixed
    {
        const msg = this._formatters.formatMessage(messageDescriptor, values);
        if (this._hasTextRenderer) {
            return this._textRenderer(msg);
        }

        return msg;
    }

    htmlMessage(
        messageDescriptor: messageDescriptorType,
        values?: Object = {}
        ): string | mixed
    {
        return this._formatters.formatHTMLMessage(messageDescriptor, values)
    }

    date(value: any,
         options?: dateTimeFormatOptions & {format?: string}
    ): string
    {
        return this._formatters.formatDate(value, options);
    }

    time(value: any,
         options?: dateTimeFormatOptions & {format?: string}
    ): string
    {
        return this._formatters.formatTime(value, options);
    }

    number(
        value: any,
        options?: numberFormatOptions & {format?: string}
        ): string
    {
        return this._formatters.formatNumber(value, options);
    }

    relative(
        value: any,
        options?: relativeFormatOptions & {
            format?: string,
            now?: any
        }
    ): string
    {
        return this._formatters.formatRelative(value, options);
    }

    plural(
        value: any,
        options?: pluralFormatOptions
    ): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
    {
        return this._formatters.formatPlural(value, options);
    }
}
