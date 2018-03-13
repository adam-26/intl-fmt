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
import {builderContextFactory} from './utils';
import {
    BuilderContext,
    StringFormat,
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory
} from 'tag-messageformat';

addLocaleData(defaultLocaleData);

export {
    Formatter,
    HtmlFormatter,
    HtmlElementBuilder,
    BuilderContext,
    StringFormat,
    addLocaleData,
    defineMessages,
    stringBuilderFactory,
    arrayBuilderFactory,
    stringFormatFactory,
    builderContextFactory
};

export default Formatter;
