'use strict';


//---------//
// Imports //
//---------//

var bPromise = require('bluebird')
    , bFs = require('fs-bluebird')
    , bCp = bPromise.promisify(require('cp'))
    , path = require('path')
    , RawFO = require('../models/extended/RawFO')
    , FOProperty = require('../models/extended/FOProperty')
    , bMkdirp = bPromise.promisify(require('mkdirp'))
    , nh = require('node-helpers');


//------//
// Init //
//------//

var lazy = nh.lazyExtensions;


//------//
// Main //
//------//

function init(rootDir) {
    var foDir = path.join(rootDir, 'fluent-objects');
    return bMkdirp(path.join(foDir))
        .then(function() {
            return bPromise.all([
                bMkdirp(path.join(foDir, 'raw'))
                , bMkdirp(path.join(foDir, 'base'))
                , bMkdirp(path.join(foDir, 'extended'))
            ]);
        })
        .then(function() {
            var resFile = path.join(foDir, 'raw/example.json');
            return bCp(path.join(__dirname, 'static/example.json'), resFile);
        });
}

function buildAllFiles(rawDir, baseDir, extendedDir) {
    return bFs.readdirAsync(rawDir)
        .catch(function(err) {
            throw new Error("Invalid Argument: rawDir '" + rawDir + "' was unable to be read"
                + "\n\nInner Exception:\n" + err);
        })
        // get all raw file names, filter by .json extension, and return a promise of all the built files
        .then(function(filesArr) {
            return bPromise.all(
                filesArr.filter(function(basename) {
                    return path.extname(basename) === '.json';
                })
                .map(function(basename) {
                    return buildOneFile(path.join(rawDir, basename), baseDir, extendedDir);
                })
            );
        });
}

function buildOneFile(fullPath, baseDir, extendedDir) {
    return bFs.readFileAsync(fullPath)
        .then(function(rawFObuf) {
            var bRes;

            var parsed = JSON.parse(rawFObuf.toString());
            if (Array.isArray(parsed)) {
                bRes = bPromise.all([
                    parsed.map(function(rawFObufJson) {
                        return buildRawFO(
                            new RawFO({
                                jsonData: rawFObufJson
                            })
                            , baseDir
                            , extendedDir
                        );
                    })
                ]);
            } else {
                // else assume parsed is a single RawFO instance

                bRes = buildRawFO(
                    new RawFO({
                        jsonData: parsed
                    })
                    , baseDir
                    , extendedDir
                );
            }

            return bRes;
        });
}

function buildRawFO(rawFoInst, baseDir, extendedDir) {
    var fileName = rawFoInst.FileName()
        , baseTemplateInst = new BaseTemplate().RawFOInst(rawFoInst)
        , extendedTemplateInst = new ExtendedTemplate().RawFOInst(rawFoInst);

    return bPromise.all([
            baseTemplateInst.bReadTemplate('base')
            , extendedTemplateInst.bReadTemplate('extended')
        ])
        .spread(function(baseEjs, extEjs) {
            var compiledBase = template(baseEjs);
            var compiledExt = template(extEjs, {
                'imports': {
                    FOProperty: FOProperty
                }
            });

            var baseTemplateModel = new BaseTemplate()
                .RawFOInst(rawFoInst);

            var extTemplateModel = new ExtendedTemplate()
                .RawFOInst(rawFoInst);

            return bPromise.all([
                bFs.writeFileAsync(
                    path.join(baseDir, fileName)
                    , compiledBase(baseTemplateArgs)
                )
                , bFs.writeFileAsync(
                    path.join(extendedDir, fileName)
                    , compiledExt(extTemplateArgs)
                )
            ]);
        });
}


//---------//
// Exports //
//---------//

module.exports = {
    init: init
    , buildAllFiles: buildAllFiles
    , buildOneFile: buildOneFile
    , buildRawFO: buildRawFO
};
