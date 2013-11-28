'use strict';

/**
 * @file Helper for image file processing
 * For more information about Convert :
 * See http://www.imagemagick.org/script/convert.php
 */

var shellExec = require('child_process').exec;
var async = require('async');
var config = require('../../config/configuration.js');


/**
 * Generate base64 encoding of path resized to thumbnail size
 */
var generateThumb = function(path, thumbSize, cb) {
  // Initial command is:
  //convert original.png -auto-orient -thumbnail 350x250 thumb.png
  // -auto-orient use EXIF information for orientation,
  // -thumbnail strips metadatas and use a quick algorithm for generation in the given size
  // see http://www.imagemagick.org/Usage/thumbnails/
  // For images smaller than final thumbnail size, we don't want to resize:
  //convert original.png -auto-orient -thumbnail 350x250\> thumb.png
  // To retrieve data in stdout, we have to export onto fd:1 as png, so:
  //convert original.png -auto-orient -thumbnail 350x250 png:fd:1
  // Finally, to convert this raw data to base64 we use -i (ignore garbage) and -w 0 to disable linebreaks.
  shellExec('convert ' + path + " -auto-orient -thumbnail " + thumbSize + "\\> png:fd:1 | base64 -i -w 0", cb);
};


/**
 * Generate base64 encoding of path resized to display size
 */
var generateDisplay = function(path, displaySize, cb) {
  // Initial command is:
  //convert original.png -auto-orient -resize 750x750 image.png
  // We want to keep origin extension, so just fd:1
  shellExec('convert ' + path + " -auto-orient -resize " + displaySize + "\\> -quality 80 jpg:fd:1 | base64 -i -w 0", {maxBuffer: 5000 * 1024}, cb);
};


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function (path, document, cb) {
  async.auto({
    generateThumb: function(cb) {
      generateThumb(path, config.thumb_size, function(err, thumbnail) {
        if(err) {
          return cb(err);
        }

        document.datas.thumb = "data:image/png;base64," + thumbnail;
        cb();
      });
    },
    generateDisplay: function(cb) {
      generateDisplay(path, config.display_size, function(err, display) {
        if(err) {
          return cb(err);
        }

        document.datas.display = "data:image/jpeg;base64," + display;
        cb();
      });
    },
  }, function(err) {
    document.document_type = "image";
    cb(err, document);
  });
};
