import {ArrayBuilderFactory} from 'tag-messageformat';
import HtmlFormatter from '../../src/HtmlFormatter';

describe('HtmlFormatter', () => {
    let config;

    beforeEach(() => {
        config = {
            locale: 'en',
            messages: {
                no_args: 'Hello, World!'
            },
        };
    });

    describe('constructor', () => {
        it('should throw if defaultHtmlElement is not a function or string', () => {
            expect(() => new HtmlFormatter('en', { defaultHtmlElement: 0 }))
                .toThrow(/must be either a string or function/);

            expect(() => new HtmlFormatter('en', { defaultHtmlElement: new Date() }))
                .toThrow(/must be either a string or function/);

            expect(() => new HtmlFormatter('en', { defaultHtmlElement: {} }))
                .toThrow(/must be either a string or function/);

            expect(() => new HtmlFormatter('en', { defaultHtmlElement: [] }))
                .toThrow(/must be either a string or function/);
        });
    });

    describe('get options()', () => {
        it('should return formatter options', () => {
            const opts = {
                formats: {},
                messages: {}
            };
            const fmt = new HtmlFormatter('af', opts);
            expect(Object.keys(fmt.options)).toHaveLength(15);
        });
    });

    describe('format', () => {
        let fmt;

        describe('`htmlMessageBuilderFactory` option', () => {

            function HtmlElementArrayBuilder() {
                this._elements = [];
            }

            HtmlElementArrayBuilder.prototype.append = function (value) {
                this._elements.push(value);
            };

            HtmlElementArrayBuilder.prototype.appendOpeningTag = function (tagName) {
                this.append(`<${tagName}>`);
            };

            HtmlElementArrayBuilder.prototype.appendClosingTag = function (tagName) {
                this.append(`</${tagName}>`);
            };

            HtmlElementArrayBuilder.prototype.appendChildren = function (value) {
                this.append(value);
            };

            HtmlElementArrayBuilder.prototype.build = function () {
                return this._elements;
            };

            function HtmlElementArrayBuilderFactory() {
                return new HtmlElementArrayBuilder();
            }

            it('formats a message using the default message builder', () => {
                const fmt = new HtmlFormatter('en', {
                    messages: config.messages,
                    htmlElementBuilderFactory: HtmlElementArrayBuilderFactory,
                    htmlMessageBuilderFactory: ArrayBuilderFactory
                });

                expect(fmt.messageElement({id: 'no_args'})).toEqual(['<span>', [config.messages.no_args], '</span>']);
            });

            it('formats a message using a custom message builder', () => {
                const fmt = new HtmlFormatter('en', { messages: config.messages });

                expect(fmt.messageElement({id: 'no_args'}, {}, {
                    htmlElementBuilderFactory: HtmlElementArrayBuilderFactory,
                    messageBuilderFactory: ArrayBuilderFactory
                })).toEqual(['<span>', [config.messages.no_args], '</span>']);
            });
        });

        describe('`defaultHtmlElement` function option', () => {
            let renderMethodFn;

            beforeEach(() => {
                renderMethodFn = jest.fn((txt) => `!${txt}!`);
                const { locale, ...formatterOpts } = config;
                fmt = new HtmlFormatter(locale, {...formatterOpts,
                    defaultHtmlElement: renderMethodFn
                });
            });

            it('formats a message', () => {
                expect(fmt.messageElement({id: 'no_args'})).toBe(`!${config.messages.no_args}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a htmlMessage', () => {
                expect(fmt.htmlMessageElement({id: 'no_args'})).toBe(`!${config.messages.no_args}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a date', () => {
                const df = new Intl.DateTimeFormat(config.locale);
                const now = new Date().getTime();

                expect(fmt.dateElement(now)).toBe(`!${df.format(now)}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a time', () => {
                const df = new Intl.DateTimeFormat(config.locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const now = new Date().getTime();

                expect(fmt.timeElement(now)).toBe(`!${df.format(now)}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a relative value', () => {
                const now = new Date().getTime();
                expect(fmt.relativeElement(now)).toBe(`!now!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a number', () => {
                expect(fmt.numberElement(1)).toBe(`!1!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });
        });

        describe('`htmlElements.*` function options', () => {
            let renderMethodFn;

            beforeEach(() => {
                renderMethodFn = jest.fn((txt) => `!${txt}!`);
                const { locale, ...formatterOpts } = config;
                fmt = new HtmlFormatter(locale, {...formatterOpts,
                    htmlElements: {
                        message: renderMethodFn,
                        htmlMessage: renderMethodFn,
                        date: renderMethodFn,
                        time: renderMethodFn,
                        number: renderMethodFn,
                        relative: renderMethodFn,
                    }
                });
            });

            it('formats a message', () => {
                expect(fmt.messageElement({id: 'no_args'})).toBe(`!${config.messages.no_args}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a htmlMessage', () => {
                expect(fmt.htmlMessageElement({id: 'no_args'})).toBe(`!${config.messages.no_args}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a date', () => {
                const df = new Intl.DateTimeFormat(config.locale);
                const now = new Date().getTime();

                expect(fmt.dateElement(now)).toBe(`!${df.format(now)}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a time', () => {
                const df = new Intl.DateTimeFormat(config.locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const now = new Date().getTime();

                expect(fmt.timeElement(now)).toBe(`!${df.format(now)}!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a relative value', () => {
                const now = new Date().getTime();
                expect(fmt.relativeElement(now)).toBe(`!now!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });

            it('formats a number', () => {
                expect(fmt.numberElement(1)).toBe(`!1!`);
                expect(renderMethodFn.mock.calls).toHaveLength(1);
            });
        });

        describe('`defaultHtmlElement` string option', () => {
            beforeEach(() => {
                const { locale, ...formatterOpts } = config;
                fmt = new HtmlFormatter(locale, {...formatterOpts,
                    defaultHtmlElement: 'span'
                });
            });

            it('formats a message', () => {
                expect(fmt.messageElement({id: 'no_args'})).toBe(`<span>${config.messages.no_args}</span>`);
            });

            it('formats a htmlMessage', () => {
                expect(fmt.htmlMessageElement({id: 'no_args'})).toBe(`<span>${config.messages.no_args}</span>`);
            });

            it('formats a date', () => {
                const df = new Intl.DateTimeFormat(config.locale);
                const now = new Date().getTime();

                expect(fmt.dateElement(now)).toBe(`<span>${df.format(now)}</span>`);
            });

            it('formats a time', () => {
                const df = new Intl.DateTimeFormat(config.locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const now = new Date().getTime();

                expect(fmt.timeElement(now)).toBe(`<span>${df.format(now)}</span>`);
            });

            it('formats a relative value', () => {
                const now = new Date().getTime();
                expect(fmt.relativeElement(now)).toBe(`<span>now</span>`);
            });

            it('formats a number', () => {
                expect(fmt.numberElement(1)).toBe(`<span>1</span>`);
            });
        });

        describe('`htmlElements.*` string options', () => {
            beforeEach(() => {
                const { locale, ...formatterOpts } = config;
                fmt = new HtmlFormatter(locale, {...formatterOpts,
                    htmlElements: {
                        message: 'span',
                        htmlMessage: 'span',
                        date: 'span',
                        time: 'span',
                        number: 'span',
                        relative: 'span',
                    }
                });
            });

            it('formats a message', () => {
                expect(fmt.messageElement({id: 'no_args'})).toBe(`<span>${config.messages.no_args}</span>`);
            });

            it('formats a htmlMessage', () => {
                expect(fmt.htmlMessageElement({id: 'no_args'})).toBe(`<span>${config.messages.no_args}</span>`);
            });

            it('formats a date', () => {
                const df = new Intl.DateTimeFormat(config.locale);
                const now = new Date().getTime();

                expect(fmt.dateElement(now)).toBe(`<span>${df.format(now)}</span>`);
            });

            it('formats a time', () => {
                const df = new Intl.DateTimeFormat(config.locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const now = new Date().getTime();

                expect(fmt.timeElement(now)).toBe(`<span>${df.format(now)}</span>`);
            });

            it('formats a relative value', () => {
                const now = new Date().getTime();
                expect(fmt.relativeElement(now)).toBe(`<span>now</span>`);
            });

            it('formats a number', () => {
                expect(fmt.numberElement(1)).toBe(`<span>1</span>`);
            });
        });
    });

    describe('create', () => {
        it('should create a new Formatter class', () => {
            const { locale } = config;
            const now = new Date().getTime();
            const CustomFormatter = HtmlFormatter.create(); // default opts
            const customFormatter = new CustomFormatter(locale, config);

            expect(customFormatter.m).toBeDefined();
            expect(customFormatter.m({id: 'no_args'})).toBe(customFormatter.message({id: 'no_args'}));

            expect(customFormatter.me).toBeDefined();
            expect(customFormatter.me({id: 'no_args'})).toBe(customFormatter.messageElement({id: 'no_args'}));

            expect(customFormatter.h).toBeDefined();
            expect(customFormatter.h({id: 'no_args'})).toBe(customFormatter.htmlMessage({id: 'no_args'}));

            expect(customFormatter.he).toBeDefined();
            expect(customFormatter.he({id: 'no_args'})).toBe(customFormatter.htmlMessageElement({id: 'no_args'}));

            expect(customFormatter.d).toBeDefined();
            expect(customFormatter.d(now)).toBe(customFormatter.date(now));

            expect(customFormatter.de).toBeDefined();
            expect(customFormatter.de(now)).toBe(customFormatter.dateElement(now));

            expect(customFormatter.t).toBeDefined();
            expect(customFormatter.t(now)).toBe(customFormatter.time(now));

            expect(customFormatter.te).toBeDefined();
            expect(customFormatter.te(now)).toBe(customFormatter.timeElement(now));

            expect(customFormatter.n).toBeDefined();
            expect(customFormatter.n(0)).toBe(customFormatter.number(0));

            expect(customFormatter.ne).toBeDefined();
            expect(customFormatter.ne(0)).toBe(customFormatter.numberElement(0));

            expect(customFormatter.r).toBeDefined();
            expect(customFormatter.r(0)).toBe(customFormatter.relative(0));

            expect(customFormatter.re).toBeDefined();
            expect(customFormatter.re(0)).toBe(customFormatter.relativeElement(0));

            expect(customFormatter.p).toBeDefined();
            expect(customFormatter.p(1)).toBe(customFormatter.plural(1));
        });
    });
});
