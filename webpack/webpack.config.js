/**
 * webpack.config.js
 *
 * process.env.NODE_ENV is used to determine to return production config or not
 * env is a string passed by "webpack --env" on command line or calling this function directly
 *
 */
const dotenv = require("dotenv");
const fs = require("fs");
const PATHS = require("./paths");
const rules = require("./rules");
const plugins = require("./plugins");
const externals = require("./externals");
const resolve = require("./resolve");
const typescript = require("./rules/typescript");

module.exports = (env = "") => {
  dotenv.config();

  const isProduction = process.env.NODE_ENV === "production";

  const node = {
    __dirname: true,
    __filename: true,
  };

  const clientRender = {
    context: PATHS.app,
    devtool: "source-map",
    entry: { app: ["./client"] },
    module: { rules: rules({ production: isProduction }) },
    node,
    output: {
      filename: "[name].js",
      path: PATHS.assets,
      publicPath: PATHS.public,
    },
    plugins: plugins({ production: isProduction }),
    resolve,
    target: "web",
  };

  return [clientRender];
};
