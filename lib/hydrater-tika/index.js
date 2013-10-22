'use strict';

/**
 * @file Helper for Tika file processing
 * For more information about Tika :
 * See http://tika.apache.org/1.4/gettingstarted.html
 */

var config = require('../../config/configuration.js');


/**
 * Extract the content of the specified file
 *
 * @param {string} path Path of the specified file
 * @param {string} attr Specific behavior for tika processing (html, metadata, text, language)
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
var extractData = function(path, cb) {
  var shellExec = require('child_process').exec;
  shellExec('java -jar ' + config.tika_path + ' ' + path, function(err, stdout, stderr) {
    if(err) {
      return cb(err);
    }
    if(stderr) {
      return cb(new Error(stderr));
    }

    cb(null, stdout);
  });
};


/**
 * Extract all the accessible data with Tika
 *
 * @param {string} path Path to the file to process
 * @param {function} done Callback
 */
module.exports = function (path, document, cb) {
  extractData(path, function(err, data) {
    var results = {};

    if(err) {
      return cb(err);
    }
    if(!data) {
      return cb(new Error("Tika did not return any datas."));
    }

    // Read text
    var re = /<body>([\s\S]+)<\/body>/; // \s\S tricks for dotall behavior
    var body = data.match(re);
    // No matches == no html.
    // For instance on pictures.
    if(body && body[1]) {
      // Save HMTL
      results.html = body[1];
      // Save raw text (strip down all <..> stuff)
      results.raw = results.html.replace(/<(?:.|\n)*?>/gm, '');
    }

    // Read metas
    var htmlMetas = data.match(/name="[^"]+" content="[^"]+"\/>/g);
    var regexp = /name="([^"]+)" content="([^"]+)"/;
    htmlMetas.map(function(htmlMeta) {
      var metas = htmlMeta.match(regexp);
      results[metas[1].toLowerCase()] = metas[2];
    });

    // Cleanup resourcename
    delete results.resourcename;

    document.metadatas = results;
    document.binary_document_type = "document";
    cb(null, document);
  });
};
