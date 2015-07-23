'use strict';
/* --execute=mocha-- */

/*jshint expr: true*/


//---------//
// Imports //
//---------//

var FOProperty = require('../../models/extended/FOProperty')
    , chai = require('chai')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var should = chai.should()
    , lazy = nh.lazyExtensions;
chai.config.includeStack = true;


//------//
// Main //
//------//

describe("FOProperty", function() {
    var foPropertyInst;

    before(function() {
        foPropertyInst = new FOProperty()
            .deserialize(require('./json/FOProperty'));
    });

    it("should deserialize and serialize", function serialization() {
        foPropertyInst.Name().should.equal('Test');
        foPropertyInst.Constr().should.equal('String');
        foPropertyInst.Flags().equals(lazy(['back_end']))
            .should.be.true;
        foPropertyInst.serialize().should.eql(require('./json/FOProperty'));
    });

    it("should pass and fail equals appropriately", function equals() {
        var loccalFoPropertyInst = new FOProperty()
            .Name('Test')
            .Constr('String')
            .Flags(['back_end']);

        loccalFoPropertyInst.equals(foPropertyInst)
            .should.be.true;

        loccalFoPropertyInst.Name('TestFail')
            .equals(foPropertyInst)
            .should.be.false;
    });
});
