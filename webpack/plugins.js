const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({ production = false } = {}) => {
  const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'GOOGLE_OAUTH_TOKEN']),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ];
  if (!production) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({ tsconfig: path.resolve('tsconfig.webpack.json') }),
      new webpack.HotModuleReplacementPlugin(),
    );
  } else {
    plugins.push(
      new webpack.EnvironmentPlugin(['NODE_ENV', 'GOOGLE_OAUTH_TOKEN']),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin({
        allChunks: true,
        filename: 'styles/main.css',
      }),
      new CopyWebpackPlugin([
        { from: 'assets' },
        { from: '../server/models/knexfile.js', to: '../server-compiled/models/knexfile.js' },
        {
          from: '../server/graphql/schema.graphql',
          to: '../server-compiled/graphql/schema.graphql',
        },
      ]),
      new UglifyJSPlugin({
        exclude: /node_modules/,
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
          ie8: false,
          ecma: 8,
          warnings: false,
          mangle: true,
          compress: {
            ecma: 8,
            dead_code: true,
          },
        },
      }),
    );
  }
  return plugins;
};
