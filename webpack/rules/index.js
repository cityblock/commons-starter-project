const image = require("./image");
const typescript = require("./typescript");
const css = require("./css");

module.exports = ({ production = false } = {}) => (
  [
    typescript(),
    css({ production }),
    image(),
  ]
);
