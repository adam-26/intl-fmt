// @flow
import memoizeIntlConstructor from "intl-format-cache";
import IntlRelativeFormat from "tag-relativeformat";
import IntlMessageFormat, {StringBuilderFactory} from 'tag-messageformat';
import invariant from 'invariant';
import IntlPluralFormat from "./plural";
import * as format from "./format";
import { hasLocaleData } from "./locale-data-registry";
import {intlFormatPropNames, shortIntlFuncNames} from "./utils";
import type {
    dateTimeFormatOptions,
    numberFormatOptions,
    pluralFormatOptions,
    relativeFormatOptions,
    messageDescriptorType,
    intlFormatOptionsType,
    messageBuilderType
} from "./types";

const defaultMessages = {};
const IS_PROD = process.env.NODE_ENV === 'production';

const defaultNestedOpts = {
    message: null,
    htmlMessage: null,
    date: null,
    time: null,
    number: null,
    relative: null,
};

const defaultOpts = {
    messages: null,
    formats: null,
    defaultLocale: 'en',
    defaultFormats: {},
    initialNow: null,

    requireOther: true,
    messageBuilderFactory: StringBuilderFactory,
    defaultHtmlElementName: null,
    defaultRenderMethod: null,

    // Deprecated
    textRenderer: null,
    textComponent: null,
};

const optionNames = Object.keys(defaultOpts);

function resolveRenderer(htmlElement, renderMethod, defaultHtmlElementName, defaultRenderMethod) {
    return renderMethod ||
        getDefaultTextRenderer(htmlElement) ||
        defaultRenderMethod ||
        getDefaultTextRenderer(defaultHtmlElementName);
}

function getDefaultTextRenderer(textComponent) {
    if (typeof textComponent === 'undefined' || textComponent === null) {
        return null;
    }

    invariant(typeof textComponent === 'string', '[Intl Fmt] All `htmlElements` option names must be strings.');
    return (text) => `<${textComponent}>${text}</${textComponent}>`;
}

export default class Formatter {

    constructor(locale: string = 'en', options?: intlFormatOptionsType = {}) {
        invariant(
            typeof Intl !== 'undefined',
            '[Intl Fmt] The `Intl` APIs must be available in the runtime, ' +
            'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' +
            'See: http://formatjs.io/guides/runtime-environments/'
        );

        // Merge nested opts
        const { htmlElements, renderMethods, ...formatterOpts } = options;
        const htmlOpts = Object.assign({}, defaultNestedOpts, htmlElements);
        const renderOpts = Object.assign({}, defaultNestedOpts, renderMethods);

        const {
            formatFactories,
            ...configOpts
        } = Object.assign({}, defaultOpts, formatterOpts, { htmlElements: htmlOpts, renderMethods: renderOpts });
        const { textComponent, textRenderer, defaultRenderMethod } = configOpts;

        if (!IS_PROD) {
            if (textComponent !== null) {
                console.warn('[Intl Format] Option `textComponent` will be deprecated in a future version. Use `defaultHtmlElementName` instead.');
            }

            if (textRenderer !== null) {
                console.warn('[Intl Format] Option `textRenderer` will be deprecated in a future version. Use `defaultRenderMethod` instead.');
            }

            if (textRenderer !== null) {
                invariant(typeof textRenderer === 'function', '[Intl Format] Formatter constructor expects the `textRenderer` option to be a function.');
            }

            if (defaultRenderMethod !== null) {
                invariant(typeof defaultRenderMethod === 'function', '[Intl Format] Formatter constructor expects the `defaultRenderMethod` option to be a function.');
            }
        }

        this._config = this._getLocaleConfig(locale, configOpts);
        this._renderers = shortIntlFuncNames.reduce((acc, fnName) => {
            if (fnName === 'plural') {
                return acc;
            }

            acc[fnName] = resolveRenderer(
                this._config.htmlElements[fnName],
                this._config.renderMethods[fnName],
                this._config.defaultHtmlElementName || textComponent,
                this._config.defaultRenderMethod || textRenderer);
            return acc;
        }, {});

        // Used to stabilize time when performing an initial rendering so that
        // all relative times use the same reference "now" time.
        this.setNow(this._config.initialNow);

        // Creating `Intl*` formatters is expensive. If there's a parent
        // `Formatter`, then its formatters will be used. Otherwise, this
        // memoize the `Intl*` constructors and cache them for the lifecycle of
        // this Formatter instance.
        this._formatterState = {
            ...(formatFactories || this._getFormatFactories()),
            now: () => this.now()
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

    get options() {
        return this._config;
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

    _render(fnName: string, value: string): string {
        if (this._renderers[fnName]) {
            return this._renderers[fnName](value);
        }

        return value;
    }

    message(
        messageDescriptor: messageDescriptorType,
        values?: Object = {},
        messageBuilderFactory?: messageBuilderType
        ): string | mixed
    {
        return this._render('message', this._formatters.formatMessage(
            messageDescriptor,
            values,
            messageBuilderFactory || this._config.messageBuilderFactory));
    }

    htmlMessage(
        messageDescriptor: messageDescriptorType,
        values?: Object = {}
        ): string | mixed
    {
        return this._render('htmlMessage', this._formatters.formatHTMLMessage(messageDescriptor, values));
    }

    date(value: any,
         options?: dateTimeFormatOptions & {format?: string}
    ): string
    {
        return this._render('date', this._formatters.formatDate(value, options));
    }

    time(value: any,
         options?: dateTimeFormatOptions & {format?: string}
    ): string
    {
        return this._render('time', this._formatters.formatTime(value, options));
    }

    number(
        value: any,
        options?: numberFormatOptions & {format?: string}
        ): string
    {
        return this._render('number', this._formatters.formatNumber(value, options));
    }

    relative(
        value: any,
        options?: relativeFormatOptions & {
            format?: string,
            now?: any
        }
    ): string
    {
        return this._render('relative', this._formatters.formatRelative(value, options));
    }

    plural(
        value: any,
        options?: pluralFormatOptions
    ): 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
    {
        return this._formatters.formatPlural(value, options);
    }
}
