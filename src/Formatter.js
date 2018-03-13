// @flow
import memoizeIntlConstructor from "intl-format-cache";
import IntlRelativeFormat from "tag-relativeformat";
import IntlMessageFormat, {stringBuilderFactory} from 'tag-messageformat';
import invariant from 'invariant';
import IntlPluralFormat from "./plural";
import * as format from "./format";
import { hasLocaleData } from "./locale-data-registry";
import {defaultErrorHandler, builderContextFactory, formatterMethodNames} from "./utils";
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
    messageBuilderFactory: stringBuilderFactory,
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
        if (!IS_PROD) {
            options.onError(
                `Missing locale data for locale: "${locale}". ` +
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

export default class Formatter {

    static create(methodNameOpts?: Object = {}) {

        class CustomFormatter extends Formatter { }

        formatterMethodNames.forEach(methodName => {
            const shortMethodName = methodNameOpts[methodName];
            if (typeof shortMethodName === 'string' && shortMethodName !== null) {
                CustomFormatter.prototype[shortMethodName] = Formatter.prototype[methodName];
            }
        });

        return CustomFormatter;
    }

    constructor(locale: string = 'en', options?: intlFormatOptionsType = {}) {
        invariant(
            typeof Intl !== 'undefined',
            '[Intl Format] The `Intl` APIs must be available in the runtime, ' +
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

        return this._newInstance(locale, {
            ...newOpts,
            formatFactories
        });
    }

    _newInstance(locale: string, options?: intlFormatOptionsType = {}): Formatter {
        return new Formatter(locale, options);
    }

    locale() {
        return this._config.locale;
    }

    now(): number {
        return typeof this._initialNow === 'function' ? this._initialNow() : this._initialNow;
    }

    setNow(initialNow?: number | () => number): void {
        this._initialNow = typeof initialNow === 'function' ?
            initialNow :
            (typeof initialNow === 'number' && isFinite(initialNow)) ?
                Number(initialNow) :
                () => new Date().getTime();
    }

    message(messageDescriptor: messageDescriptorType, values?: Object = {}, options?: messageOptions = {}): mixed {
        const {messageBuilderFactory, messageBuilderContextFactory} = options;
        const ctxFactory = messageBuilderContextFactory || this._config.messageBuilderContextFactory;

        return format.formatMessage(
            this._config,
            this._formatterState,
            messageDescriptor,
            values, {
                messageBuilderFactory: messageBuilderFactory || this._config.messageBuilderFactory,
                messageBuilderContext: typeof ctxFactory === 'function' ?
                    ctxFactory(messageDescriptor.id) :
                    builderContextFactory()
            });
    }

    htmlMessage(messageDescriptor: messageDescriptorType, values?: Object = {}): mixed {
        return format.formatHTMLMessage(
            this._config,
            this._formatterState,
            messageDescriptor,
            values);
    }

    date(value: any, options?: dateOptions = {}): string {
        return format.formatDate(
            this._config,
            this._formatterState,
            value,
            options);
    }

    time(value: any, options?: dateOptions = {}): string {
        return format.formatTime(
            this._config,
            this._formatterState,
            value,
            options);
    }

    number(value: any, options?: numberOptions = {}): string {
        return format.formatNumber(
            this._config,
            this._formatterState,
            value,
            options);
    }

    relative(value: any, options?: relativeOptions = {}): string {
        return format.formatRelative(
            this._config,
            this._formatterState,
            value,
            options);
    }

    plural(value: any, options?: pluralFormatOptions = {}): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' {
        return format.formatPlural(
            this._config,
            this._formatterState,
            value,
            options);
    }
}
