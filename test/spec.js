'use strict';

let serialize = require('../lib/serialize');
let utils = require('../lib/utils');
let assert = require('chai').assert;

describe('serialize', () => {
  it('should handle complex objects', function() {
    let input = {
      number: 1,
      boolean: false,
      string: 'some',
      array: [1, 2, 3, {random: 'random'}],
      object: {some: 'some'}
    };
    let result = serialize(input);

    assert.deepEqual(result, {
      '/number': 1,
      '/boolean': false,
      '/string': 'some',
      '/array/0': 1,
      '/array/1': 2,
      '/array/2': 3,
      '/array/3/random': 'random',
      '/object/some': 'some'
    });
  });
});

describe('utils', () => {
  describe('isPrimitive', () => {
    let isPrimitive = utils.isPrimitive;

    it('should handle values allowed in JSON', () => {
      assert.isTrue(isPrimitive(10), 'number');
      assert.isTrue(isPrimitive('some'), 'string');
      assert.isTrue(isPrimitive(false), 'boolean');
      assert.isTrue(isPrimitive(null), 'null');
      assert.isFalse(isPrimitive([]), 'array');
      assert.isFalse(isPrimitive({}), 'object');
    });
  });
});
