module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^https://www\\.gstatic\\.com/firebasejs/11\\.2\\.0/firebase-app\\.js$': '<rootDir>/__mocks__/firebase-app.js',
    '^https://www\\.gstatic\\.com/firebasejs/11\\.2\\.0/firebase-auth\\.js$': '<rootDir>/__mocks__/firebase-auth.js',
    '^https://www\\.gstatic\\.com/firebasejs/11\\.2\\.0/firebase-firestore\\.js$': '<rootDir>/__mocks__/firebase-firestore.js',
    '^https://www\\.gstatic\\.com/firebasejs/11\\.2\\.0/firebase-analytics\\.js$': '<rootDir>/__mocks__/firebase-analytics.js',
    '^https://www\\.gstatic\\.com/firebasejs/11\\.2\\.0/firebase-storage\\.js$': '<rootDir>/__mocks__/firebase-storage.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!jest.config.js',
    '!babel.config.js',
    '!coverage/**',
    '!**/__mocks__/**'
  ],
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '/coverage/',
    '/Tests/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],
  setupFilesAfterEnv: ['<rootDir>/Tests/setup.js']
}; 