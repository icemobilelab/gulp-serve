var util = require('gulp-util');
var nodeUtil = require('util');
var defaults = require('lodash.defaults');
var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var allowCrossDomain = require('./lib/allow-cross-domain');
var PROXY_OPTIONS = {
  target: 'http://localhost:9090',
  url: '/*'
};

module.exports = function (config) {
  config || (config = {});
  return function () {
    var app = express();
    var proxyOptions = defaults(config.proxyOptions, PROXY_OPTIONS);
    var proxy = httpProxy.createServer(proxyOptions);
    /* ensure config format */
    if (typeof config === 'string') {
      config = {root:[config]};
    }
    if (Array.isArray(config)) {
      config = {root: config};
    }
    if (!config.root) {
      config.root = ['.'];
    }
    if (typeof config.root === 'string') {
      config.root = [config.root];
    }

    /* middlewares */
    if (!config.middlewares) {
      config.middlewares = [];
    }
    if (config.middleware) {
      config.middlewares.push(config.middleware);
    }
    config.middlewares.forEach(function(middleware) {
      app.use(middleware);
    });

    /* set up static serve */
    config.root.forEach(function (path) {
      app.use(express.static(path));
    });

    if (!config.port) {
      config.port = 3000;
    }

    /* sexy proxy */
    if (config.proxy) {
        app.use(allowCrossDomain);
        app.all(proxyOptions.url,  function (req, res) {
            util.log(nodeUtil.format('Proxying request %s to: %s', req.url, proxyOptions.target));
            return proxy.proxyRequest(req, res, proxyOptions);
        });
    }

    http.createServer(app).listen(config.port, config.hostname, function () {
      util.log(util.colors.bgGreen('Server started on ' + config.port + ' port'));
    });

  };
};
