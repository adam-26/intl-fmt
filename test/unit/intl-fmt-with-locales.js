import expect from 'expect';
import * as IntlFormat from '../../src/intl-fmt';
import * as IntlFormatWL from '../../src/index';

describe('intl-fmt-with-locales', () => {
    describe('exports', () => {
        it('has the same exports as "intl-fmt"', () => {
            Object.keys(IntlFormat).forEach((namedExport) => {
                expect(IntlFormatWL[namedExport]).toBe(IntlFormat[namedExport]);
            });
        });
    });
});
