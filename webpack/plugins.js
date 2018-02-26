const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({ production = false } = {}) => {
  const plugins = [
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'GOOGLE_OAUTH_TOKEN']),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ];
  if (!production) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve('tsconfig.webpack.json'),
        watch: ['../app'],
      }),
    );
  } else {
    plugins.push(
      new ExtractTextPlugin({
        allChunks: true,
        filename: 'styles/main.css',
      }),
      new CopyWebpackPlugin([
        { from: 'assets' },
        {
          from: '../server/models/knexfile.js',
          to: '../server-compiled/server/models/knexfile.js',
        },
        {
          from: '../server/graphql/schema.graphql',
          to: '../server-compiled/server/graphql/schema.graphql',
        },
        {
          from: '../server/handlers/pdf/fonts',
          to: '../server-compiled/server/handlers/pdf/fonts',
        },
      ]),
      new UglifyJsPlugin({
        exclude: /node_modules/,
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
          ecma: 8,
          warnings: true,
          mangle: true,
        },
      }),
    );
  }
  return plugins;
};
