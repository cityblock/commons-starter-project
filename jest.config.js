module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  testEnvironmentOptions: {
    IS_BUILDER_ENABLED: 'true',
  },
  testMatch: [
    '<rootDir>/app/**/?(*.)(spec|test).ts?(x)',
    '<rootDir>/server/**/?(*.)(spec|test).ts?(x)',
    '<rootDir>/scripts/**/?(*.)(spec|test).ts?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./browser-mocks.js', './enzyme-setup.js', './objection-setup.js'],
  setupTestFrameworkScriptFile: './jest-setup.js',
  globals: {
    'ts-jest': {
      babelConfig: false,
      diagnostics: false,
      isolatedModules: true,
      tsConfig: 'tsconfig.server.json',
    },
  },
};
