/*
HTML escaping and shallow-equals implementations are the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/

const ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const UNSAFE_CHARS_REGEX = /[&><"']/g;

export function escape(str) {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, match => ESCAPED_CHARS[match]);
}

export function filterProps(props, whitelist, defaults = {}) {
  return whitelist.reduce((filtered, name) => {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults.hasOwnProperty(name)) {
      filtered[name] = defaults[name];
    }

    return filtered;
  }, {});
}

export function defaultErrorHandler(msg, exception) {
    const errMsg = exception ? `\n${exception}` : '';
    console.error(`[Intl Format] ${msg}${errMsg}`);
}

export const shortIntlFuncNames = [
    'date',
    'time',
    'relative',
    'number',
    'plural',
    'message',
    'htmlMessage'
];

export const intlFormatPropNames = [
    'formatDate',
    'formatTime',
    'formatRelative',
    'formatNumber',
    'formatPlural',
    'formatMessage',
    'formatHTMLMessage'
];

export const dateTimeFormatPropNames = [
  'format',
  'localeMatcher',
  'formatMatcher',
  'timeZone',
  'hour12',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName'
];

export const numberFormatPropNames = [
  'format',
  'localeMatcher',
  'style',
  'currency',
  'currencyDisplay',
  'useGrouping',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits'
];

export const relativeFormatPropNames = [
  'format',
  'style',
  'units'
];

export const pluralFormatPropNames = [
  'style'
];
