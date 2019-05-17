/**
 * process.env.NODE_ENV is used to determine to return production config or not
 * env is a string passed by "webpack --env" on command line or calling this function directly
 *
 */
import dotenv from 'dotenv';
import webpack from 'webpack';
import PATHS from './paths';
import plugins from './plugins';
import resolve from './resolve';
import rules from './rules';

const getConfig = () => {
  dotenv.config();

  const isProduction = process.env.NODE_ENV === 'production';

  const node = {
    __dirname: true,
    __filename: true,
  };

  const devtool = isProduction ? false : 'inline-source-map';
  const app = './client.tsx';
  const config: webpack.Configuration = {
    context: PATHS.app,
    devtool,
    entry: {
      app,
    },
    mode: isProduction ? 'production' : 'development',
    module: { rules: rules({ production: isProduction }) },
    node,
    output: {
      chunkFilename: isProduction ? '[name].[hash].bundle.js' : '[name].bundle.js',
      filename: isProduction ? '[name].[hash].js' : '[name].js',
      path: PATHS.assets,
      pathinfo: false, // https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
      publicPath: PATHS.public,
    },
    plugins: plugins({ isProduction }),
    resolve,
    target: 'web',
  };
  return config;
};

export default getConfig();
