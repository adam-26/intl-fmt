// @flow

import Formatter from "./Formatter";
import {formatterMethodNames, builderContextFactory} from "./utils";
import invariant from "invariant";
import {stringBuilderFactory} from "tag-messageformat";
import type {
    htmlElementOptions,
    dateElementOptions,
    htmlMessageOptions,
    messageElementOptions,
    messageDescriptorType,
    numberElementOptions,
    relativeElementOptions,
    intlHtmlFormatOptionsType,
    intlFormatOptionsType
} from "./types";

function HtmlElementBuilderFactory() {
    return new HtmlElementBuilder();
}

export class HtmlElementBuilder {

    constructor() {
        this._str = '';
    }

    append(value: string): void {
        this._str += value;
    }

    appendOpeningTag(tagName: string): void {
        this.append(`<${tagName}>`);
    }

    appendClosingTag(tagName: string): void {
        this.append(`</${tagName}>`);
    }

    appendChildren(value: any): void {
        this.append(value);
     }

    build(): string {
        return this._str;
    }
}

const IS_PROD = process.env.NODE_ENV === 'production';

const defaultOpts = {
    htmlElementBuilderFactory: HtmlElementBuilderFactory,
    htmlMessageBuilderFactory: stringBuilderFactory,
    defaultHtmlElement: 'span',
    htmlElements: {},
};

function resolveRenderer(tagName, defaultHtmlElement) {
    const htmlElement = tagName || defaultHtmlElement;
    if (typeof htmlElement === 'string') {
        return htmlElement;
    }

    invariant(typeof htmlElement === 'function', '[Intl Fmt] All optional `htmlElements` must be either a string or function.');
    return htmlElement;
}

export default class HtmlFormatter extends Formatter {

    static create(methodNameOpts?: Object = {}) {
        if (!IS_PROD) {
            console.warn('[Intl Format] HtmlFormatter static function `create` is deprecated, use the static `extend` function instead. This will be removed in a future version.');
        }

        return HtmlFormatter.extend(methodNameOpts);
    }

    static extend(methodNameOpts?: Object = {}) {

        class CustomFormatter extends HtmlFormatter {}

        formatterMethodNames.forEach(formatterMethodName => {
            const elementMethodName = formatterMethodName + 'Element';
            [formatterMethodName, elementMethodName].forEach(methodName => {
                const shortMethodName = methodNameOpts[methodName];
                if (typeof shortMethodName === 'string' && shortMethodName !== null) {
                    CustomFormatter.prototype[shortMethodName] = HtmlFormatter.prototype[methodName];
                }
            });
        });

        return CustomFormatter;
    }

    constructor(locale: string = 'en', options?: intlHtmlFormatOptionsType = {}) {
        super(locale, Object.assign({}, defaultOpts, options));

        // Assign the default html elements for each formatter
        this._htmlElements = formatterMethodNames.reduce((acc, fnName) => {
            if (fnName === 'plural') {
                return acc;
            }

            acc[fnName] = resolveRenderer(
                this.options.htmlElements[fnName],
                this.options.defaultHtmlElement);
            return acc;
        }, {});
    }

    _formatElement(fnName: string, value: mixed, options?: htmlElementOptions): mixed {
        const { tagName, ...opts } = options;
        return this.renderElement(
            tagName || this._htmlElements[fnName],
            value,
            { ...opts, formatterName: fnName });
    }

    _newInstance(locale: string, options?: intlFormatOptionsType = {}): Formatter {
        return new HtmlFormatter(locale, options);
    }

    // eslint-disable-next-line no-unused-vars
    renderElement(element: mixed, value: mixed, opts?: Object): mixed {
        const { htmlElementBuilderFactory, ...htmlOpts } = opts;

        if (typeof element === 'string') {
            const htmlElementBuilder = (htmlElementBuilderFactory || this.options.htmlElementBuilderFactory)();
            htmlElementBuilder.appendOpeningTag(element, htmlOpts);
            htmlElementBuilder.appendChildren(value, htmlOpts);
            htmlElementBuilder.appendClosingTag(element, htmlOpts);
            return htmlElementBuilder.build();
        }

        return element(value, htmlOpts);
    }

    messageElement(
        messageDescriptor: messageDescriptorType,
        values?: Object = {},
        options?: messageElementOptions = {}
    ): mixed
    {
        const { messageBuilderFactory, messageBuilderContextFactory, ...elementOpts } = options;
        const ctxFactory = messageBuilderContextFactory || this.options.htmlMessagebuilderContextFactory;
        return this._formatElement(
            'message',
            this.message(
                messageDescriptor,
                values, {
                    messageBuilderFactory: messageBuilderFactory || this.options.htmlMessageBuilderFactory,
                    messageBuilderContext: typeof ctxFactory === 'function' ?
                        ctxFactory(messageDescriptor.id) :
                        builderContextFactory()
                }),
            elementOpts
        );
    }

    htmlMessageElement(
        messageDescriptor: messageDescriptorType,
        values?: Object = {},
        options?: htmlMessageOptions = {}): mixed
    {
        return this._formatElement('htmlMessage', this.htmlMessage(messageDescriptor, values), options);
    }

    dateElement(value: any, options?: dateElementOptions = {}): mixed {
        const { tagName, ...fmtOpts } = options;
        return this._formatElement('date', this.date(value, fmtOpts), { tagName });
    }

    timeElement(value: any, options?: dateElementOptions = {}): mixed {
        const { tagName, ...fmtOpts } = options;
        return this._formatElement('time', this.time(value, fmtOpts), { tagName });
    }

    numberElement(value: any, options?: numberElementOptions = {}): mixed {
        const { tagName, ...fmtOpts } = options;
        return this._formatElement('number', this.number(value, fmtOpts), { tagName });
    }

    relativeElement(value: any, options?: relativeElementOptions = {}): mixed {
        const { tagName, ...fmtOpts } = options;
        return this._formatElement('relative', this.relative(value, fmtOpts), { tagName });
    }
}