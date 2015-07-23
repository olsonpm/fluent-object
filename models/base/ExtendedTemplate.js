'use strict';


//---------//
// Imports //
//---------//

var Template = require('./Template');


//-------------//
// Constructor //
//-------------//

function ExtendedTemplate(argsObj) {
    Template.call(this, argsObj);
}

ExtendedTemplate.prototype = Object.create(Template);
ExtendedTemplate.prototype.constructor = ExtendedTemplate;


//---------//
// Exports //
//---------//

module.exports = BaseTempalte;
