'use strict';
/* --execute=mocha-- */

/*jshint expr: true*/

//---------//
// Imports //
//---------//

var RawFO = require('../../models/extended/RawFO')
    , chai = require('chai')
    , FOImport = require('../../models/extended/FOImport')
    , FOProperty = require('../../models/extended/FOProperty')
    , FOStaticEnum = require('../../models/extended/FOStaticEnum')
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

describe("RawFO", function() {
    var rawFoInst
        , constImports
        , constStaticEnums
        , constProperties;

    before(function() {
        rawFoInst = new RawFO()
            .deserialize(require('./json/RawFO'));

        var tmpImport = new FOImport()
            .deserialize({
                "Constr": "Test"
                , "Package": "Testful"
            });

        constImports = lazy([tmpImport]);

        var tmpStaticEnum = new FOStaticEnum()
            .deserialize({
                "Name": "TestStaticEnum"
                , "Contents": {
                    "aTest": "a-test"
                }
            });

        constStaticEnums = lazy([tmpStaticEnum]);

        var tmpProperty = new FOProperty()
            .deserialize({
                "Name": "TestProperty",
                "Constr": "String",
                "Flags": [
                    "back_end",
                    "not_null"
                ]
            });

        constProperties = lazy([tmpProperty]);
    });

    it("should deserialize and serialize", function serialization() {
        rawFoInst.ConstructorName().should.equal('TestRawFO');

        rawFoInst.Imports().equals(constImports, FOImport.equals)
            .should.be.true;

        rawFoInst.StaticEnums().equals(constStaticEnums, FOStaticEnum.equals)
            .should.be.true;

        rawFoInst.Properties().equals(constProperties, FOProperty.equals)
            .should.be.true;

        rawFoInst.serialize().should.eql(require('./json/RawFO'));
    });


    it("should pass and fail equals appropriately", function equals() {
        var localRawFo = new RawFO()
            .ConstructorName('TestRawFO')
            .Imports(constImports)
            .StaticEnums(constStaticEnums)
            .Properties(constProperties);

        localRawFo.equals(rawFoInst)
            .should.be.true;

        localRawFo.ConstructorName('TestRawFOfail')
            .equals(rawFoInst)
            .should.be.false;
    });
});
