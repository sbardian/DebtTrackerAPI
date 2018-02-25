module.exports = {
  globalSetup: './src/server/testEnv/setup.js',
  globalTeardown: './src/server/testEnv/teardown.js',
  testEnvironment: './src/server/testEnv/mongo-environment.js',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['dist'],
  testPathIgnorePatterns: ['dist'],
};
