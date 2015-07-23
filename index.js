'use strict';

module.exports = {
    api: require('./lib/fo-api')
    , MODELS: {
        RawFO: require('./models/extended/RawFO')
        , FOProperty: require('./models/extended/FOProperty')
        , FOStaticEnum: require('./models/extended/FOStaticEnum')
        , FOImport: require('./models/extended/FOImport')
    }
}
