'use strict';
/* --execute=mocha-- */
/*jshint expr: true*/


//---------//
// Imports //
//---------//

var FOStaticEnum = require('../../models/extended/FOStaticEnum')
    , chai = require('chai');


//------//
// Init //
//------//

var should = chai.should();
chai.config.includeStack = true;


//------//
// Main //
//------//

describe("FOStaticEnum", function() {
    var foStaticEnumInst;

    before(function() {
        foStaticEnumInst = new FOStaticEnum()
            .deserialize(require('./json/FOStaticEnum'));
    });

    it("should deserialize and serialize", function serialization() {
        foStaticEnumInst.Name().should.equal('Test');
        foStaticEnumInst.Contents().should.eql({
            aTest: 'a-test'
        });
        foStaticEnumInst.serialize().should.eql(require('./json/FOStaticEnum'));
    });

    it("should pass and fail equals appropriately", function equals() {
        var localFoStaticEnum = new FOStaticEnum()
            .Name('Test')
            .Contents({
                aTest: "a-test"
            });

        localFoStaticEnum.equals(foStaticEnumInst)
            .should.be.true;

        localFoStaticEnum.Name('TestFail')
            .equals(foStaticEnumInst)
            .should.be.false;

        localFoStaticEnum.Name('Test')
            .Contents({
                aTest2: "a-test"
            })
            .equals(foStaticEnumInst)
            .should.be.false;
    });
});
