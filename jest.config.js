module.exports = {
  testEnvironment: 'node',

  expand: true,

  forceExit: true,

  setupFilesAfterEnv: ['./test/utils/setup'],

  coverageDirectory: './coverage',

  collectCoverageFrom: [
    'src/**/*.js'
  ],

  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src$1',
    '^test-utils(.*)$': '<rootDir>/test/utils$1'
  },

  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest'
  },

  moduleFileExtensions: [
    'js',
    'json'
  ],

  reporters: [
    'default'
    // ['jest-junit', { outputDirectory: 'reports/junit' }]
  ]
}
