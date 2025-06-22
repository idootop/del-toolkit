import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { throttle } from '../src/index.js';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should execute function immediately on first call', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should ignore subsequent calls within wait period', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should allow execution after wait period', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(99);
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1); // Still within wait period

    vi.advanceTimersByTime(1);
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(2); // Now allowed
  });

  test('should pass arguments correctly', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn('first', 123);
    expect(callback).toHaveBeenCalledWith('first', 123);

    throttledFn('second', 456); // Should be ignored
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn('third', 789);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('third', 789);
  });

  test('should work with zero delay', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 0);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(2);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should work with default delay (0)', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 0);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should handle multiple arguments', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    const complexObj = { key: 'value' };
    throttledFn(1, 'test', complexObj, [1, 2, 3]);

    expect(callback).toHaveBeenCalledWith(1, 'test', complexObj, [1, 2, 3]);
  });

  test('should maintain execution intervals', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    // First call - executes immediately
    throttledFn(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(1);

    // Advance time and call again
    vi.advanceTimersByTime(100);
    throttledFn(2);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(2);

    // Another interval
    vi.advanceTimersByTime(100);
    throttledFn(3);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenLastCalledWith(3);
  });

  test('should handle rapid calls correctly', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    // Make many calls rapidly
    for (let i = 0; i < 10; i++) {
      throttledFn(i);
    }

    // Only first call should execute
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(0);

    // After wait period, next call should work
    vi.advanceTimersByTime(100);
    throttledFn(10);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(10);
  });

  test('should return value from callback', () => {
    const callback = vi.fn().mockReturnValue('result');
    const throttledFn = throttle(callback, 100);

    const result1 = throttledFn();
    expect(result1).toBe('result');

    const result2 = throttledFn(); // Should be ignored
    expect(result2).toBeUndefined();

    vi.advanceTimersByTime(100);
    const result3 = throttledFn();
    expect(result3).toBe('result');
  });

  test('should handle async functions', () => {
    const asyncCallback = vi.fn().mockResolvedValue('async result');
    const throttledFn = throttle(asyncCallback, 100);

    throttledFn();
    expect(asyncCallback).toHaveBeenCalledTimes(1);

    throttledFn();
    throttledFn();
    expect(asyncCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle functions that throw errors', () => {
    const callback = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const throttledFn = throttle(callback, 100);

    expect(() => throttledFn()).toThrow('Test error');
    expect(callback).toHaveBeenCalledTimes(1);

    // Should still ignore subsequent calls within wait period
    expect(() => throttledFn()).not.toThrow();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should work correctly with timing edge cases', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);

    // Exactly at the boundary
    vi.advanceTimersByTime(99);
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1); // Now exactly 100ms
    throttledFn();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should handle complex object arguments', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    const complexObj = {
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark', notifications: true },
      data: [1, 2, 3, { nested: 'value' }],
    };

    throttledFn(complexObj);
    expect(callback).toHaveBeenCalledWith(complexObj);
    expect(callback).toHaveBeenCalledTimes(1);

    throttledFn({ different: 'object' });
    expect(callback).toHaveBeenCalledTimes(1); // Ignored due to throttle
  });

  test('should handle sequential execution cycles', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 50);

    // First cycle
    throttledFn('cycle1');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('cycle1');

    // Wait and second cycle
    vi.advanceTimersByTime(50);
    throttledFn('cycle2');
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('cycle2');

    // Wait and third cycle
    vi.advanceTimersByTime(50);
    throttledFn('cycle3');
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenLastCalledWith('cycle3');
  });

  test('should ignore calls during wait period regardless of arguments', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 100);

    throttledFn('first');
    throttledFn('second');
    throttledFn('third');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');
    // 'second' and 'third' are completely ignored
  });
});
