const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const postcssImport = require("postcss-import");
const postcssCssnext = require("postcss-cssnext");
const postcssReporter = require("postcss-reporter");
const PATHS = require("../paths");

module.exports = ({ production = false } = {}) => {
  const localIndentName = "localIdentName=[name]__[local]___[hash:base64:5]";

  const createCssLoaders = embedCssInBundle => ([
    {
      loader: 'typings-for-css-modules-loader',
      options: {
        localIndentName,
        sourceMap: true,
        modules: true,
        namedExport: true,
        importLoaders: 1,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        plugins: [
          postcssImport({ path: path.resolve(PATHS.app, "./css") }),
          postcssCssnext({ browsers: ["> 1%", "last 2 versions"] }),
          postcssReporter({ clearMessages: true }),
        ]
      }
    },
  ]);

  const createBrowserLoaders = extractCssToFile => loaders => {
    if (extractCssToFile) {
      return ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: loaders
      });
    }
    return [{ loader: "style-loader" }, ...loaders];
  };

  return {
    test: /\.css$/,
    use: createBrowserLoaders(production)(createCssLoaders(true)),
    include: PATHS.app
  };
};
