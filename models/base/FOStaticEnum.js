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


//-------------//
// Constructor //
//-------------//

function FOStaticEnum(argsObj) {
    this._myFOStaticEnum = {
        Name: null
        , Contents: null
    };

    if (typeof this._init === 'function') {
        this._init(argsObj);
    }
}

FOStaticEnum.prototype.Name = function(input) {
    var res = this._myFOStaticEnum.Name;
    if (arguments.length > 0) {
        if (input !== null) {
            FOStaticEnum.ValidateName(input, true);
        }
        this._myFOStaticEnum.Name = input;
        res = this;
    }
    return res;
};

FOStaticEnum.prototype.Contents = function(input) {
    var res = this._myFOStaticEnum.Contents;
    if (arguments.length > 0) {
        if (input !== null) {
            FOStaticEnum.ValidateContents(input, true);
        }
        this._myFOStaticEnum.Contents = input;
        res = this;
    }
    return res;
};


//------------//
// Validation //
//------------//

FOStaticEnum.ValidateName = function ValidateName(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <FOStaticEnum>.ValidateName requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};

FOStaticEnum.ValidateContents = function ValidateContents(input, throwErr) {
    var msg = '';
    if (!Utils.instance_of(input, Object)) {
        msg = 'Invalid Argument: <FOStaticEnum>.ValidateContents requires a typeof object argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};


//--------//
// Equals //
//--------//

FOStaticEnum.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, FOStaticEnum) && Utils.instance_of(right, FOStaticEnum))) {
        throw new Error("FOStaticEnum.equals requires both arguments to be instance_of FOStaticEnum");
    }

    return left.Name() === right.Name()
        && Utils.deepEquals(left.Contents(), right.Contents());
};

FOStaticEnum.prototype.equals = function equals(other) {
    return FOStaticEnum.equals(this, other);
};


//---------------//
// Serialization //
//---------------//

FOStaticEnum.prototype.serialize = function serialize() {
    return {
        Name: this.Name()
        , Contents: this.Contents()
    };
};

FOStaticEnum.prototype.deserialize = function deserialize(jsonData) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <FOStaticEnum>.deserialize requires jsonData to be an instance_of Object");
    }

    // all keys must also reside in the keys declared under the '_myFOStaticEnum' object
    if (!lazy(Object.keys(jsonData)).allExistIn(Object.keys(self._myFOStaticEnum))) {
        throw new Error("Invalid Argument: <FOStaticEnum>.deserialize requires jsonData to be an object whose enumerable keys match FOStaticEnum's members");
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

module.exports = FOStaticEnum;
