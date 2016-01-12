#!/usr/bin/env node

//TODO: support BEGIN and END patterns like awk
//TODO: support multiline actions (better script parser)
//TODO: support empty pattern which executes for all paths
//TODO: support json pretty printing function
//TODO: support printf function (does console.log support it?)

'use strict';

function execAction($, $key, $val, action) {
  let pf = console.log, bn = require('path').basename;
  eval(action);
}

(() => {
  let minimatch = require('minimatch');

  function isPrimitive(val) {
    let type = Object.prototype.toString.call(val);
    return !(type === '[object Object]' || type === '[object Array]');
  }

  function serialize(obj, paths, currentPath) {
    paths = paths || {};
    currentPath = currentPath || '';

    for (let key of Object.keys(obj)) {
      let val = obj[key];
      let newPath = `${currentPath}/${key}`;

      if (isPrimitive(val)) {
        paths[newPath] = val;
      } else {
        paths = serialize(val, paths, newPath);
      }
    }

    return paths;
  }

  function throwError(bool, msg) {
    if (!bool) {
      throw new Error(msg);
    }
  }

  function parseScript(script) {
    let commands = [];

    script.split(/\n|\r\n/).forEach(command => {
      let separateAt = command.trim().match(/\s/);

      if (!separateAt) return;

      separateAt = separateAt.index + 1;
      let pattern = command.slice(0, separateAt);
      let action = command.slice(separateAt).trim();
      let parseAction = action.match(/\{([^\}]+)\}/);

      if (!pattern) return;

      throwError(!parseAction, `Failed to parse the command: ${command}`);
      action = parseAction.pop();
      throwError(!action, `Failed to parse the command: ${command}`);
      commands.push({pattern: pattern, action: action});
    });

    return commands;
  }

  let input = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', data => input += data);
  process.stdin.on('end', () => {
    try {
      let pairs = serialize(JSON.parse(input));
      let commands = parseScript(process.argv[2] || '');
      let paths = Object.keys(pairs);

      paths.forEach(pth => {
        commands.forEach(command => {
          if (minimatch(pth, command.pattern)) {
            let val = pairs[pth];

            execAction(pairs, pth, val, command.action);
          }
        });
      });
    } catch(e) {
      console.log(e.stack || e);
    }
  });
})();
