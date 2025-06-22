import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { debounce } from '../src/index.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should delay function execution', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should reset timer on subsequent calls', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    vi.advanceTimersByTime(50);

    debouncedFn(); // Reset timer
    vi.advanceTimersByTime(50);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call function with latest arguments', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('third');
  });

  test('should work with multiple arguments', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn(1, 'test', { key: 'value' });

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith(1, 'test', { key: 'value' });
  });

  test('should work with zero delay', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 0);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should work with default delay (0)', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 0);

    debouncedFn();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should handle rapid successive calls', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    // Call 10 times rapidly
    for (let i = 0; i < 10; i++) {
      debouncedFn(i);
    }

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(9); // Last call
  });

  test('should allow multiple executions after delay', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn('first');
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith('first');

    debouncedFn('second');
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });

  test('should work with complex objects as arguments', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    const complexObj = {
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark', lang: 'en' },
      data: [1, 2, 3],
    };

    debouncedFn(complexObj);
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith(complexObj);
  });

  test('should handle function that returns value', () => {
    const callback = vi.fn().mockReturnValue('result');
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveReturnedWith('result');
  });

  test('should handle function that throws error', () => {
    const error = new Error('Test error');
    const callback = vi.fn().mockImplementation(() => {
      throw error;
    });
    const debouncedFn = debounce(callback, 100);

    debouncedFn();

    expect(() => {
      vi.advanceTimersByTime(100);
    }).toThrow('Test error');
  });

  test('should clear previous timeout when called again', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 100);

    debouncedFn();
    const firstTimeoutId = vi.getTimerCount();

    debouncedFn();
    const secondTimeoutId = vi.getTimerCount();

    // Should still have only one timer
    expect(secondTimeoutId).toBe(firstTimeoutId);

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should work with async functions', async () => {
    const asyncCallback = vi.fn().mockResolvedValue('async result');
    const debouncedFn = debounce(asyncCallback, 100);

    debouncedFn();
    vi.advanceTimersByTime(100);

    expect(asyncCallback).toHaveBeenCalledTimes(1);
  });
});
