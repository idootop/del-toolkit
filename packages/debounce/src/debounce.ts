/**
 * Debounce function
 *
 * Delays function execution until after specified time has elapsed since the last call.
 * If the function is called again within the wait period, the timer resets.
 *
 * ```typescript
 * function fn(i: number): void {
 *   console.log(i);
 * }
 *
 * const debounceFn = debounce(fn, 100);
 *
 * for (let i = 1; i <= 10; ++i) {
 *   debounceFn(i);
 *   await delay(50);
 * }
 *
 * //                   10
 * ```
 */
export function debounce<T extends unknown[]>(
  callback: (...args: T) => unknown,
  wait: number,
) {
  let timeoutId: number | undefined;
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait) as unknown as number;
  };
}
