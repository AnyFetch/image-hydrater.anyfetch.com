'use strict';

/**
 * @file Helper for image file processing
 * For more information about Convert :
 * See http://www.imagemagick.org/script/convert.php
 */

var config = require('../../config/configuration.js');


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, cb) {
  var shellExec = require('child_process').exec;
  shellExec('convert ' + path, function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      return cb(new Error(stderr));
    }

    cb(null, stdout);
  });
};
