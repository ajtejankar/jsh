'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPrimitive = isPrimitive;
function isPrimitive(val) {
  var type = Object.prototype.toString.call(val);

  return !(type === '[object Object]' || type === '[object Array]');
}

exports.default = { isPrimitive: isPrimitive };