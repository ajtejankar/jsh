'use strict';


let state = 'START', quoteChar, count = 0;
let rules = new Map();
let patternCommands = new Map();

rules.set(/['"`]/, char => {
  if (state === 'START') {
    state = 'QUOTE';
    quoteChar = char;
  } else if (state === 'QUOTE') {
    state = 'START';
    quoteChar = undefined;
  }
});

rules.set(/\\/, char => {
  if (state === 'QUOTE') {
    state = 'QUOTE_ESCAPE';
  }
});

rules.set(/\//, char => {
  if (state === 'START') {
    state = 'SLASH';
  } else if (state === 'SLASH') {
    state = 'COMMENT_SL';
  } else if (state === 'COMMENT_ML_END1') {
    state = 'START';
  }
});

rules.set(/\*/, char => {
  if (state === 'SLASH') {
    state = 'COMMENT_ML';
  } else if (state === 'COMMENT_ML') {
    state = 'COMMENT_ML_END1';
  }
});

rules.set(/[^\/]/, char => {
  if (state === 'COMMENT_ML_END1') {
    state = 'COMMENT_ML';
  }
});

rules.set(/[^\*\/]/, char => {
  if (state === 'SLASH') {
    state = 'QUOTE';
    quoteChar = '/';
  }
});

rules.set(/\n/, char => {
  if (state === 'COMMENT_SL') {
    state = 'START';
  }
});

rules.set(/\{/, char => {
  if (state === 'START') {
    count++;
  }
});

rules.set(/\}/, char => {
  if (state === 'START') {
    count--;
  }
});

rules.set(/./, char => {
  if (state === 'QUOTE_ESCAPE') {
    state = 'QUOTE';
  }
});

function separate(input) {
  input = input.trim();
  let separateAt = input.match(/\s/);

  if (separateAt === null) {
    throw new Error('Parsing Error');
  }

  let pattern = input.slice(0, separateAt.index);
  let rest = input.slice(separateAt.index + 1);
  rest = rest.trim();

  return { pattern: pattern, rest: rest };
}

function parse(input) {
  let sep = separate(input);
  let pattern = sep.pattern, rest = sep.rest;
  let command, i;

  for (i = 0; i < rest.length; i++) {
    for (let rule of rules.keys()) {
      if (rule.test(rest[i])) {
        rules.get(rule)(rest[i]);
      }
    }

    if (count === 0) {
      break;
    }
  }

  if (count === 0 && state === 'START' && quoteChar === undefined) {
    command = rest.slice(0, i + 1);
    patternCommands.set(pattern, command);

    rest = rest.slice(i + 1);
    rest = rest.trim();

    if (rest.length > 0) {
      parse(rest);
    }
  } else {
    throw new Error(`Parsing Error`);
  }
}
