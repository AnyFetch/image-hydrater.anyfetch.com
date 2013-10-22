'use strict';

/**
 * @file Helper for image file processing
 * For more information about Convert :
 * See http://www.imagemagick.org/script/convert.php
 */

var config = require('../../config/configuration.js');
var shellExec = require('child_process').exec;


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function (path, document, cb) {
  // Initial command is:
  //convert original.png -auto-orient -thumbnail 350x250 thumb.png
  // Auto orient use EXIF information for orientation,
  // thumbnail strip metadatas and use a quick algorithm for generation in the given size
  // see http://www.imagemagick.org/Usage/thumbnails/
  // To retrieve data in stdout, we have to export onto fd:1 as png, so:
  //convert original.png -auto-orient -thumbnail 350x250 png:fd:1
  // Finally, to convert this raw data to base64 we use -i (ignore garbage) and -w 0 to disable linebreaks.
  shellExec('convert ' + path + " -auto-orient -thumbnail " + config.thumb_size + " png:fd:1 | base64 -i -w 0", function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      return cb(new Error(stderr));
    }

    document.metadatas.thumb = "data:image/png;base64," + stdout;

    //shellExec('convert ' + path + )
    document.binary_document_type = "image";
    cb(null, document);
  });
};
