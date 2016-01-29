import { parse } from '../lib/parser';
import { assert } from 'chai';

describe('parser', () => {
  it('should handle single line pattern action pair', () => {
    let input = `**/dep/*.!{html.js} { pf($key) }`;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', '{ pf($key) }');

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle multi line pattern action pair', () => {
    let input = `
      **/dep/*.!{html.js} { pf($key) }
      **/dep/*.!{html.js} { pf($key) }
    `;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', '{ pf($key) }');
    expectedOutput.set('**/dep/*.!{html.js}', '{ pf($key) }');

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle single pattern action pair with multi line action', () => {
    let input = `
      **/dep/*.!{html.js} {
        pf($key);
        pf($val);
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();
    let outputAction = `{
        pf($key);
        pf($val);
    }`;

    expectedOutput.set('**/dep/*.!{html.js}', outputAction);

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle multiple pattern action pair with multi line action', () => {
    let input = `
      **/dep/*.!{html.js} {
        pf($key);
        pf($val);
      }

      **/dep/*.!{html.js} {
        pf($key);
        pf($val);
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();
    let outputAction = `{
        pf($key);
        pf($val);
    }`;

    expectedOutput.set('**/dep/*.!{html.js}', outputAction);
    expectedOutput.set('**/dep/*.!{html.js}', outputAction);

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle single line comments in actions', () => {
    let input = `
      **/dep/*.!{html.js} {
        // single line comment
        pf($key);
        pf($val); // another single line comment
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', `{
        // single line comment
        pf($key);
        pf($val); // another single line comment
      }
    `);

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle multi line comments in actions', () => {
    let input = `
      **/dep/*.!{html.js} {
        /*
          multi line comment
         */
        pf($key);
        pf($val);
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', `{
        /*
          multi line comment
         */
        pf($key);
        pf($val);
      }
    `);

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle regex literals in actions', () => {
    let input = `
      **/dep/*.!{html.js} {
        let regex = /'random\\/"art"\\{bram\\}'/g;
        pf($key);
        pf($val);
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', `{
        let regex = /random\\/art\\{bram\\}/g;
        pf($key);
        pf($val);
      }
    `);

    assert.deepEqual(output, expectedOutput);
  });

  it('should handle quote literals literals in actions', () => {
    let input = `
      **/dep/*.!{html.js} {
        let quote1 = 'random { } "\` art/';
        let quote2 = "random { } '\` art"
        let quote3 = \`random { } art\`;
        pf($key);
        pf($val);
      }
    `;
    let output = parse(input);
    let expectedOutput = new Map();

    expectedOutput.set('**/dep/*.!{html.js}', `{
        let quote1 = 'random { } art';
        let quote2 = "random { } art"
        let quote3 = \`random { } art\`;
        pf($key);
        pf($val);
      }
    `);

    assert.deepEqual(output, expectedOutput);
  });
});
