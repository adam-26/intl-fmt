// @flow
import memoizeIntlConstructor from "intl-format-cache";
import IntlRelativeFormat from "tag-relativeformat";
import IntlMessageFormat, {StringBuilderFactory} from 'tag-messageformat';
import invariant from 'invariant';
import IntlPluralFormat from "./plural";
import * as format from "./format";
import { hasLocaleData } from "./locale-data-registry";
import {defaultErrorHandler, intlFormatPropNames} from "./utils";
import type {
    relativeOptions,
    pluralFormatOptions,
    messageDescriptorType,
    intlFormatOptionsType,
    numberOptions,
    dateOptions,
    messageOptions
} from "./types";

const defaultMessages = {};
const IS_PROD = process.env.NODE_ENV === 'production';

const defaultOpts = {
    messages: null,
    formats: null,
    defaultLocale: 'en',
    defaultFormats: {},
    initialNow: null,

    requireOther: true,
    messageBuilderFactory: StringBuilderFactory,
    onError: defaultErrorHandler,

    // Deprecated
    textRenderer: null,
    textComponent: null,
};

const optionNames = Object.keys(defaultOpts);

function getFormatFactories() {
    return {
        getDateTimeFormat: memoizeIntlConstructor(Intl.DateTimeFormat),
        getNumberFormat: memoizeIntlConstructor(Intl.NumberFormat),
        getMessageFormat: memoizeIntlConstructor(IntlMessageFormat),
        getRelativeFormat: memoizeIntlConstructor(IntlRelativeFormat),
        getPluralFormat: memoizeIntlConstructor(IntlPluralFormat)
    };
}

function getLocaleConfig(locale: string, options) {
    const {
        messages,
        formats,
        defaultLocale,
        defaultFormats
    } = options;

    if (!hasLocaleData(locale)) {
        if (IS_PROD) {
            options.onError(
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

function bindFormatters(config, formatterState): Object {
    return intlFormatPropNames.reduce((boundFormatFns, name) => {
        if (name !== 'now') {
            boundFormatFns[name] = format[name].bind(null, config, formatterState);
        }

        return boundFormatFns;
    }, {});
}

export default class Formatter {

    static create(options?: Object = {}) {
        const opts = Object.assign({
            message: 'm',
            htmlMessage: 'h',
            date: 'd',
            time: 't',
            number: 'n',
            relative: 'r',
            plural: 'p'
        }, options);

        class CustomFormatter extends Formatter {
            [opts.message](messageDescriptor: messageDescriptorType, values?: Object = {}, options?: messageOptions = {}): mixed {
                return this.message(messageDescriptor, values, options);
            }

            [opts.htmlMessage](messageDescriptor: messageDescriptorType, values?: Object = {}): mixed {
                return this.htmlMessage(messageDescriptor, values);
            }

            [opts.date](value: any, options?: dateOptions = {}): string {
                return this.date(value, options);
            }

            [opts.time](value: any, options?: dateOptions = {}): string {
                return this.time(value, options);
            }

            [opts.number](value: any, options?: numberOptions = {}): string {
                return this.number(value, options);
            }

            [opts.relative](value: any, options?: relativeOptions = {}): string {
                return this.relative(value, options);
            }

            [opts.plural](value: any, options?: pluralFormatOptions = {}): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' {
                return this.plural(value, options);
            }
        }

        return CustomFormatter;
    }

    constructor(locale: string = 'en', options?: intlFormatOptionsType = {}) {
        invariant(
            typeof Intl !== 'undefined',
            '[Intl Fmt] The `Intl` APIs must be available in the runtime, ' +
            'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' +
            'See: http://formatjs.io/guides/runtime-environments/'
        );

        const {
            formatFactories,
            ...configOpts
        } = Object.assign({}, defaultOpts, options);
        const { textComponent, textRenderer } = configOpts;

        if (!IS_PROD) {
            if (textComponent !== null) {
                console.warn('[Intl Format] Option `textComponent` has been deprecated, use the `HtmlFormatter` to render HTML elements.');
            }

            if (textRenderer !== null) {
                console.warn('[Intl Format] Option `textRenderer` has been deprecated, use the `HtmlFormatter` to render HTML elements.');
            }
        }

        this._config = getLocaleConfig(locale, configOpts);

        // Used to stabilize time when performing an initial rendering so that
        // all relative times use the same reference "now" time.
        this.setNow(this._config.initialNow);

        // Creating `Intl*` formatters is expensive. If there's a parent
        // `Formatter`, then its formatters will be used. Otherwise, this
        // memoize the `Intl*` constructors and cache them for the lifecycle of
        // this Formatter instance.
        this._formatterState = {
            ...(formatFactories || getFormatFactories()),
            now: () => this.now()
        };

        this._formatters = bindFormatters(this._config, this._formatterState)
    }

    get options() {
        return this._config;
    }

    // method to extend/change the current Formatter and return a NEW instance
    changeLocale(locale: string, options?: intlFormatOptionsType = {}): Formatter {
        invariant(typeof locale === 'string', 'locale string value is required.');

        // remove 'now' from the factories
        // eslint-disable-next-line no-unused-vars
        const { now, ...formatFactories } = this._formatterState;
        const newOpts = optionNames.reduce((newOpts, optName) => {
            newOpts[optName] = typeof options[optName] !== 'undefined' ? options[optName] : this._config[optName];
            return newOpts;
        }, {});

        return new Formatter(locale, {
            ...newOpts,
            formatFactories
        });
    }

    locale() {
        return this._config.locale;
    }

    now(): number {
        return typeof this._initialNow === 'function' ? this._initialNow() : this._initialNow;
    }

    setNow(initialNow?: number): void {
        this._initialNow = (typeof initialNow === 'number' && isFinite(initialNow)) ?
            Number(initialNow) :
            () => new Date().getTime();
    }

    message(messageDescriptor: messageDescriptorType, values?: Object = {}, options?: messageOptions = {}): mixed {
        return this._formatters.formatMessage(
            messageDescriptor,
            values,
            options.messageBuilderFactory || this._config.messageBuilderFactory);
    }

    htmlMessage(messageDescriptor: messageDescriptorType, values?: Object = {}): mixed {
        return this._formatters.formatHTMLMessage(messageDescriptor, values);
    }

    date(value: any, options?: dateOptions = {}): string {
        return this._formatters.formatDate(value, options);
    }

    time(value: any, options?: dateOptions = {}): string {
        return this._formatters.formatTime(value, options);
    }

    number(value: any, options?: numberOptions = {}): string {
        return this._formatters.formatNumber(value, options);
    }

    relative(value: any, options?: relativeOptions = {}): string {
        return this._formatters.formatRelative(value, options);
    }

    plural(value: any, options?: pluralFormatOptions = {}): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' {
        return this._formatters.formatPlural(value, options);
    }
}
