import PATHS from '../paths';

export default ({ limit = 30000 } = {}) => ({
  include: PATHS.app,
  loader: 'url-loader',
  options: { name: '[hash].[ext]', limit },
  test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
});
