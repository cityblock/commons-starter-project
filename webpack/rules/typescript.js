module.exports = () => {
  return {
    test: /\.tsx?$/,
    use: ['ts-loader?configFile=tsconfig.webpack.json&transpileOnly=true'],
  };
};
