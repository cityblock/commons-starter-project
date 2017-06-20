const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = ({ production = false } = {}) => {
  if (!production) {
    return [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.EnvironmentPlugin(["NODE_ENV", "GOOGLE_OAUTH_TOKEN"]),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.NamedModulesPlugin(),
      new ForkTsCheckerWebpackPlugin({ tsconfig: path.resolve('tsconfig.webpack.json') }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ];
  }
  if (production) {
    return [
      new webpack.EnvironmentPlugin(["NODE_ENV", "GOOGLE_OAUTH_TOKEN"]),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ExtractTextPlugin({
        allChunks: true,
        filename: "styles/main.css",
      }),
      new CopyWebpackPlugin([
        { from: "assets" },
        { from: "../server/models/knexfile.js", to: "../server-compiled/models/knexfile.js" },
        { from: "../server/graphql/schema.graphql", to: "../server-compiled/graphql/schema.graphql" },
      ]),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: true,
      }),
    ];
  }
  return [];
};
