'use strict';


//---------//
// Imports //
//---------//

var FOStaticEnum = require('./FOStaticEnum')
    , FOProperty = require('./FOProperty')
    , FOImport = require('./FOImport')
    , Utils = require('node-utils')
    , nh = require('node-helpers');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

function RawFO(argsObj) {
    this._myRawFO = {
        ConstructorName: null
        , Imports: lazy([])
        , StaticEnums: lazy([])
        , Properties: lazy([])
    };

    if (typeof this._init === 'function') {
        this._init(argsObj);
    }
}

RawFO.prototype.ConstructorName = function ConstructorName(input) {
    var res = this._myRawFO.ConstructorName;
    if (arguments.length > 0) {
        if (input !== null) {
            RawFO.ValidateConstructorName(input, true);
        }
        this._myRawFO.ConstructorName = input;
        res = this;
    }
    return res;
};

RawFO.prototype.Imports = function Imports(input) {
    var res = this._myRawFO.Imports;
    if (arguments.length > 0) {
        if (input !== null) {
            RawFO.ValidateImports(input, true);
            input = lazy(input);
        }
        this._myRawFO.Imports = input || lazy([]);
        res = this;
    }
    return res;
};

RawFO.prototype.StaticEnums = function StaticEnums(input) {
    var res = this._myRawFO.StaticEnums;
    if (arguments.length > 0) {
        if (input !== null) {
            RawFO.ValidateStaticEnums(input, true);
            input = lazy(input);
        }
        this._myRawFO.StaticEnums = input || lazy([]);
        res = this;
    }
    return res;
};

RawFO.prototype.Properties = function Properties(input) {
    var res = this._myRawFO.Properties;
    if (arguments.length > 0) {
        if (input !== null) {
            RawFO.ValidateProperties(input, true);
            input = lazy(input);
        }
        this._myRawFO.Properties = input || lazy([]);
        res = this;
    }
    return res;
};


//------------//
// Validation //
//------------//

RawFO.ValidateConstructorName = function ValidateConstructorName(input, throwErr) {
    var msg = '';

    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <RawFO>.ValidateConstructorName requires a typeof string argument';
    }

    if (typeof RawFO._ValidateConstructorName === 'function') {
        msg = msg || RawFO._ValidateConstructorName(input, throwErr);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

RawFO.ValidateImports = function ValidateImports(input, throwErr) {
    var msg = '';
    var initialInput = input;

    if (Array.isArray(input)) {
        input = lazy(input);
    }
    if (!Utils.instance_of(input, lazy.Sequence)) {
        msg = 'Invalid Argument: RawFO.ValidateImports requires an array or lazy.Sequence argument';
    } else if (!input.allInstanceOf(FOImport)) {
        msg = 'Invalid Argument: RawFO.ValidateImports requires an array of FOImport instances';
    }

    if (typeof RawFO._ValidateImports === 'function') {
        msg = msg || RawFO._ValidateImports(initialInput, throwErr);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

RawFO.ValidateStaticEnums = function ValidateStaticEnums(input, throwErr) {
    var msg = '';
    var initialInput = input;

    if (Array.isArray(input)) {
        input = lazy(input);
    }
    if (!Utils.instance_of(input, lazy.Sequence)) {
        msg = 'Invalid Argument: <RawFO>.ValidateStaticEnums requires an array or lazy.Sequence argument';
    } else if (!input.allInstanceOf(FOStaticEnum)) {
        msg = 'Invalid Argument: <RawFO>.ValidateStaticEnums requires an array of FOStaticEnum instances';
    }

    if (typeof RawFO._ValidateStaticEnums === 'function') {
        msg = msg || RawFO._ValidateStaticEnums(initialInput, throwErr);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

RawFO.ValidateProperties = function ValidateProperties(input, throwErr) {
    var msg = '';
    var initialInput = input;

    if (Array.isArray(input)) {
        input = lazy(input);
    }
    if (!Utils.instance_of(input, lazy.Sequence)) {
        msg = 'Invalid Argument: <RawFO>.ValidateProperties requires an array or lazy.Sequence argument';
    } else if (!input.allInstanceOf(FOProperty)) {
        msg = 'Invalid Argument: <RawFO>.ValidateProperties requires an array or lazy.Sequence of FOProperty instances';
    }

    if (typeof RawFO._ValidateProperties === 'function') {
        msg = msg || RawFO._ValidateProperties(initialInput, throwErr);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};


//----------//
// Equality //
//----------//

RawFO.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, RawFO) && Utils.instance_of(right, RawFO))) {
        throw new Error("RawFO.equals requires both arguments to be instance_of RawFO");
    }

    return left.ConstructorName() === right.ConstructorName()
        && left.Imports().equals(right.Imports(), FOImport.equals)
        && left.StaticEnums().equals(right.StaticEnums(), FOStaticEnum.equals)
        && left.Properties().equals(right.Properties(), FOProperty.equals);
};

RawFO.prototype.equals = function equals(other) {
    return RawFO.equals(this, other);
};


//---------------//
// Serialization //
//---------------//

RawFO.prototype.serialize = function serialize() {
    return {
        ConstructorName: this.ConstructorName()
        , Imports: this.Imports().serialize()
        , StaticEnums: this.StaticEnums().serialize()
        , Properties: this.Properties().serialize()
    };
};

RawFO.prototype.deserialize = function deserialize(jsonData) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <RawFO>.deserialize requires jsonData to be an instance_of Object");
    }

    // all keys must also reside in the keys declared under the '_myRawFO' object
    if (!lazy(Object.keys(jsonData)).allExistIn(Object.keys(self._myRawFO))) {
        throw new Error("Invalid Argument: <RawFO>.deserialize requires jsonData to be an object whose enumerable keys match RawFO's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        switch (aKey) {
            case 'Imports':
                var resImports = jsonData[aKey].map(function(importsJsonData) {
                    return new FOImport().deserialize(importsJsonData);
                });
                self.Imports(resImports);
                break;

            case 'StaticEnums':
                var resStaticEnums = jsonData[aKey].map(function(staticEnumJsonData) {
                    return new FOStaticEnum().deserialize(staticEnumJsonData);
                });
                self.StaticEnums(resStaticEnums);
                break;

            case 'Properties':
                var resProperties = jsonData[aKey].map(function(propertyJsonData) {
                    return new FOProperty().deserialize(propertyJsonData);
                });
                self.Properties(resProperties);
                break;

            default:
                self[aKey](jsonData[aKey]);
        }
    });

    return self;
};


//---------//
// Exports //
//---------//

module.exports = RawFO;
