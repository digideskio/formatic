'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
  'npm-install': fs.readFileSync(path.join(__dirname, './npm-install.txt'), 'utf8'),
  'use-commonjs': fs.readFileSync(path.join(__dirname, './use-commonjs.txt'), 'utf8'),
  'bower-install': fs.readFileSync(path.join(__dirname, './bower-install.txt'), 'utf8'),
  'use-global': fs.readFileSync(path.join(__dirname, './use-global.txt'), 'utf8')
};
