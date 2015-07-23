'use strict';


//---------//
// Imports //
//---------//

var BaseTemplate = require('../base/BaseTemplate');


//-------------------//
// Static Extensions //
//-------------------//

BaseTemplate.PATH = path.join(__dirname, 'static/ejs-templates/base.ejs');
BaseTemplate.bBuf = null;


//-----------------------//
// Prototyped Extensions //
//-----------------------//

BaseTemplate.prototype.LazyIsRequired = function LazyIsRequired() {
    var res = this.RawFOInst.Properties()
        .map(function(propertyInst) {
            return lazy(propertyInst.Constr());
        })
        .any(function(lazyConstr) {
            return lazyConstr.startsWith(FOProperty.SPECIAL.Lazy_array_of);
        });

    return res;
};

BaseTemplate.prototype.InitIsRequired = function InitIsRequired() {
    return this.LazyIsRequired();
};


//---------//
// Exports //
//---------//

module.exports = BaseTemplate;
