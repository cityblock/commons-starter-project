const image = require('./image');
const typescript = require('./typescript');
const css = require('./css');
const graphql = require('./graphql');

module.exports = ({ production = false } = {}) => [
  graphql(),
  {
    test: /\.tsx?$/,
    loader: 'lodash-ts-imports-loader',
    exclude: /node_modules/,
    enforce: 'pre',
  },
  typescript(),
  css({ production }),
  image(),
  {
    test: /\.json$/,
    loader: 'json-loader',
  },
];
