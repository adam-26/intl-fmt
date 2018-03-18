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

const IS_PROD = process.env.NODE_ENV === 'production';

const defaultOpts = {
    initialNow: null,
    messages: {},
    formats: {},
    defaultLocale: 'en',
    defaultFormats: {},
    defaultMessages: {},
    defaultOptions: {},

    requireOther: true,
    messageBuilderFactory: stringBuilderFactory,
    onError: defaultErrorHandler
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
        defaultFormats,
        defaultMessages,
        defaultOptions
    } = options;

    const formatterOptions = formatterMethodNames.reduce((acc, formatterName) => {
        const defaultOption = defaultOptions[formatterName] || {};
        if (defaultOption !== null && typeof defaultOption === 'object' && !Array.isArray(defaultOption)) {
            acc[formatterName] = defaultOptions[formatterName];
        }

        if (!IS_PROD) {
            if (typeof defaultOption !== 'object' || Array.isArray(defaultOption) || defaultOption === null) {
                options.onError(`'defaultOption.${formatterName}' option must be an object that defines default options for ${formatterName}.`);
            }
        }

        return acc;
    }, {});

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
            defaultMessages: defaultMessages,
            defaultOptions: formatterOptions
        };
    }

    return {
        ...options,
        locale: locale || defaultLocale,
        formats: formats || defaultFormats,
        messages: messages,
        defaultMessages: defaultMessages,
        defaultOptions: formatterOptions
    };
}

export default class Formatter {

    static create(methodNameOpts?: Object = {}) {
        if (!IS_PROD) {
            console.warn('[Intl Format] Formatter static function `create` is deprecated, use the static `extend` function instead. This will be removed in a future version.');
        }

        return Formatter.extend(methodNameOpts);
    }

    static extend(methodNameOpts?: Object = {}) {

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

        const newOpts = optionNames.reduce((reducedOpts, optName) => {
            const currentValue = this._config[optName];
            const newValue = options[optName];
            const hasNewValue = typeof newValue !== 'undefined';

            if (hasNewValue && defaultOpts[optName] !== null && typeof defaultOpts[optName] === 'object') {
                // Object types must be merged
                if (optName === 'formats') {
                    const formatKeys = Object.keys(currentValue).concat(Object.keys(newValue));

                    // Merge format(s) for each formatter
                    reducedOpts[optName] = formatKeys.reduce((reducedFormats, formatKey) => {
                        reducedFormats[formatKey] = Object.assign({}, currentValue[formatKey], newValue[formatKey]);
                        return reducedFormats;
                    }, {});
                } else {
                    reducedOpts[optName] = Object.assign({}, currentValue, newValue);
                }
            }
            else {
                reducedOpts[optName] = hasNewValue ? newValue : currentValue;
            }

            return reducedOpts;
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

    getRawMessage(messageDescriptor: messageDescriptorType): string {
        const {defaultMessage, id} = messageDescriptor;
        const {messages, defaultMessages} = this._config;

        // This must produce the same result as logic in `formatMessage()` method
        return (messages && messages[id]) || (defaultMessages && defaultMessages[id]) || defaultMessage || id;
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
