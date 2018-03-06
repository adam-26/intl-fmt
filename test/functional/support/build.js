import expect from 'expect';
import * as IntlFormat from '../../../src/';

export default function (buildPath) {
    describe('build', () => {
        it('evaluates', () => {
            expect(require(buildPath)).toExist();
        });

        it('has all Intl Format exports', () => {
            const IntlFormatBuild = require(buildPath);

            Object.keys(IntlFormat).forEach((name) => {
                expect(IntlFormatBuild[name]).toBeA(typeof IntlFormat[name]);
            });
        });
    });
}
