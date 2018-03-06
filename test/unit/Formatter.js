// import expect, {createSpy, spyOn} from 'expect';
import IntlMessageFormat from 'tag-messageformat';
import IntlRelativeFormat from 'tag-relativeformat';
import IntlPluralFormat from '../../src/plural';
// import {intlFormatPropNames} from "../../src/utils";
import Formatter from '../../src/Formatter';

describe('Formatter', () => {
    // const IS_PROD = process.env.NODE_ENV === 'production';

    let config;

    beforeEach(() => {
        config = {
            locale: 'en',
            messages: {
                no_args: 'Hello, World!',
                with_arg: 'Hello, {name}!',
                with_html_no_args: 'Hello, <b>Bob</b>!',
                with_html: 'Hello, <b>{name}</b>!',
            },
            formats: {
                date: {
                    'year-only': {
                        year: 'numeric',
                    },
                    missing: undefined,
                },

                time: {
                    'hour-only': {
                        hour: '2-digit',
                        hour12: false,
                    },
                    missing: undefined,
                },

                relative: {
                    'seconds': {
                        units: 'second',
                    },
                    missing: undefined,
                },

                number: {
                    'percent': {
                        style: 'percent',
                        minimumFractionDigits: 2,
                    },
                    missing: undefined,
                },
            }
        };
    });

    describe('constructor', () => {
        it('accepts no args', () => {
            expect(new Formatter()).toBeDefined();
        });

        it('accepts single locale arg', () => {
            expect(new Formatter('en')).toBeDefined();
        });

        it('accepts locale options', () => {
            expect(new Formatter('en', { initialNow: 0 })).toBeDefined();
        });

        it('sets initialNow', () => {
            const fmt = new Formatter('en', { initialNow: 0 });
            expect(fmt.now()).toBe(0);
        });

        it('fall back to default locale when specified locale is invalid', () => {
            const fmt = new Formatter('__invalid__');
            expect(fmt.locale()).toBe('en');
        });

        it('should throw if textRenderer is not a function', () => {
            expect(() => new Formatter('en', { textRenderer: 0 }))
                .toThrow(/expects the `textRenderer` option to be a function/);
        });
    });

    describe('changeLocale', () => {
        let fmt;

        beforeEach(() => {
            const { locale, ...formatterOpts } = config;
            fmt = new Formatter(locale, formatterOpts);
        });

        it('should throw if locale not provided', () => {
            expect(() => fmt.changeLocale()).toBeDefined();
        });

        it('should change the current locale', () => {
            const newFmt = fmt.changeLocale('ja');
            expect(newFmt.locale()).toBe('ja');
        });

        it('should set same initialNow value', () => {
            const newFmt = fmt.changeLocale('en', { initialNow: 1 });
            expect(newFmt.now()).toBe(1);
        });

        it('should set same requireOther value', () => {
            const newFmt = fmt.changeLocale('en');
            expect(newFmt._config.requireOther).toEqual(fmt._config.requireOther);
        });

        it('should set same textComponent value', () => {
            const newFmt = fmt.changeLocale('en');
            expect(newFmt._config.textComponent).toEqual(fmt._config.textComponent);
        });

        it('should set same textRenderer value', () => {
            const newFmt = fmt.changeLocale('en');
            expect(newFmt._config.textRenderer).toEqual(fmt._config.textRenderer);
        });

        it('should assign current messages if no new messages assigned', () => {
            const newFmt = fmt.changeLocale('en');
            expect(newFmt._config.messages).toEqual(fmt._config.messages);
        });

        it('should assign new messages', () => {
            const newFmt = fmt.changeLocale('en', { messages: {} });
            expect(newFmt._config.messages).not.toEqual(fmt._config.messages);
        });
    });

    describe('setNow', () => {
        let fmt;

        beforeEach(() => {
            const { locale, ...formatterOpts } = config;
            fmt = new Formatter(locale, formatterOpts);
        });

        it('should assign the assigned value', () => {
            fmt.setNow(1);
            expect(fmt.now()).toBe(1);
        });

        it('should set to now', (done) => {
            const currentNow = fmt.now();
            setTimeout(() => {
                fmt.setNow();
                expect(currentNow).not.toBe(fmt.now());
                done();
            }, 500);
        });
    });

    describe('format', () => {
        let fmt;

        beforeEach(() => {
            const { locale, ...formatterOpts } = config;
            fmt = new Formatter(locale, formatterOpts);
        });

        describe('date()', () => {
            let df;

            beforeEach(() => {
                df = new Intl.DateTimeFormat(config.locale);
            });

            it('formats a date', () => {
                const timestamp = Date.now();
                expect(fmt.date(timestamp)).toBe(df.format(timestamp));
            });

            it('formats a date with options', () => {
                const date   = new Date();
                const format = 'year-only';

                const {locale, formats} = config;
                df = new Intl.DateTimeFormat(locale, formats.date[format]);

                expect(fmt.date(date, {format})).toBe(df.format(date));
            });
        });

        describe('time()', () => {
            let df;

            beforeEach(() => {
                df = new Intl.DateTimeFormat(config.locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                });
            });

            it('formats a time', () => {
                const timestamp = Date.now();
                expect(fmt.time(timestamp)).toBe(df.format(timestamp));
            });

            it('formats a time with options', () => {
                const date   = new Date();
                const format = 'hour-only';

                const {locale, formats} = config;
                df = new Intl.DateTimeFormat(locale, formats.time[format]);

                expect(fmt.time(date, {format})).toBe(df.format(date));
            });
        });

        describe('relative()', () => {
            let now;
            let rf;

            beforeEach(() => {
                now = new Date().getTime();
                rf = new IntlRelativeFormat(config.locale);
            });

            it('formats relative values', () => {
                expect(fmt.relative(new Date(0))).toBe(rf.format(new Date(0), {now}));
            });

            it('formats relative values with options', () => {
                const date   = -(1000 * 120);
                const format = 'seconds';

                const {locale, formats} = config;
                rf = new IntlRelativeFormat(locale, formats.relative[format]);

                expect(fmt.relative(date, {format})).toBe(rf.format(date, {now}));
            });
        });

        describe('number()', () => {
            let nf;

            beforeEach(() => {
                nf = new Intl.NumberFormat(config.locale);
            });

            it('formats a number', () => {
                expect(fmt.number(1000)).toBe(nf.format(1000));
            });

            it('formats a number with options', () => {
                const num    = 0.505;
                const format = 'percent';

                const {locale, formats} = config;
                nf = new Intl.NumberFormat(locale, formats.number[format]);

                expect(fmt.number(num, {format})).toBe(nf.format(num));
            });
        });

        describe('plural()', () => {
            let pf;

            beforeEach(() => {
                pf = new IntlPluralFormat(config.locale);
            });

            it('formats a plural value', () => {
                expect(fmt.plural(0)).toBe(pf.format(0));
            });

            it('formats a plural value with options', () => {
                const opts = {style: 'ordinal'};
                pf = new IntlPluralFormat(config.locale, opts);

                expect(fmt.plural(22, opts)).toBe(pf.format(22));
            });
        });

        describe('message()', () => {
            it('formats a message', () => {
                const {locale, messages} = config;
                const mf = new IntlMessageFormat(messages.no_args, locale);

                expect(fmt.message({id: 'no_args'})).toBe(mf.format());
            });

            it('formats a message with values', () => {
                const {locale, messages} = config;
                const mf = new IntlMessageFormat(messages.with_arg, locale);
                const values = {name: 'Eric'};

                expect(fmt.message({id: 'with_arg'}, values)).toBe(mf.format(values));
            });

            it('formats a message using custom textRenderer', () => {
                const {locale, ...opts } = config;
                const renderFn = jest.fn((txt) => `!${txt}!`);
                fmt = new Formatter(locale, {...opts, textRenderer: renderFn });

                expect(fmt.message({id: 'no_args'})).toBe(`!${opts.messages.no_args}!`);
                expect(renderFn.mock.calls).toHaveLength(1);
            });

            it('formats a message using custom textComponent', () => {
                const {locale, ...opts } = config;
                fmt = new Formatter(locale, {...opts, textComponent: 'span' });

                expect(fmt.message({id: 'no_args'})).toBe(`<span>${opts.messages.no_args}</span>`);
            });
        });

        describe('htmlMessage()', () => {
            it('formats a HTML messages', () => {
                const {locale, messages} = config;
                const mf = new IntlMessageFormat(messages.with_html_no_args, locale);

                expect(fmt.htmlMessage({id: 'with_html_no_args'})).toBe(mf.format());
            });

            it('formats a HTML message with values', () => {
                const {locale, messages} = config;
                const mf = new IntlMessageFormat(messages.with_html, locale);
                const values = {name: '<i>Eric</i>'};
                const escapedValues = {name: '&lt;i&gt;Eric&lt;/i&gt;'};

                expect(fmt.htmlMessage({id: 'with_html'}, values)).toBe(mf.format(escapedValues));
            });
        });
    });
});
