#!/usr/bin/env node

//TODO: support BEGIN and END patterns like awk
//TODO: support reading input json file name from arguments
//TODO: support empty pattern which executes for all paths
//TODO: support json pretty printing function
//TODO: support printf function (only simpler versions are supported)

'use strict';

function execAction($, $key, $val, action) {
  let pf = console.log, bn = require('path').basename;
  // jshint -W061
  eval(action);
}

(() => {
  let minimatch = require('minimatch');
  let lib = require('../lib');

  function throwError(bool, msg) {
    if (!bool) {
      throw new Error(msg);
    }
  }

  let input = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', data => input += data);
  process.stdin.on('end', () => {
    try {
      let pairs = lib.serialize(JSON.parse(input));
      // TODO: path like input from command line is replaced
      // with windows style paths on git bash, what happens elsewhere?
      let commands = lib.parse(process.argv[2] || '');

      for (let pth of Object.keys(pairs)) {
        for (let command of commands) {
          if (minimatch(pth, command[0])) {
            let val = pairs[pth];

            execAction(pairs, pth, val, command[1]);
          }
        }
      }
    } catch (e) {
      console.log(e.stack || e);
    }
  });
})();
