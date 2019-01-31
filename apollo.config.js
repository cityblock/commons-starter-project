module.exports = {
  client: {
    service: {
      name: 'local',
      localSchemaFile: './server/graphql/schema.graphql',
    },
    includes: ['app/graphql/**/*.graphql'],
    excludes: ['**/node_modules', '**/__tests__'],
  },
};
