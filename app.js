'use strict';

// Load configuration and initialize server
var anyfetchFileHydrater = require('anyfetch-file-hydrater');

var config = require('./config/configuration.js');
var imageHydrater = require('./lib');

var serverConfig = {
  concurrency: config.concurrency,
  hydrater_function: imageHydrater
};

var server = anyfetchFileHydrater.createServer(serverConfig);

// Expose the server
module.exports = server;
