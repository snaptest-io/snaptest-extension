'use strict';

var concat = require('path').normalize;

module.exports.target = concat(process.cwd() + '/dist');
module.exports.srcPath = concat(process.cwd() + '/src');
module.exports.assetsPath = concat(process.cwd() + '/assets');
module.exports.distPath = concat(process.cwd() + '/dist');
module.exports.tmpPath = concat(process.cwd() + '/tmp');