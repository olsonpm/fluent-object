'use strict';


//---------//
// Imports //
//---------//

var ExtendedTemplate = require('../base/ExtendedTemplate');


//-------------------//
// Static Extensions //
//-------------------//

ExtendedTemplate.PATH = path.join(__dirname, 'static/ejs-templates/extended.ejs');
ExtendedTemplate.bBuf = null;


//-----------------------//
// Prototyped Extensions //
//-----------------------//


//---------//
// Exports //
//---------//

module.exports = ExtendedTemplate;
