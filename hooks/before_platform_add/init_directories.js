#!/usr/bin/env node

var mkdirp = require('mkdirp');
var path = require('path');

var platformsDir = path.resolve(__dirname, '../../platforms');
var pluginsDir = path.resolve(__dirname, '../../plugins');

mkdirp(platformsDir, function (err) {
  if (err) { console.error(err); }
});

mkdirp(pluginsDir, function (err) {
  if (err) { console.error(err); }
});
