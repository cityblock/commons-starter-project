const { createLodashTransformer } = require('typescript-plugin-lodash');

module.exports = () => {
  return {
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json',
          getCustomTransformers: () => ({ before: [createLodashTransformer()] }),
          happyPackMode: true,
        },
      },
    ],
  };
};
