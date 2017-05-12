const PATHS = require("../paths");

module.exports = ({ production = false } = {}) => {
  return {
    test: /\.tsx?$/,
    loader: "awesome-typescript-loader",
    options: {
      logInfoToStdOut: true,
      configFileName: "tsconfig.webpack.json"
    }
  };
};
