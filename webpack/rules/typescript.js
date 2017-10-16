module.exports = () => {
  return {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.webpack.json'
        }
      }
    ]
  };
};
