module.exports = () => {
  return {
    test: /\.tsx?$/,
    use: ['babel-loader', 'ts-loader?configFile=tsconfig.webpack.json&transpileOnly=true']
  };
};
