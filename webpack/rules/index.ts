import css from './css';
import graphql from './graphql';
import image from './image';
import typescript from './typescript';

export default ({ production = false } = {}) => [
  graphql(),
  typescript(),
  css({ production }),
  image(),
  {
    exclude: /node_modules/,
    loader: 'json-loader',
    test: /\.json$/,
  },
];
