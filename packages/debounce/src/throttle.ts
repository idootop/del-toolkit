/**
 * Throttle function
 *
 * Limits function execution to at most once per specified time interval.
 * Multiple calls within the interval will be ignored except for the first one.
 *
 * ```typescript
 * function fn(i: number): void {
 *   console.log(i);
 * }
 *
 * const throttleFn = throttle(fn, 100);
 *
 * for (let i = 1; i <= 10; ++i) {
 *   throttleFn(i);
 *   await delay(50);
 * }
 *
 * //  1   3   5   7   9
 * ```
 */
export function throttle<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait: number,
) {
  let lastCallTime = 0;
  return (...args: T) => {
    const now = Date.now();
    if (now - lastCallTime >= wait) {
      lastCallTime = now;
      return callback(...args);
    }
  };
}
