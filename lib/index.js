'use strict';

/**
 * @file Helper for image file processing
 * For more information about Convert :
 * See http://www.imagemagick.org/script/convert.php
 */

var shellExec = require('child_process').exec;
var async = require('async');
var config = require('../config/configuration.js');



/**
 * Generate base64 encoding of path resized to thumbnail size
 */
var generateThumb = function(path, thumbSize, cb) {
  // Initial command is:
  //convert original.png -auto-orient -thumbnail 350x250 thumb.png
  // -auto-orient use EXIF information for orientation,
  // -thumbnail strips metadatas and use a quick algorithm for generation in the given size
  // -strip strips EXIF informations and ImageMagick metadatas
  // see http://www.imagemagick.org/Usage/thumbnails/
  // For images smaller than final thumbnail size, we don't want to resize:
  //convert original.png -auto-orient -thumbnail 350x250\> thumb.png
  // To retrieve data in stdout, we have to export onto fd:1 as png, so:
  //convert original.png -auto-orient -thumbnail 350x250 png:fd:1
  // Finally, to convert this raw data to base64 we use -i (ignore garbage) and -w 0 to disable linebreaks.
  shellExec('convert -limit memory 100MiB -limit map 30MiB -limit area 10Mib ' + path + " -auto-orient -thumbnail " + thumbSize + "\\> -strip png:fd:1 | base64 -i -w 0", {maxBuffer: 20480 * 1024, timeout: 60000}, cb);
};


/**
 * Generate base64 encoding of path resized to display size
 */
var generateDisplay = function(path, displaySize, cb) {
  // Initial command is:
  //convert original.png -auto-orient -resize 750x750 image.png
  // We want to keep origin extension, so just fd:1
  shellExec('convert -limit memory 100MiB -limit map 30MiB -limit area 10Mib ' + path + " -auto-orient -resize " + displaySize + "\\> -quality 80 jpg:fd:1 | base64 -i -w 0", {maxBuffer: 20480 * 1024, timeout: 60000}, cb);
};


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function (path, document, finalCb) {
  // Skip PSD
  if (document.metadatas && document.metadatas.path && (document.metadatas.path.indexOf('.psd') !== -1 || document.metadatas.path.indexOf('.PSD') !== -1)) {
    return finalCb(null, document);
  }

  async.series({
    generateThumb: function(cb) {
      // Skip if already provided
      if(document.datas && document.datas.thumb) {
        return cb();
      }

      generateThumb(path, config.thumb_size, function(err, thumbnail) {
        if(err) {
          var erroredDocument = {
            id : document.id,
            identifier: document.identifier,
            hydration_errored: true,
            hydration_error : err.toString()
          };
          return finalCb(null, erroredDocument);
        }

        document.datas.thumb = "data:image/png;base64," + thumbnail;
        cb();
      });
    },
    generateDisplay: function(cb) {
      // Skip if already provided
      if(document.datas && document.datas.display) {
        return cb();
      }

      generateDisplay(path, config.display_size, function(err, display) {
        if(err) {
          var erroredDocument = {
            id : document.id,
            identifier: document.identifier,
            hydration_errored: true,
            hydration_error : err
          };
          return finalCb(null, erroredDocument);
        }

        document.datas.display = "data:image/jpeg;base64," + display;
        cb();
      });
    },
  }, function(err) {
    document.document_type = "image";
    finalCb(err, document);
  });
};
