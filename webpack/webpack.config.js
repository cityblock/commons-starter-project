/**
 * webpack.config.js
 *
 * process.env.NODE_ENV is used to determine to return production config or not
 * env is a string passed by "webpack --env" on command line or calling this function directly
 *
 */
const dotenv = require('dotenv');
const fs = require('fs');
const PATHS = require('./paths');
const rules = require('./rules');
const plugins = require('./plugins');
const resolve = require('./resolve');
const typescript = require('./rules/typescript');

module.exports = (env = '') => {
  dotenv.config();

  const isProduction = process.env.NODE_ENV === 'production';

  const node = {
    __dirname: true,
    __filename: true,
  };

  const devtool = isProduction ? 'cheap-source-map' : 'cheap-module-eval-source-map';
  const app = ['./client'];
  const clientRender = {
    context: PATHS.app,
    entry: {
      app,
    },
    module: { rules: rules({ production: isProduction }) },
    node,
    output: {
      filename: '[name].js',
      chunkFilename: '[name].bundle.js',
      path: PATHS.assets,
      publicPath: PATHS.public,
    },
    plugins: plugins({ production: isProduction }),
    resolve,
    target: 'web',
  };

  return [clientRender];
};
