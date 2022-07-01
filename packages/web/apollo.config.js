const path = require('path');

// https://github.com/apollographql/apollo-tooling/issues/821
const isWorkspaceRoot = !__dirname.includes('packages');
const relativeSchemaPath = isWorkspaceRoot ? 'packages/api/src/schema.gql' : '../api/src/schema.gql';
const localSchemaFile = path.resolve(__dirname, relativeSchemaPath);

module.exports = {
  client: {
    tagName: 'gql',
    excludes: ['**/generated/**'],
    service: {
      name: 'api',
      localSchemaFile: localSchemaFile,
    },
  },
};
