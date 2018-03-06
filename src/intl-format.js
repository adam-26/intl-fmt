/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import defaultLocaleData from './en';
import {addLocaleData} from './locale-data-registry';
import {default as defineMessages} from './define-messages';
import { default as Formatter } from './Formatter';

addLocaleData(defaultLocaleData);

export {
    addLocaleData,
    defineMessages,
    Formatter
};

export default Formatter;

// export {default as defineMessages} from './define-messages';
// export { default as Formatter } from './intlFormat'; // TODO: Naming? does it need to be consistent?


// TODO: Also Export SHORTHAND names (include longer names for compatibility)
// ie: IntlFmt.message()
// ie: IntlFmt.date()

// TODO: Remove all components
// export {intlShape} from './types';
// export {default as injectIntl} from './inject';

// export {default as IntlProvider} from './components/provider';
// export {default as FormattedDate} from './components/date';
// export {default as FormattedTime} from './components/time';
// export {default as FormattedRelative} from './components/relative';
// export {default as FormattedNumber} from './components/number';
// export {default as FormattedPlural} from './components/plural';
// export {default as FormattedMessage} from './components/message';
// export {default as FormattedHTMLMessage} from './components/html-message';
