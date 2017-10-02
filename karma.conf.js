// Karma configuration
// Generated on Tue Sep 26 2017 15:12:48 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/angular/angular.js',                             // angular
      './node_modules/angular-ui-router/release/angular-ui-router.js', // ui-router
      './node_modules/angular-mocks/angular-mocks.js',                 // loads our modules for tests
      './node_modules/angular-aria/angular-aria.js',                 // loads our modules for tests
      './node_modules/angular-route/angular-route.js',                 // loads our modules for tests
      './node_modules/angular-animate/angular-animate.js',                 // loads our modules for tests
      './node_modules/angular-messages/angular-messages.js',                 // loads our modules for tests
      './node_modules/angular-material/angular-material.js',                 // loads our modules for tests
      './node_modules/angular-sanitize/angular-sanitize.js',                 // loads our modules for tests
      './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',                 // loads our modules for tests
      './node_modules/angular-ui-select/select.js',                 // loads our modules for tests
      './node_modules/ngStorage/ngStorage.js',                 // loads our modules for tests
      './public/scripts/gridster/angular-gridster.js',
      './public/scripts/angular-prompt.js',
      './public/scripts/datetimepicker.js',
      './public/scripts/angular-marked.min.js',
      './public/scripts/marked.js',
      './public/scripts/angular-modal-service.min.js',
      './app/app.js',
      './app/components/**/*.js',
      './app/services/*.js',
      './app/services/tests/*.js',
      './app/directives/**/*.js',                                   
      // './app/services/userService.js',
      // './app/components/grid/grid.js',
      // './app/services/tests/userService-spec.js',
      // './app/components/grid/grid.spec.js',
      // './app/components/saveMenu/saveMenu.js',
      // './app/components/saveMenu/saveMenu.spec.js',
      // './app/directives/clock/clock.js',
      // './app/directives/clock/clock.spec.js',
      // './app/directives/clock/clocksettings.js',
      // './app/directives/clock/clocksettings.spec.js'
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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
