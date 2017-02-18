
module.exports = function (config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['qunit'],
    plugins: ['karma-qunit', 'karma-coverage', 'karma-phantomjs-launcher', 'karma-html2js-preprocessor'],
    files: ['dist/*.js', 'test/*.js', 'test/*.html'],
    browsers: ['PhantomJS'],

    reporters: ['progress', 'coverage'],
    preprocessors: {
      '*.js': ['coverage'],
      '*.html': ['html2js']
    },
    singleRun: true,
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
    }
  });
};
