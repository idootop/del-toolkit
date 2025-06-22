import { describe, expect, test } from 'vitest';

import { deepEqual, shallowEqual } from '../src/index.js';

describe('shallowEqual vs deepEqual comparison', () => {
  describe('behavior differences', () => {
    test('nested objects - shallowEqual compares references, deepEqual compares values', () => {
      const obj1 = { a: { x: 1 }, b: 2 };
      const obj2 = { a: { x: 1 }, b: 2 };

      // Different references for nested objects
      expect(shallowEqual(obj1, obj2)).toBe(false);
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('nested arrays - shallowEqual vs deepEqual', () => {
      const arr1 = [1, [2, 3], 4];
      const arr2 = [1, [2, 3], 4];

      expect(shallowEqual(arr1, arr2)).toBe(false);
      expect(deepEqual(arr1, arr2)).toBe(true);
    });

    test('complex nested structures', () => {
      const complex1 = {
        user: { name: 'John', preferences: { theme: 'dark' } },
        items: [1, { id: 2, tags: ['a', 'b'] }],
      };
      const complex2 = {
        user: { name: 'John', preferences: { theme: 'dark' } },
        items: [1, { id: 2, tags: ['a', 'b'] }],
      };

      expect(shallowEqual(complex1, complex2)).toBe(false);
      expect(deepEqual(complex1, complex2)).toBe(true);
    });

    test('shared references - both should return true', () => {
      const sharedNested = { x: 1, y: 2 };
      const obj1 = { a: sharedNested, b: 'test' };
      const obj2 = { a: sharedNested, b: 'test' };

      expect(shallowEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj1, obj2)).toBe(true);
    });
  });

  describe('performance implications', () => {
    test('shallowEqual stops at first level', () => {
      // Large nested structure - shallowEqual won't traverse deep
      const createDeepObject = (depth: number): any => {
        if (depth === 0) return { value: Math.random() };
        return { nested: createDeepObject(depth - 1) };
      };

      const deep1 = createDeepObject(100);
      const deep2 = createDeepObject(100);

      // shallowEqual only checks if 'nested' property references are the same
      expect(shallowEqual(deep1, deep2)).toBe(false);
      expect(deepEqual(deep1, deep2)).toBe(false); // different random values
    });

    test('array length differences - both should be fast', () => {
      const short = [1, 2, 3];
      const long = new Array(10000).fill(0).map((_, i) => i);

      // Both should quickly determine arrays are different
      expect(shallowEqual(short, long)).toBe(false);
      expect(deepEqual(short, long)).toBe(false);
    });
  });

  describe('React-specific scenarios', () => {
    test('props comparison in React components', () => {
      // Typical React props scenario
      const props1 = {
        title: 'Hello',
        user: { id: 1, name: 'John' },
        onClick: () => {},
      };
      const props2 = {
        title: 'Hello',
        user: { id: 1, name: 'John' }, // different object reference
        onClick: () => {}, // different function reference
      };

      // shallowEqual (React.memo behavior) - component would re-render
      expect(shallowEqual(props1, props2)).toBe(false);

      // deepEqual would compare object contents
      expect(deepEqual(props1, props2)).toBe(false); // functions are different
    });

    test('state comparison scenarios', () => {
      const state1 = {
        loading: false,
        data: [{ id: 1, name: 'Item 1' }],
        filters: { active: true },
      };
      const state2 = {
        loading: false,
        data: [{ id: 1, name: 'Item 1' }],
        filters: { active: true },
      };

      // shallowEqual would trigger re-render
      expect(shallowEqual(state1, state2)).toBe(false);

      // deepEqual recognizes content equality
      expect(deepEqual(state1, state2)).toBe(true);
    });
  });

  describe('edge cases where both behave similarly', () => {
    test('primitive values', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(deepEqual(1, 1)).toBe(true);

      expect(shallowEqual('hello', 'world')).toBe(false);
      expect(deepEqual('hello', 'world')).toBe(false);
    });

    test('null and undefined', () => {
      expect(shallowEqual(null, null)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);

      expect(shallowEqual(undefined, null)).toBe(false);
      expect(deepEqual(undefined, null)).toBe(false);
    });

    test('same object reference', () => {
      const obj = { a: { b: { c: 1 } } };

      expect(shallowEqual(obj, obj)).toBe(true);
      expect(deepEqual(obj, obj)).toBe(true);
    });

    test('flat objects with primitive values', () => {
      const obj1 = { a: 1, b: 'test', c: true };
      const obj2 = { a: 1, b: 'test', c: true };

      expect(shallowEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj1, obj2)).toBe(true);
    });
  });

  describe('when to use which function', () => {
    test('use shallowEqual for React optimization', () => {
      // Flat props object - perfect for shallowEqual
      const flatProps1 = { title: 'Test', count: 5, active: true };
      const flatProps2 = { title: 'Test', count: 5, active: true };

      expect(shallowEqual(flatProps1, flatProps2)).toBe(true);
      // This would be efficient for React.memo
    });

    test('use deepEqual for complex data structures', () => {
      // Complex API response comparison
      const apiResponse1 = {
        data: {
          users: [
            { id: 1, profile: { name: 'John', settings: { theme: 'dark' } } },
          ],
        },
        meta: { total: 1, page: 1 },
      };
      const apiResponse2 = {
        data: {
          users: [
            { id: 1, profile: { name: 'John', settings: { theme: 'dark' } } },
          ],
        },
        meta: { total: 1, page: 1 },
      };

      expect(deepEqual(apiResponse1, apiResponse2)).toBe(true);
      // This is where deepEqual excels
    });
  });
});
