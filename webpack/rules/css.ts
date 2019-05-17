import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PATHS from '../paths';

const postcssPresetEnv = require('postcss-preset-env');
const postcssReporter = require('postcss-reporter');

export default ({ production = false } = {}) => {
  const localIdentName = '[name]-[local]-[hash:base64:6]';

  const createCssLoaders = () => [
    {
      loader: 'typings-for-css-modules-loader',
      options: {
        importLoaders: 1,
        localIdentName,
        modules: true,
        namedExport: true,
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          postcssPresetEnv({ browsers: ['last 2 Chrome versions'] }),
          // cssnano in prod and reporter (for errors) in dev
          postcssReporter({ clearMessages: true }),
        ],
      },
    },
  ];

  const createBrowserLoaders = (extractCssToFile: any) => (loaders: any) => {
    if (extractCssToFile) {
      return [MiniCssExtractPlugin.loader, ...loaders];
    }
    return [{ loader: 'style-loader' }, ...loaders];
  };

  return {
    include: PATHS.app,
    test: /\.css$/,
    use: createBrowserLoaders(production)(createCssLoaders()),
  };
};
