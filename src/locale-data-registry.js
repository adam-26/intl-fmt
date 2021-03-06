/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import TagMessageFormat from 'tag-messageformat';
import TagRelativeFormat from 'tag-relativeformat';

export function addLocaleData(data = []) {
  let locales = Array.isArray(data) ? data : [data];

  locales.forEach(localeData => {
    if (localeData && localeData.locale) {
      TagMessageFormat.__addLocaleData(localeData);
      TagRelativeFormat.__addLocaleData(localeData);
    }
  });
}

export function hasLocaleData(locale) {
  let localeParts = (locale || '').split('-');

  while (localeParts.length > 0) {
    if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
      return true;
    }

    localeParts.pop();
  }

  return false;
}

function hasIMFAndIRFLocaleData(locale) {
  let normalizedLocale = locale && locale.toLowerCase();

  return !!(
    TagMessageFormat.__localeData__[normalizedLocale] &&
    TagRelativeFormat.__localeData__[normalizedLocale]
  );
}
