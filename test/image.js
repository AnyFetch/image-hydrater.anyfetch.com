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

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.datas.should.have.property('thumb').and.include('data:image/png;base64');
      changes.datas.should.have.property('display').and.include('data:image/jpeg;base64');
      changes.should.have.property('document_type', "image");

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

    var changes = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    imageHydrater(__dirname + "/samples/imagemagick.jpg", document, changes, function(err, changes) {
      if(err) {
        throw err;
      }

      changes.datas.should.eql({});
      changes.should.have.property('document_type', "image");

      done();
    });
  });

  it('should skip psd', function(done){
    var document = {
      datas: {},
      metadatas: {
        path: "osef.psd",
      }
    };

    var initChanges = {
      metadatas: {},
      user_access: [],
      actions: {},
      datas: {}
    };

    imageHydrater(__dirname + "/samples/imagemagick.psd",document, initChanges, function(err, changes) {
      if(err) {
        throw err;
      }
      changes.should.be.eql(initChanges);

      done();
    });
  });

});
