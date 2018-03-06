const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssCssnext = require('postcss-cssnext');
const postcssReporter = require('postcss-reporter');
const cssnano = require('cssnano');
const PATHS = require('../paths');

module.exports = ({ production = false } = {}) => {
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
          postcssCssnext({ browsers: ['last 2 Chrome versions'], warnForDuplicates: false }),
          // cssnano in prod and reporter (for errors) in dev
          production
            ? require('cssnano')({ discardUnused: { fontFace: false } })
            : postcssReporter({ clearMessages: true }),
        ],
      },
    },
  ];

  const createBrowserLoaders = extractCssToFile => loaders => {
    if (extractCssToFile) {
      return ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaders,
      });
    }
    return [{ loader: 'style-loader' }, ...loaders];
  };

  return {
    include: PATHS.app,
    test: /\.css$/,
    use: createBrowserLoaders(production)(createCssLoaders()),
  };
};
