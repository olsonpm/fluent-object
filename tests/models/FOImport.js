'use strict';
/* --execute=mocha-- */

/*jshint expr: true*/


//---------//
// Imports //
//---------//

var FOImport = require('../../models/extended/FOImport')
    , chai = require('chai');


//------//
// Init //
//------//

var should = chai.should();
chai.config.includeStack = true;


//------//
// Main //
//------//

describe("FOImport", function() {
    var foStaticEnumInst;

    before(function() {
        foStaticEnumInst = new FOImport()
            .deserialize(require('./json/FOImport'));
    });

    it("should deserialize and serialize", function serialization() {
        foStaticEnumInst.Constr().should.equal('Test');
        foStaticEnumInst.Package().should.equal('TestFul');
        foStaticEnumInst.serialize().should.eql(require('./json/FOImport'));
    });

    it("should pass and fail equals appropriately", function equals() {
        var localFoStaticEnum = new FOImport()
            .Constr('Test')
            .Package('TestFul');

        localFoStaticEnum.equals(foStaticEnumInst)
            .should.be.true;

        localFoStaticEnum.Constr('TestFail');

        localFoStaticEnum.equals(foStaticEnumInst)
            .should.be.false;
    });
});
