module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: '.karma/specs.js', watched: false },
      { pattern: '.karma/specs.js.map', included: false, served: true },
      { pattern: 'public/*.jpg', included: false, served: true },
    ],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-coverage'],
    reporters: ['dots', 'coverage'],
    colors: false,
    proxies: {
      '/consulta.jpg': '/base/public/consulta.jpg',
      '/recepcion.jpg': '/base/public/recepcion.jpg',
      '/talleres.jpg': '/base/public/talleres.jpg',
    },
    coverageReporter: {
      dir: 'coverage/jasmine',
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'json-summary' },
        { type: 'lcovonly' },
        { type: 'text-summary' },
      ],
    },
    browsers: ['ChromeHeadless'],
    hostname: '127.0.0.1',
    listenAddress: '127.0.0.1',
    port: 9876,
    singleRun: true,
    autoWatch: false,
    browserNoActivityTimeout: 60000,
    client: { jasmine: { random: false } },
  })
}
