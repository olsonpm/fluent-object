'use strict';


//---------//
// Imports //
//---------//

var nh = require('node-helpers')
    , Utils = require('node-utils')
    , RawFO = require('./RawFO');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//-------------//
// Constructor //
//-------------//

var Template = {
    this._myTemplate = {
        RawFOInst: null
    };

    this.RawFOInst = function(input) {
        var res = my.RawFOInst;
        if (arguments.length > 0) {
            if (input !== null) {
                Template.ValidateRawFOInst(input, true);
            }
            my.RawFOInst = input;
            res = self;
        }
        return res;
    };

    if (argsObj && typeof argsObj.jsonData !== 'undefined') {
        this._deserialize(argsObj.jsonData, my);
    } else if (arguments.length > 0) {
        throw new Error("Invalid Argument: `new Template` with arguments requires a jsonData property");
    }
}


//------------//
// Validation //
//------------//

Template.ValidateRawFOInst = function ValidateRawFOInst(input, throwErr) {
    var msg = '';
    if (Utils.instance_of(input, RawFO)) {
        msg = 'Invalid Argument: <Template>.ValidateRawFOInst requires a typeof string argument';
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    if (typeof Template._ValidateRawFOInst === "function") {
        msg = Template._ValidateRawFOInst(input);
    }

    return msg;
};


//---------------//
// Serialization //
//---------------//

Template.prototype.serialize = function serialize() {
    return {
        Constr: this.Constr()
        , Package: this.Package()
    };
};

Template.prototype._deserialize = function _deserialize(jsonData, my) {
    var self = this;

    if (!Utils.instance_of(jsonData, Object)) {
        throw new Error("Invalid Argument: <Template>._deserialize requires jsonData to be an instance_of Object");
    }

    // all keys must also reside in the keys declared under the 'my' object
    if (!lazy(Object.keys(jsonData)).allExistIn(Object.keys(my))) {
        throw new Error("Invalid Argument: <Template>._deserialize requires jsonData to be an object whose enumerable keys match Template's members");
    }

    // jsonData is valid - build from it
    Object.keys(jsonData).forEach(function(aKey) {
        self[aKey](jsonData[aKey]);
    });
};


//--------//
// Equals //
//--------//

Template.equals = function static_equals(left, right) {
    if (!(Utils.instance_of(left, Template) && Utils.instance_of(right, Template))) {
        throw new Error("Template.equals requires both arguments to be instance_of Template");
    }

    return left.Constr() === right.Constr()
        && left.Package() === right.Package();
};

Template.prototype.equals = function equals(other) {
    return Template.equals(this, other);
};


//---------//
// Exports //
//---------//

module.exports = Template;
