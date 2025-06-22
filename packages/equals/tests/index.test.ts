import { describe, expect, test } from 'vitest';

import { deepEqual, shallowEqual } from '../src/index.js';

// Import all test suites
import './comparison.test.js';
import './deep.test.js';
import './shallow.test.js';

describe('package exports', () => {
  test('should export shallowEqual function', () => {
    expect(typeof shallowEqual).toBe('function');
    expect(shallowEqual.name).toBe('shallowEqual');
  });

  test('should export deepEqual function', () => {
    expect(typeof deepEqual).toBe('function');
    expect(deepEqual.name).toBe('deepEqual');
  });

  test('functions should work correctly', () => {
    // Basic functionality test
    expect(shallowEqual(1, 1)).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
  });
});
