import { describe, expect, test } from 'vitest';

import { deepEqual } from '../src/index.js';

describe('deepEqual', () => {
  describe('primitive values', () => {
    test('should return true for identical primitive values', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('hello', 'hello')).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
      expect(deepEqual(false, false)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
    });

    test('should return false for different primitive values', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('hello', 'world')).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    test('should handle NaN correctly', () => {
      expect(deepEqual(NaN, NaN)).toBe(true);
      expect(deepEqual(NaN, 1)).toBe(false);
    });

    test('should handle numeric edge cases', () => {
      expect(deepEqual(0, -0)).toBe(true);
      expect(deepEqual(Infinity, Infinity)).toBe(true);
      expect(deepEqual(-Infinity, -Infinity)).toBe(true);
      expect(deepEqual(Infinity, -Infinity)).toBe(false);
    });
  });

  describe('objects', () => {
    test('should return true for same object reference', () => {
      const obj = { a: 1, b: 2 };
      expect(deepEqual(obj, obj)).toBe(true);
    });

    test('should return true for objects with same properties and values', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(deepEqual({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
    });

    test('should return false for objects with different properties', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    test('should return false for objects with different values', () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    test('should handle empty objects', () => {
      expect(deepEqual({}, {})).toBe(true);
      expect(deepEqual({}, { a: 1 })).toBe(false);
    });

    test('should handle objects with null/undefined values', () => {
      expect(deepEqual({ a: null }, { a: null })).toBe(true);
      expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true);
      expect(deepEqual({ a: null }, { a: undefined })).toBe(false);
    });
  });

  describe('nested objects', () => {
    test('should deeply compare nested objects', () => {
      const obj1 = {
        a: { x: 1, y: { z: 2 } },
        b: [1, 2, { c: 3 }],
      };
      const obj2 = {
        a: { x: 1, y: { z: 2 } },
        b: [1, 2, { c: 3 }],
      };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('should return false for nested objects with different values', () => {
      const obj1 = {
        a: { x: 1, y: { z: 2 } },
        b: [1, 2, { c: 3 }],
      };
      const obj2 = {
        a: { x: 1, y: { z: 3 } }, // different z value
        b: [1, 2, { c: 3 }],
      };
      expect(deepEqual(obj1, obj2)).toBe(false);
    });

    test('should handle deeply nested structures', () => {
      const deep1 = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };
      const deep2 = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 'deep',
              },
            },
          },
        },
      };
      expect(deepEqual(deep1, deep2)).toBe(true);
    });
  });

  describe('arrays', () => {
    test('should return true for same array reference', () => {
      const arr = [1, 2, 3];
      expect(deepEqual(arr, arr)).toBe(true);
    });

    test('should return true for arrays with same elements', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual([], [])).toBe(true);
    });

    test('should return false for arrays with different elements', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('should deeply compare nested arrays', () => {
      expect(deepEqual([1, [2, [3]]], [1, [2, [3]]])).toBe(true);
      expect(deepEqual([1, [2, [3]]], [1, [2, [4]]])).toBe(false);
    });

    test('should compare arrays with objects', () => {
      const arr1 = [1, { a: 2 }, [3, { b: 4 }]];
      const arr2 = [1, { a: 2 }, [3, { b: 4 }]];
      const arr3 = [1, { a: 2 }, [3, { b: 5 }]];

      expect(deepEqual(arr1, arr2)).toBe(true);
      expect(deepEqual(arr1, arr3)).toBe(false);
    });

    test('should handle sparse arrays', () => {
      const sparse1 = new Array(3);
      sparse1[1] = 'test';
      const sparse2 = new Array(3);
      sparse2[1] = 'test';
      expect(deepEqual(sparse1, sparse2)).toBe(true);
    });
  });

  describe('special objects', () => {
    test('should handle Date objects', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');

      expect(deepEqual(date1, date1)).toBe(true);
      expect(deepEqual(date1, date2)).toBe(true);
      expect(deepEqual(date1, date3)).toBe(false);
    });

    test('should handle RegExp objects', () => {
      const regex1 = /abc/gi;
      const regex2 = /abc/gi;
      const regex3 = /def/gi;
      const regex4 = /abc/g; // different flags

      expect(deepEqual(regex1, regex1)).toBe(true);
      expect(deepEqual(regex1, regex2)).toBe(true);
      expect(deepEqual(regex1, regex3)).toBe(false);
      expect(deepEqual(regex1, regex4)).toBe(false);
    });

    test('should handle String objects', () => {
      const str1 = new String('hello');
      const str2 = new String('hello');
      const str3 = new String('world');

      expect(deepEqual(str1, str1)).toBe(true);
      expect(deepEqual(str1, str2)).toBe(true);
      expect(deepEqual(str1, str3)).toBe(false);
      expect(deepEqual(str1, 'hello')).toBe(false); // different types
    });

    test('should handle Number objects', () => {
      const num1 = new Number(42);
      const num2 = new Number(42);
      const num3 = new Number(43);

      expect(deepEqual(num1, num1)).toBe(true);
      expect(deepEqual(num1, num2)).toBe(true);
      expect(deepEqual(num1, num3)).toBe(false);
      expect(deepEqual(num1, 42)).toBe(false); // different types
    });

    test('should handle functions', () => {
      const fn1 = () => 'test';
      const fn2 = () => 'test';

      expect(deepEqual(fn1, fn1)).toBe(true);
      expect(deepEqual(fn1, fn2)).toBe(false); // different function instances
    });
  });

  describe('mixed types', () => {
    test('should return false when comparing different types', () => {
      expect(deepEqual(1, '1')).toBe(false);
      expect(deepEqual(true, 1)).toBe(false);
      expect(deepEqual(null, 0)).toBe(false);
      expect(deepEqual(undefined, null)).toBe(false);
      expect(deepEqual({}, [])).toBe(false);
      expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
    });
  });

  describe('circular references', () => {
    test('should handle circular references', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2: any = { a: 1 };
      obj2.self = obj2;

      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj1, obj1)).toBe(true);
    });

    test('should handle different circular references', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2: any = { a: 2 }; // different value
      obj2.self = obj2;

      expect(deepEqual(obj1, obj2)).toBe(false);
    });

    test('should handle complex circular references', () => {
      const obj1: any = { a: { b: 1 } };
      obj1.a.parent = obj1;

      const obj2: any = { a: { b: 1 } };
      obj2.a.parent = obj2;

      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('should handle array circular references', () => {
      const arr1: any = [1, 2];
      arr1.push(arr1);

      const arr2: any = [1, 2];
      arr2.push(arr2);

      expect(deepEqual(arr1, arr2)).toBe(true);
    });
  });

  describe('edge cases', () => {
    test('should handle large numbers', () => {
      expect(deepEqual(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toBe(
        true,
      );
      expect(deepEqual(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).toBe(
        true,
      );
      expect(deepEqual(Number.MAX_VALUE, Number.MAX_VALUE)).toBe(true);
    });

    test('should handle complex nested structures', () => {
      const complex1 = {
        users: [
          { id: 1, name: 'John', tags: ['dev', 'js'] },
          { id: 2, name: 'Jane', tags: ['design', 'css'] },
        ],
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            sms: { enabled: true, number: '+1234567890' },
          },
        },
        metadata: {
          created: new Date('2023-01-01'),
          version: '1.0.0',
        },
      };

      const complex2 = {
        users: [
          { id: 1, name: 'John', tags: ['dev', 'js'] },
          { id: 2, name: 'Jane', tags: ['design', 'css'] },
        ],
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            sms: { enabled: true, number: '+1234567890' },
          },
        },
        metadata: {
          created: new Date('2023-01-01'),
          version: '1.0.0',
        },
      };

      expect(deepEqual(complex1, complex2)).toBe(true);
    });

    test('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const obj1 = { [sym]: 'value', a: 1 };
      const obj2 = { [sym]: 'value', a: 1 };

      // Symbols are not enumerable, so only 'a' is compared
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    test('should handle objects with inherited properties', () => {
      const parent = { inherited: 'value' };
      const child1 = Object.create(parent);
      child1.own = { nested: 'prop1' };
      const child2 = Object.create(parent);
      child2.own = { nested: 'prop1' };

      // Only own properties are compared
      expect(deepEqual(child1, child2)).toBe(true);
    });

    test('should handle empty values in arrays and objects', () => {
      expect(deepEqual([undefined, null, ''], [undefined, null, ''])).toBe(
        true,
      );
      expect(
        deepEqual(
          { a: undefined, b: null, c: '' },
          { a: undefined, b: null, c: '' },
        ),
      ).toBe(true);
    });
  });
});
