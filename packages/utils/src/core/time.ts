export type TimeUnit = 'millisecond' | 'second';

export async function sleep(duration: number, unit: TimeUnit = 'millisecond') {
  return new Promise((resolve) =>
    setTimeout(resolve, unit === 'millisecond' ? duration : duration * 1000),
  );
}

export function now(unit: TimeUnit = 'millisecond') {
  const now = Date.now();
  return unit === 'millisecond' ? now : Math.floor(now / 1000);
}

export function timestamp(
  date: Date = new Date(),
  unit: TimeUnit = 'millisecond',
) {
  const time = date.getTime();
  return unit === 'millisecond' ? time : Math.floor(time / 1000);
}

export function duration(
  values: {
    millisecond?: number;
    second?: number;
    minute?: number;
    hour?: number;
    day?: number;
  },
  unit: TimeUnit = 'millisecond',
) {
  const durationMap: Record<string, number> = {
    millisecond: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
  };
  const time = Object.entries(values).reduce(
    (acc, [key, value]) => acc + durationMap[key]! * value,
    0,
  );
  return unit === 'millisecond' ? time : Math.floor(time / 1000);
}

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
  wait = 0,
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
  wait = 0,
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
