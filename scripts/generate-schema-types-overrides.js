module.exports = {
  generateNamespace: (name, contents) =>
    `declare module '${name}' {
      ${contents}
    }`,
  typeMap: {
    DateTime: 'string'
  }
};
