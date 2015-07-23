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


//------------//
// Properties //
//------------//

function FOImport(argsObj) {
    this._myFOImport = {
        Constr: null
        , Package: null
    };

    if (typeof this._init === 'function') {
        this._init(argsObj);
    }
}

FOImport.prototype.Constr = function(input) {
    var res = this._myFOImport.Constr;
    if (arguments.length > 0) {
        if (input !== null) {
            FOImport.ValidateConstr(input, true);
        }
        this._myFOImport.Constr = input;
        res = this;
    }
    return res;
};

FOImport.prototype.Package = function(input) {
    var res = this._myFOImport.Package;
    if (arguments.length > 0) {
        if (input !== null) {
            FOImport.ValidatePackage(input, true);
        }
        this._myFOImport.Package = input;
        res = this;
    }
    return res;
};


//------------//
// Validation //
//------------//

FOImport.ValidateConstr = function ValidateConstr(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <FOImport>.ValidateConstr requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    if (typeof FOImport._ValidateConstr === "function") {
        msg = FOImport._ValidateConstr(input);
    }

    return msg;
};

FOImport.ValidatePackage = function ValidatePackage(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <FOImport>.ValidatePackage requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    if (typeof FOImport._ValidatePackage === "function") {
        msg = FOImport._ValidatePackage(input);
    }

    return msg;
};


//---------------//
// Serialization //
//---------------//

FOImport.prototype.serialize = function serialize() {
    return {
        Constr: this.Constr()
        , Package: this.Package()
    };
};

FOImport.prototype.deserialize = function deserialize(jsonData) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <FOImport>.deserialize requires jsonData to be an instance_of Object");
    }

    // all keys must also reside in the keys declared under the '_myFOImport' object
    if (!lazy(Object.keys(jsonData)).allExistIn(Object.keys(self._myFOImport))) {
        throw new Error("Invalid Argument: <FOImport>.deserialize requires jsonData to be an object whose enumerable keys match FOImport's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });

    return self;
};


//--------//
// Equals //
//--------//

FOImport.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, FOImport) && Utils.instance_of(right, FOImport))) {
        throw new Error("FOImport.equals requires both arguments to be instance_of FOImport");
    }

    return left.Constr() === right.Constr()
        && left.Package() === right.Package();
};

FOImport.prototype.equals = function equals(other) {
    return FOImport.equals(this, other);
};


//---------//
// Exports //
//---------//

module.exports = FOImport;
