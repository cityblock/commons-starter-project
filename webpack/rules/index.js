const image = require('./image');
const typescript = require('./typescript');
const css = require('./css');
const graphql = require('./graphql');

module.exports = ({ production = false } = {}) => [
  graphql(),
  typescript(),
  css({ production }),
  image(),
  {
    test: /\.json$/,
    loader: 'json-loader',
  },
];
