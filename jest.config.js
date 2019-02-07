module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/dist/', '/node_modules/'],
  testPathIgnorePatterns: ['/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testEnvironment: 'node',
};
