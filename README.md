gulp-serve
==========
[![Build Status](https://travis-ci.org/nkt/gulp-serve.svg?branch=master)](https://travis-ci.org/nkt/gulp-serve)

This package is a modified version of the original [gulp-serve](https://www.npmjs.com/package/gulp-serve) to provide with proxying capabilities in case you have
a distributed service and you still want to develop locally you can proxy your request to your localhost to the remote.

Saving you the headache of CORS.

Provide express-server functionality, using [express.static](http://expressjs.com/guide/using-middleware.html)
Valid proxy properties: [http-proxy](https://github.com/nodejitsu/node-http-proxy/blob/caronte/lib/http-proxy.js#L37-L45)

Install
=======
Install with [npm](https://npmjs.org/)

    npm i --save-dev gulp-serve

Usage
=====

```js
var gulp = require('gulp');
var serve = require('gulp-proxy-serve');

gulp.task('serve', serve('public')); //only static serve on public dir
gulp.task('serve-build', serve(['public', 'build'])); //static serve public and build
gulp.task('serve-prod', serve({ // static serve public and build, and proxy other requests to http://localhost:9090
    root: ['public', 'build'],
    port: 80,
    middleware: function(req, res) {
        // custom optional middleware
    },
    middlewares: [
        // an array of middleware functions
    ]
    proxy: true,
    proxyOptions: {
        target: 'https://localhost:9090'
    }
}));
```

License
=====

[MIT](http://opensource.org/licenses/MIT)
