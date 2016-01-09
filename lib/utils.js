'use strict';

function isPrimitive(val) {
  let type = Object.prototype.toString.call(val);

  if (type === '[object Object]' || type === '[object Array]') {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isPrimitive: isPrimitive,
};
