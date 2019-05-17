export default () => ({
  exclude: /node_modules/,
  loader: 'graphql-tag/loader',
  test: /\.(graphql|gql)$/,
});
