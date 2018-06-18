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

  const devtool = isProduction ? '(none)' : 'inline-source-map';
  const app = './client.tsx';
  return {
    context: PATHS.app,
    devtool,
    entry: {
      app,
    },
    mode: isProduction ? 'production' : 'development',
    module: { rules: rules({ production: isProduction }) },
    node,
    output: {
      chunkFilename: '[name].bundle.js',
      filename: '[name].js',
      path: PATHS.assets,
      pathinfo: false, // https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
      publicPath: PATHS.public,
    },
    plugins: plugins({ production: isProduction }),
    resolve,
    target: 'web',
  };
};
