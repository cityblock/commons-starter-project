module.exports = ({ production = false } = {}) => {
  return {
    loader: "awesome-typescript-loader",
    options: {
      configFileName: "tsconfig.webpack.json",
      logInfoToStdOut: true,
    },
    test: /\.tsx?$/,
  };
};
