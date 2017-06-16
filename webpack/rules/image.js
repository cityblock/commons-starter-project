const PATHS = require("../paths");

module.exports = ({ limit = 30000 } = {}) => ({
  include: PATHS.app,
  loader: "url-loader",
  options: { name: "[hash].[ext]", limit },
  test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
});
