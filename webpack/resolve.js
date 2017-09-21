const PATHS = require('./paths');

module.exports = {
  extensions: ['.ts', '.tsx', '.js', '.css', '.graphql', '.json'],
  modules: [PATHS.app, PATHS.modules],
};
