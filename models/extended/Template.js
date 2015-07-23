'use strict';


//---------//
// Imports //
//---------//

var Template = require('../base/Template')
    , bFs = require('fs-bluebird');


//-------------------//
// Static Extensions //
//-------------------//

Template.Path = path.join(__dirname, 'static/ejs-templates/extended.ejs');
Template.bBuf = null;


//-----------------------//
// Prototyped Extensions //
//-----------------------//

Template.prototype.bReadTemplate = function bReadTemplate() {
    if (typeof this.constructor.bBuf === 'undefined'
        || typeof this.constructor.PATH === 'undefined') {

        throw new Error("Invalid Use: The concrete template you are using doesn't implement a static PATH or bBuf.");
    }

    var bRes;
    if (this.constructor.bBuf === null) {
        this.constructor.bBuf = bFs.readFileAsync(this.constructor.PATH);
    }

    return this.constructor.bBuf;
};


//---------//
// Exports //
//---------//

module.exports = Template;
