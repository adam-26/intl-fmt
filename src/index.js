/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import allLocaleData from '../locale-data/index';
import { Formatter, addLocaleData, defineMessages } from './intl-format';

export {
    addLocaleData,
    defineMessages,
    Formatter
};

export default Formatter; // TODO: How to export a default in the browser w/out rediculous names?

addLocaleData(allLocaleData);
