'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , Utils = require('node-utils');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//--------------//
// Static Enums //
//--------------//

FOProperty.SPECIAL = {
    Static_enum: "Static_enum"
    , Lazy_array_of: "Lazy_array_of"
};

FOProperty.BUILTINS = {
    String: "String"
    , Boolean: "Boolean"
    , Number: "Number"
    , Date: "Date"
    , Array: "Array"
    , Object: "Object"
};

FOProperty.FLAGS = {
    back_end: "back_end"
    , not_null: "not_null"
};


//-------------//
// Constructor //
//-------------//

function FOProperty(argsObj) {
    this._myFOProperty = {
        Name: null
        , Constr: null
        , Flags: lazy([])
        , DefaultValue: null
        , Nullable: true
    };

    if (typeof this._init === 'function') {
        this._init(argsObj);
    }
}

FOProperty.prototype.Name = function(input) {
    var res = this._myFOProperty.Name;
    if (arguments.length > 0) {
        if (input !== null) {
            FOProperty.ValidateName(input, true);
        }
        this._myFOProperty.Name = input;
        res = this;
    }
    return res;
};

FOProperty.prototype.Constr = function(input) {
    var res = this._myFOProperty.Constr;
    if (arguments.length > 0) {
        if (input !== null) {
            FOProperty.ValidateConstr(input, true);
        }
        this._myFOProperty.Constr = input;
        res = this;
    }
    return res;
};

FOProperty.prototype.Flags = function(input) {
    var res = this._myFOProperty.Flags;
    if (arguments.length > 0) {
        if (input !== null) {
            FOProperty.ValidateFlags(input, true);
            input = lazy(input);
        }
        this._myFOProperty.Flags = input || lazy([]);
        res = this;
    }
    return res;
};

FOProperty.prototype.DefaultValue = function(input) {
    var res = this._myFOProperty.DefaultValue;
    if (arguments.length > 0) {
        if (input !== null) {
            FOProperty.ValidateDefaultValue(input, true);
        }
        this._myFOProperty.DefaultValue = input;
        res = this;
    }
    return res;
};


//------------//
// Validation //
//------------//

FOProperty.ValidateName = function ValidateName(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <FOProperty>.ValidateName requires a typeof string argument';
    }

    if (typeof FOProperty._ValidateName === "function") {
        msg = FOProperty._ValidateName(input);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

FOProperty.ValidateConstr = function ValidateConstr(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <FOProperty>.ValidateConstr requires a typeof string argument';
    }

    if (typeof FOProperty._ValidateConstr === "function") {
        msg = FOProperty._ValidateConstr(input);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

FOProperty.ValidateFlags = function ValidateFlags(input, throwErr) {
    var msg = '';

    if (!Array.isArray(input)) {
        msg = 'Invalid Argument: <FOProperty>.ValidateFlags requires an Array.isArray argument';
    } else if (!lazy(input).allExistIn(lazy(FOProperty.FLAGS).values().toArray())) {
        msg = 'Invalid Argument: <FOProperty>.ValidateFlags requires all flags to exist in the FOProperty.FLAGS object';
    }

    if (typeof FOProperty._ValidateFlags === "function") {
        msg = FOProperty._ValidateFlags(input);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

FOProperty.ValidateDefaultValue = function ValidateDefaultValue(input, throwErr) {
    var msg = '';

    if (typeof FOProperty._ValidateDefaultValue === "function") {
        msg = FOProperty._ValidateDefaultValue(input);
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};


//--------//
// Equals //
//--------//

FOProperty.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, FOProperty) && Utils.instance_of(right, FOProperty))) {
        throw new Error("FOProperty.equals requires both arguments to be instance_of FOProperty");
    }

    return left.Name() === right.Name()
        && left.Constr() === right.Constr()
        && left.Flags().equals(right.Flags());
};

FOProperty.prototype.equals = function equals(other) {
    return FOProperty.equals(this, other);
};


//---------------//
// Serialization //
//---------------//

FOProperty.prototype.serialize = function serialize() {
    return {
        Name: this.Name()
        , Constr: this.Constr()
        , Flags: this.Flags().toArray()
    };
};

FOProperty.prototype.deserialize = function deserialize(jsonData) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <FOProperty>.deserialize requires jsonData to be an instance_of Object");
    }

    // all keys must also reside in the keys declared under the '_myFOProperty' object
    if (!lazy(Object.keys(jsonData)).allExistIn(Object.keys(self._myFOProperty))) {
        throw new Error("Invalid Argument: <FOProperty>.deserialize requires jsonData to be an object whose enumerable keys match FOProperty's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });

    return self;
};


//---------//
// Exports //
//---------//

module.exports = FOProperty;
