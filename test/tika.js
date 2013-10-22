'use strict';

require('should');
var fs = require('fs');

var tika = require('../lib/hydrater-tika');


describe('Test tika results', function() {
  it('returns the correct informations', function(done) {
    var document = {
      metadatas: {}
    };

    tika(__filename, document, function(err, document) {
      if(err) {
        throw err;
      }

      document.should.have.property('metadatas');
      document.should.have.property('binary_document_type', "document");
      document.metadatas.should.have.property('content-encoding', 'ISO-8859-1');

      // Tika adds a trailing "\n"
      document.metadatas.should.have.property('raw', fs.readFileSync(__filename).toString() + "\n");

      done();
    });
  });
});
