module.exports = () => {
  return {
    test: /\.tsx?$/,
    use: ['babel-loader', 'ts-loader?configFileName=tsconfig.webpack.json']
  };
};
