import expect from 'expect';
import * as IntlFormat from '../../src/intl-format';
import * as IntlFormatWL from '../../src/index';

describe('intl-format-with-locales', () => {
    describe('exports', () => {
        it('has the same exports as "intl-format"', () => {
            Object.keys(IntlFormat).forEach((namedExport) => {
                expect(IntlFormatWL[namedExport]).toBe(IntlFormat[namedExport]);
            });
        });
    });
});
