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
module.exports = function (path, document, cb) {
  console.log(path, cb);
  var shellExec = require('child_process').exec;
  //convert models.png -auto-orient -thumbnail 350x250 thumb.png
  shellExec('convert ' + path + " -auto-orient -thumbnail " + config.thumb_size + " thumb.png", function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      return cb(new Error(stderr));
    }

    cb(null, stdout);
  });
};
