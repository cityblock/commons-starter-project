import { createLodashTransformer } from 'typescript-plugin-lodash';

export default () => {
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
