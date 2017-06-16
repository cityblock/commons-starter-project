module.exports = () => {
  return {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'babel-loader'
      },
      {
        loader: 'ts-loader?configFileName=tsconfig.webpack.json'
      }
    ]
  };
};
