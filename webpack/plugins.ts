import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';

export default ({ isProduction = false } = {}) => {
  const plugins = [new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)];
  if (!isProduction) {
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
        filename: 'styles/main.[hash].css',
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
