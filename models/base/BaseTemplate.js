'use strict';


//---------//
// Imports //
//---------//

var Template = require('./Template');


//-------------//
// Constructor //
//-------------//

function BaseTemplate(argsObj) {
    Template.call(this, argsObj);
}

BaseTemplate.prototype = Object.create(Template);
BaseTemplate.prototype.constructor = BaseTemplate;


//---------//
// Exports //
//---------//

module.exports = BaseTempalte;
