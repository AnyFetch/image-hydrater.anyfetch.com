'use strict';

require('should');
 
var imageHydrater = require('../lib/hydrater-image');


describe('Test results', function() {
  it('returns the correct informations', function(done) {
    var document = {
      metadatas: {}
    };

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.metadatas.should.have.property('thumb').and.include('data:image/png;base64');
      document.should.have.property('binary_document_type', "image");

      done();
    });
  });
});
