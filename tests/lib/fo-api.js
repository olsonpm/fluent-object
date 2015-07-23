'use strict';
/* --execute=mocha-- */

/*jshint expr: true*/


//---------//
// Imports //
//---------//

var foApi = require('../../lib/fo-api')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , bFs = require('fs-bluebird')
    , path = require('path')
    , bPromise = require('bluebird')
    , bMkdirp = bPromise.promisify(require('mkdirp'))
    , bRimraf = bPromise.promisify(require('rimraf'))
    , exampleJson = require('../../lib/static/example.json');


//------//
// Init //
//------//

chai.config.includeStack = true;
chai.use(chaiAsPromised);
bPromise.longStackTraces();

var should = chai.should();


//------//
// Main //
//------//

describe("foApi", function() {
    var rootDir;

    before(function() {
        rootDir = path.join(__dirname, 'garbage');
    });

    beforeEach(function() {
        return bMkdirp(rootDir);
    });

    it("should initialize the fluent-objects directory", function init() {
        var foDir = path.join(rootDir, 'fluent-objects');

        return foApi.init(rootDir)
            .then(function() {
                return bFs.readdirAsync(foDir);
            })
            .should.eventually.have.same.members(['base', 'extended', 'raw'])
            .then(function() {
                return bFs.readFileAsync(path.join(foDir, 'raw/example.json'));
            })
            .then(function(buf) {
                return JSON.parse(buf.toString());
            })
            .should.eventually.deep.equal(exampleJson);
    });

    afterEach(function() {
        return bRimraf(rootDir);
    });
});
