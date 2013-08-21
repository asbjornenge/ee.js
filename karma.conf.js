// Karma configuration
// Generated on Mon Aug 19 2013 09:03:59 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    basePath: '.',
    frameworks: ['mocha'],

    files: [
        'spec/vendor/chai.js',
        'spec/vendor/sinon-chai.js',
        'spec/vendor/*.js',
        'ee.js',
        'spec/helpers.js',
        'spec/*.js'
    ],

    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false
  });
};
