/**
 * webpack.config.js
 *
 * process.env.NODE_ENV is used to determine to return production config or not
 * env is a string passed by "webpack --env" on command line or calling this function directly
 *
 */
const dotenv = require('dotenv');
const fs = require("fs");
const PATHS = require("./paths");
const rules = require("./rules");
const plugins = require("./plugins");
const externals = require("./externals");
const resolve = require("./resolve");

module.exports = (env = "") => {
  dotenv.config();

  const isProduction = process.env.NODE_ENV === "production";
  const isBrowser = (env.indexOf("browser") >= 0);
  console.log(`Running webpack in ${process.env.NODE_ENV} mode`);

  const node = { __dirname: true, __filename: true };

  const prodRender = {
    devtool: 'source-map',
    context: PATHS.app,
    entry: {
      app: ["./client"]
    },
    node,
    output: {
      path: PATHS.assets,
      filename: "[name].js",
      publicPath: PATHS.public,
    },
    module: { rules: rules({ production: true }) },
    resolve,
    plugins: plugins({ production: true })
  };

  const devRender = {
    devtool: 'source-map',
    context: PATHS.app,
    entry: { app: ["./client"] },
    node,
    output: {
      path: PATHS.assets,
      filename: "[name].js",
      publicPath: PATHS.public,
    },
    module: { rules: rules({ production: false }) },
    resolve,
    plugins: plugins({ production: false })
  };

  return isProduction ? [prodRender] : [devRender];
};
