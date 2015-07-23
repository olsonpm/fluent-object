'use strict';


//---------//
// Imports //
//---------//

var RawFO = require('../base/RawFO')
    , FOImport = require('../extended/FOImport')
    , FOProperty = require('../extended/FOProperty')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//-----------------------//
// Prototyped Extensions //
//-----------------------//

RawFO.prototype.ValidateState = function ValidateState(throwErr) {
    var msg = '';

    msg = this.ValidateProperties(throwErr);

    return msg;
};

RawFO.prototype.ValidateProperties = function ValidateProperties(throwErr) {
    var msg = '';
    var self = this;
    var invalidProperties = [];

    this.Properties().each(function(propertyInst) {
        var isValid = validatePropertyConstr(propertyInst.Constr().split('.'), self);

        if (!isValid) {
            invalidProperties.push(propertyInst.Name() + ': ' + propertyInst.Constr());
        }
    });

    if (invalidProperties.length) {
        msg = "Invalid Argument: <RawFO>.ValidateProperties has the following invalid properties\n"
            + invalidProperties.join('\n')
            + '\n';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

RawFO.prototype.FileName = function FileName() {
    if (arguments.length > 0) {
        throw new Error("Invalid Argument: <RawFO>.FileName does not take any arguments");
    }
    return this.ConstructorName() + '.js';
};


//------------------//
// Helper Functions //
//------------------//

function validatePropertyConstr(splitConstr, rawFoInst) {
    // Handle three cases
    //   1) Constr is a built in type
    //   2) Constr is a special case
    //   3) Constr is from an imported package

    var result = true;

    var specialValues = lazy(FOProperty.SPECIAL).values();

    if (splitConstr.length === 1) {
        // Constr is a built in type

        result = lazy(FOProperty.BUILTINS).values().contains(splitConstr[0]);
    } else if (specialValues.contains(splitConstr[0])) {
        // Constr is a special case

        switch (splitConstr[0]) {
            case FOProperty.SPECIAL.Static_enum:
                var validStaticEnums = rawFoInst.StaticEnums()
                    .map(function(staticEnumInst) {
                        return staticEnumInst.Name();
                    });

                result = validStaticEnums.contains(splitConstr[1])
                break;

            case FOProperty.SPECIAL.Lazy_array_of:
                // remove the first element and validate the resulting constr
                splitConstr.shift();
                result = validatePropertyConstr(splitConstr, rawFoInst);
                break;

            default:
                throw new Error("Invalid Code: '" + splitConstr[0] + "' was found inside the FOProperty.SPECIAL enum, however a case was not delegated for it.");
        }
    } else {
        // Constr is from an imported package

        result = validateImportedPackage(splitConstr, rawFoInst);
    }

    return result;
}

function validateImportedPackage(splitConstr, rawFoInst) {
    if (splitConstr.length < 1 || splitConstr.length > 2) {
        return false;
    }

    var curImport = new FOImport()
        .Package(splitConstr[0])
        .Constr(splitConstr[0]);

    if (splitConstr.length === 2) {
        curImport.Constr(splitConstr[1]);
    }

    return rawFoInst.Imports().ex_contains(curImport, FOImport.equals);
}


//---------//
// Exports //
//---------//

module.exports = RawFO;
