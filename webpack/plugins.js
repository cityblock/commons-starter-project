const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader")

module.exports = ({ production = false } = {}) => {
  if (!production) {
    return [
      new CheckerPlugin(),
      new webpack.EnvironmentPlugin(["NODE_ENV"]),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    ];
  }
  if (production) {
    return [
      new CheckerPlugin(),
      new webpack.EnvironmentPlugin(["NODE_ENV"]),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new ExtractTextPlugin({
        filename: "styles/main.css",
        allChunks: true
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: true,
      }),
    ];
  }
  return [];
};
