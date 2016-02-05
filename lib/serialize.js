'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serialize;

var _utils = require('./utils');

function serialize(obj, paths, currentPath) {
  currentPath = currentPath || '';

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      var val = obj[key];
      var newPath = currentPath + '/' + key;

      paths = paths || {};
      paths[newPath] = val;

      if (!(0, _utils.isPrimitive)(val)) {
        paths = serialize(val, paths, newPath);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return paths;
}