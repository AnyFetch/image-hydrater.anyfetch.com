'use strict';

require('should');

var imageHydrater = require('../lib/');


describe('Test results', function() {
  it('returns the correct informations', function(done) {
    var document = {
      datas: {},
      metadatas: {
        path: "osef",
      }
    };

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.datas.should.have.property('thumb').and.include('data:image/png;base64');
      document.datas.should.have.property('display').and.include('data:image/jpeg;base64');
      document.should.have.property('document_type', "image");

      done();
    });
  });

  it('skip when already provided', function(done) {
    var document = {
      datas: {
        thumb: 'http://somewhere.com',
        display: 'http://somewhere.com'
      }
    };

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, function(err, document) {
      if(err) {
        throw err;
      }

      document.datas.should.have.property('thumb', 'http://somewhere.com');
      document.datas.should.have.property('display', 'http://somewhere.com');
      document.should.have.property('document_type', "image");

      done();
    });
  });

  it('should skip psd', function(done){
    var initDocument = {
      datas: {},
      metadatas: {
        path: "osef.psd",
      }
    };
    imageHydrater(__dirname + "/samples/imagemagick.psd", initDocument, function(err, document) {
      if(err) {
        throw err;
      }
      document.should.be.eql(initDocument);

      done();
    });
  });

});
