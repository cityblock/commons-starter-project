const image = require("./image");
const typescript = require("./typescript");
const css = require("./css");

module.exports = ({ production = false } = {}) => (
  [
    typescript({ production }),
    css({ production }),
    image(),
  ]
);
