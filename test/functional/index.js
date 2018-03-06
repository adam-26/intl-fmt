import * as p from 'path';
import buildTests from './support/build';

const builds = {
    'ES'      : p.resolve('lib/index.es.js'),
    'CJS'     : p.resolve('lib/index.js'),
    'UMD-dev' : p.resolve('dist/intl-format.js'),
    'UMD-prod': p.resolve('dist/intl-format.min.js'),
};

Object.keys(builds).forEach((name) => {
    describe(name, () => {
        buildTests(builds[name]);
    });
});
