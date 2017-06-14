const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader")
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = ({ production = false } = {}) => {
  if (!production) {
    return [
      new CheckerPlugin(),
      new webpack.EnvironmentPlugin(["NODE_ENV", "GOOGLE_OAUTH_TOKEN"]),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    ];
  }
  if (production) {
    return [
      new CheckerPlugin(),
      new webpack.EnvironmentPlugin(["NODE_ENV", "GOOGLE_OAUTH_TOKEN"]),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new ExtractTextPlugin({
        filename: "styles/main.css",
        allChunks: true
      }),
      new CopyWebpackPlugin([
        { from: 'assets' },
      ]),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    ];
  }
  return [];
};

/**
 * weirdly not working with es6
 * new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: true,
      }),
 */