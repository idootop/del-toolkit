import { describe, expect, test } from 'vitest';

import { shallowEqual } from '../src/index.js';

describe('shallowEqual', () => {
  describe('primitive values', () => {
    test('should return true for identical primitive values', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual('hello', 'hello')).toBe(true);
      expect(shallowEqual(true, true)).toBe(true);
      expect(shallowEqual(false, false)).toBe(true);
      expect(shallowEqual(null, null)).toBe(true);
      expect(shallowEqual(undefined, undefined)).toBe(true);
    });

    test('should return false for different primitive values', () => {
      expect(shallowEqual(1, 2)).toBe(false);
      expect(shallowEqual('hello', 'world')).toBe(false);
      expect(shallowEqual(true, false)).toBe(false);
      expect(shallowEqual(null, undefined)).toBe(false);
      expect(shallowEqual(0, false)).toBe(false);
      expect(shallowEqual('', false)).toBe(false);
    });

    test('should handle NaN correctly', () => {
      expect(shallowEqual(NaN, NaN)).toBe(true);
      expect(shallowEqual(NaN, 1)).toBe(false);
    });

    test('should handle +0 and -0 correctly', () => {
      expect(shallowEqual(0, -0)).toBe(false);
      expect(shallowEqual(-0, -0)).toBe(true);
      expect(shallowEqual(0, 0)).toBe(true);
    });
  });

  describe('objects', () => {
    test('should return true for same object reference', () => {
      const obj = { a: 1, b: 2 };
      expect(shallowEqual(obj, obj)).toBe(true);
    });

    test('should return true for objects with same properties and values', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(shallowEqual({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
    });

    test('should return false for objects with different properties', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    test('should return false for objects with different values', () => {
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    test('should only compare first level (shallow)', () => {
      const nested1 = { a: { x: 1 }, b: 2 };
      const nested2 = { a: { x: 1 }, b: 2 };
      expect(shallowEqual(nested1, nested2)).toBe(false);

      const sharedRef = { x: 1 };
      const nested3 = { a: sharedRef, b: 2 };
      const nested4 = { a: sharedRef, b: 2 };
      expect(shallowEqual(nested3, nested4)).toBe(true);
    });

    test('should handle empty objects', () => {
      expect(shallowEqual({}, {})).toBe(true);
      expect(shallowEqual({}, { a: 1 })).toBe(false);
    });

    test('should handle objects with null/undefined values', () => {
      expect(shallowEqual({ a: null }, { a: null })).toBe(true);
      expect(shallowEqual({ a: undefined }, { a: undefined })).toBe(true);
      expect(shallowEqual({ a: null }, { a: undefined })).toBe(false);
    });
  });

  describe('arrays', () => {
    test('should return true for same array reference', () => {
      const arr = [1, 2, 3];
      expect(shallowEqual(arr, arr)).toBe(true);
    });

    test('should return true for arrays with same elements', () => {
      expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(shallowEqual([], [])).toBe(true);
    });

    test('should return false for arrays with different elements', () => {
      expect(shallowEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(shallowEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    test('should only compare first level for nested arrays', () => {
      expect(shallowEqual([1, [2]], [1, [2]])).toBe(false);

      const sharedRef = [2];
      expect(shallowEqual([1, sharedRef], [1, sharedRef])).toBe(true);
    });

    test('should handle sparse arrays', () => {
      const sparse1 = new Array(3);
      sparse1[1] = 'test';
      const sparse2 = new Array(3);
      sparse2[1] = 'test';
      expect(shallowEqual(sparse1, sparse2)).toBe(true);
    });
  });

  describe('mixed types', () => {
    test('should return false when comparing primitive to object', () => {
      expect(shallowEqual(1, { a: 1 })).toBe(false);
      expect(shallowEqual('hello', { 0: 'h', 1: 'e' })).toBe(false);
      expect(shallowEqual(true, [true])).toBe(false);
    });

    test('🚨 should return true when comparing indexable object to array', () => {
      expect(shallowEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(true);
      expect(shallowEqual({}, [])).toBe(true);
    });

    test('should return false when comparing null/undefined to objects', () => {
      expect(shallowEqual(null, {})).toBe(false);
      expect(shallowEqual(undefined, [])).toBe(false);
      expect(shallowEqual({}, null)).toBe(false);
      expect(shallowEqual([], undefined)).toBe(false);
    });
  });

  describe('special objects', () => {
    test('🚨 should handle Date objects as always equal', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');

      expect(shallowEqual(date1, date1)).toBe(true);
      expect(shallowEqual(date1, date2)).toBe(true); // different references, but same value
      expect(shallowEqual(date1, date3)).toBe(true); // different values
    });

    test('🚨 should handle RegExp objects as always equal', () => {
      const regex1 = /abc/g;
      const regex2 = /abc/g;
      const regex3 = /def/g;

      expect(shallowEqual(regex1, regex1)).toBe(true);
      expect(shallowEqual(regex1, regex2)).toBe(true); // different references, but same value
      expect(shallowEqual(regex1, regex3)).toBe(true); // different values
    });

    test('should handle functions', () => {
      const fn1 = () => {};
      const fn2 = () => {};

      expect(shallowEqual(fn1, fn1)).toBe(true);
      expect(shallowEqual(fn1, fn2)).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle objects with symbol keys', () => {
      const sym = Symbol('test');
      const obj1 = { [sym]: 'value', a: 1 };
      const obj2 = { [sym]: 'value', a: 1 };

      // Symbol keys are not enumerable by Object.keys, so only 'a' is compared
      expect(shallowEqual(obj1, obj2)).toBe(true);
    });

    test('should handle objects with inherited properties', () => {
      const parent = { inherited: 'value' };
      const child1 = Object.create(parent);
      child1.own = 'prop1';
      const child2 = Object.create(parent);
      child2.own = 'prop1';

      // Only own properties are compared
      expect(shallowEqual(child1, child2)).toBe(true);
    });

    test('should handle circular references at first level', () => {
      const obj1: any = { a: 1 };
      obj1.self = obj1;

      const obj2: any = { a: 1 };
      obj2.self = obj2;

      // Different circular references
      expect(shallowEqual(obj1, obj2)).toBe(false);

      // Same circular reference
      expect(shallowEqual(obj1, obj1)).toBe(true);
    });
  });
});
