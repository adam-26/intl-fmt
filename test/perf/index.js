/* eslint prefer-arrow-callback:0 */

import 'intl';
import {Suite} from 'benchmark';
import IntlFormat from '../../lib';

const suite = new Suite('renderToString', {
    onCycle: function (e) {
        console.log(String(e.target));
    },
});

suite.on('error', function (e) {
    throw e.target.error;
});

const intlFormat = new IntlFormat({locale: 'en'});

suite.add('100 x `number()`', function () {
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.number(i);
    }
});

suite.add('100 x `date()`', function () {
    let now = Date.now();
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.date(now - (1000 * 60 * i));
    }
});

suite.add('100 x `message()`', function () {
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.message({ id: i, defaultMessage: `message ${i}` });
    }
});

suite.add('100 x `message()` with placeholder', function () {
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.message({ id: i, defaultMessage: `message {${i}, number}` }, {[i]: i});
    }
});

suite.add('100 x `message()` with placeholder, cached', function () {
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.message({ id: i, defaultMessage: `message {${0}, number}` }, {0: i});
    }
});

suite.add('100 x `relative()`', function () {
    let now = Date.now();
    for (let i = 0, len = 100; i < len; i += 1) {
        intlFormat.relative(now - (1000 * 60 * i));
    }
});

suite.run();
