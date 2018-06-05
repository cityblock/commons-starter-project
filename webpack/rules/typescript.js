const { createLodashTransformer } = require('typescript-plugin-lodash');

module.exports = () => {
  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.webpack.json',
          happyPackMode: true,
          getCustomTransformers: () => ({ before: [createLodashTransformer()] }),
        },
      },
    ],
  };
};
