'use strict';


//---------//
// Imports //
//---------//

var Handlebars = require('handlebars')
    , bFs = require('fs-bluebird');


//------//
// Main //
//------//

function getImports(rawFoInst) {
    var importList = getImportList(rawFoInst);

    return bFs.readFileAsync('./get-imports.hb')
        .then(function(contents) {
            var compiledTemplate = Handlebars.compile(contents);
            return compiledTemplate({
                importList = importList.toString()
            });
        });
}


//------------------//
// Helper Functions //
//------------------//

function getImportList(rawFoInst) {
    return rawFoInst.Imports()
        .map(function(importInst) {
            var constr = '';
            if (importInst.Package() !== importInst.Constr()) {
                constr = '.' + importInst.Constr();
            }

            return 'var ' + importInst.Constr() + ' = require(' + importInst.Package() + ')' + constr;
        });
}


//---------//
// Exports //
//---------//

module.exports = getImports; <%

%>

<%
});

if (importLazy) { %>
    var nh = require('node-helpers'); <%
}
