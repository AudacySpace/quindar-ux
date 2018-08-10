// Karma configuration
// Generated on Tue Sep 26 2017 15:12:48 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    client: {
      jasmine: {
        random: false
      }
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './public/scripts/jquery.js',
      './public/scripts/angular.min.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './public/scripts/angular-aria.min.js',
      './public/scripts/angular-animate.min.js',
      './public/scripts/angular-messages.min.js',
      './public/scripts/angular-material.min.js',
      './public/scripts/angular-sanitize.min.js',
      './public/scripts/ui-bootstrap-tpls.js',
      './public/scripts/select.min.js',
      './public/scripts/ngStorage.min.js',
      './public/scripts/gridster/angular-gridster.js',
      './public/scripts/angular-prompt.js',
      './public/scripts/datetimepicker.js',
      './public/scripts/angular-marked.min.js',
      './public/scripts/marked.js',
      './public/scripts/angularjs-dropdown-multiselect.js',
      './public/scripts/ng-sortable.js',
      './public/scripts/moment.js',
      './public/scripts/moment-timezone-with-data-2012-2022.min.js',
      './app/app.js',
      './app/components/**/*.js',
      './app/services/*.js',
      './app/services/tests/*.js',
      './app/directives/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome_without_sandbox'],

    customLaunchers: {
      Chrome_without_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'], // with sandbox it fails under Docker
        displayName: 'Chrome w/o sandbox'
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
