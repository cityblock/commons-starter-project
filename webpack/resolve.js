const PATHS = require("./paths");

module.exports = {
  extensions: [".ts", ".tsx", ".js", ".css", ".graphql"],
  modules: [PATHS.app, PATHS.modules],
};
