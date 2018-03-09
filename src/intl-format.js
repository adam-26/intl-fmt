/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import {StringBuilderFactory, ArrayBuilderFactory} from 'tag-messageformat';
import defaultLocaleData from './en';
import {addLocaleData} from './locale-data-registry';
import {default as defineMessages} from './define-messages';
import { default as Formatter } from './Formatter';
import { default as HtmlFormatter, HtmlElementBuilder } from './HtmlFormatter';

addLocaleData(defaultLocaleData);

export {
    addLocaleData,
    defineMessages,
    Formatter,
    StringBuilderFactory,
    ArrayBuilderFactory,
    HtmlElementBuilder,
    HtmlFormatter
};

export default Formatter;
