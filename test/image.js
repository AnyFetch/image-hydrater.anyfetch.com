'use strict';

require('should');

var imageHydrater = require('../lib/');
var anyfetchHydrater = require('anyfetch-hydrater');

var HydrationError = anyfetchHydrater.HydrationError;

describe('Test results', function() {
  it('returns the correct informations', function(done) {
    var document = {
      data: {},
      metadata: {
        path: "osef",
      }
    };

    var changes = anyfetchHydrater.defaultChanges();

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.metadata.should.have.property('thumb').and.containDeep('data:image/png;base64');
      changes.data.should.have.property('display').and.containDeep('data:image/jpeg;base64');
      changes.should.have.property('document_type', "image");

      done();
    });
  });

  it('skip when already provided', function(done) {
    var document = {
      metadata: {
        thumb: 'http://somewhere.com',
      },
      data: {
        display: 'http://somewhere.com'
      }
    };

    var changes = anyfetchHydrater.defaultChanges();

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.data.should.eql({});
      changes.should.have.property('document_type', "image");

      done();
    });
  });

  it('should return an errored document', function(done) {
    var document = {
      metadata: {
        path: "/samples/errored.jpg",
      }
    };

    var changes = anyfetchHydrater.defaultChanges();

    imageHydrater(__dirname + "/samples/errored.jpg", document, changes, function(err) {
      if(err instanceof HydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });

});
