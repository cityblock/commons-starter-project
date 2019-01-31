const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = ({ production = false } = {}) => {
  const plugins = [new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)];
  if (!production) {
    plugins.push(
      new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
      new webpack.HotModuleReplacementPlugin(),
      new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        tsconfig: path.resolve('tsconfig.webpack.json'),
        watch: ['../app'],
      }),
    );
  } else {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'styles/main.css',
      }),
      new CopyWebpackPlugin([
        { from: 'assets' },
        {
          from: '../server/graphql/schema.graphql',
          to: '../server-compiled/server/graphql/schema.graphql',
        },
      ]),
    );
  }
  return plugins;
};
