import expect from 'expect';
import * as IntlFormat from '../../src/intl-format';

describe('intl-format', () => {
    describe('exports', () => {
        it('exports `addLocaleData`', () => {
            expect(IntlFormat.addLocaleData).toBeA('function');
        });

        it('exports `defineMessages`', () => {
            expect(IntlFormat.defineMessages).toBeA('function');
        });

        it('exports `Formatter`', () => {
            expect(IntlFormat.Formatter).toBeA('function');
        });
    });
});
