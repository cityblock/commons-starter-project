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
  ];
  if (!production) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({ tsconfig: path.resolve('tsconfig.webpack.json') }),
      new webpack.NoEmitOnErrorsPlugin(),
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
        sourceMap: true,
        uglifyOptions: { ecma: 6 },
      }),
    );
  }
  return plugins;
};
