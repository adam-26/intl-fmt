import * as p from 'path';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const isProduction = process.env.NODE_ENV === 'production';

const copyright = `/*
 * Copyright ${new Date().getFullYear()}, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
`;

export default {
  input: p.resolve('src/intl-format.js'),
  output: {
    file: p.resolve(`dist/intl-format.${isProduction ? 'min.js' : 'js'}`),
    format: 'umd',
  },
  name: 'IntlFormat',
  banner: copyright,
  exports: 'named',
  sourcemap: true,
  external: [],
  plugins: [
    babel(),
    nodeResolve({
      jsnext: true,
    }),
    commonjs({
      sourcemap: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isProduction &&
      uglify({
        warnings: false,
      }),
  ].filter(Boolean),
};
