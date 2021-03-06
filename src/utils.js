/*
HTML escaping and shallow-equals implementations are the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/

import {BuilderContext} from 'tag-messageformat';

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

export function builderContextFactory() {
    return new BuilderContext();
}

export function filterProps(props, whitelist, defaults = {}) {
  return whitelist.reduce((filtered, name) => {
    if (props.hasOwnProperty(name) && typeof props[name] !== 'undefined') {
      filtered[name] = props[name];
    } else if (defaults.hasOwnProperty(name) && typeof defaults[name] !== 'undefined') {
      filtered[name] = defaults[name];
    }

    return filtered;
  }, {});
}

export function defaultErrorHandler(msg, exception) {
    const errMsg = exception ? `\n${exception}` : '';
    console.error(`[Intl Format] ${msg}${errMsg}`);
}

export const formatterMethodNames = [
    'date',
    'time',
    'relative',
    'number',
    'plural',
    'message',
    'htmlMessage'
];

export const dateTimeFormatPropNames = [
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
  'style',
  'units'
];

export const pluralFormatPropNames = [
  'style'
];
