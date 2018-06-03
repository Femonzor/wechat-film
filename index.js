require("babel-register");
require("babel-polyfill");
var bbPromise = require("bluebird");
require("babel-runtime/core-js/promise").default = bbPromise;
global.Promise = bbPromise;
require('isomorphic-fetch');
require("./src/app");
