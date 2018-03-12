/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import defaultLocaleData from './en';
import {addLocaleData} from './locale-data-registry';
import {default as defineMessages} from './define-messages';
import {default as Formatter} from './Formatter';
import {default as HtmlFormatter, HtmlElementBuilder} from './HtmlFormatter';
import {
    StringBuilderFactory,
    ArrayBuilderFactory,
    BuilderContext,
    StringFormat,
    StringFormatFactory
} from 'tag-messageformat';

addLocaleData(defaultLocaleData);

export {
    Formatter,
    HtmlFormatter,
    addLocaleData,
    defineMessages,
    StringBuilderFactory,
    ArrayBuilderFactory,
    BuilderContext,
    StringFormat,
    StringFormatFactory,
    HtmlElementBuilder
};

export default Formatter;
