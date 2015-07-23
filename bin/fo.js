#!/usr/bin/env node

'use strict';


//---------//
// Imports //
//---------//

var commander = require('commander')
    , foApi = require('../lib/fo-api');


//------//
// Main //
//------//

commander
    .version('0.1.0');

commander
    .command('init')
    .description("initializes the 'fluent-objects' directory")
    .action(function() {
        return foApi.init(process.cwd());
    });

commander
    .command('build-all')
    .description("builds base models from the raw objects")
    .action(function() {
        var foDir = './fluent-objects/'
            , rawDir = foDir + 'raw'
            , baseDir = foDir + 'base'
            , extDir = foDir + 'extended';

        return foApi.buildAll(rawDir, baseDir, extDir);
    });

commander.parse(process.argv);

if (commander.args.length != 1) {
    console.log(commander.helpInformation());
    return;
}
