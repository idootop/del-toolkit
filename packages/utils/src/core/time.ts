export type TimeUnit = 'millisecond' | 'second';

export async function sleep(duration: number, unit: TimeUnit = 'millisecond') {
  return new Promise((resolve) =>
    setTimeout(resolve, unit === 'millisecond' ? duration : duration * 1000),
  );
}

export function timestamp(unit: TimeUnit = 'millisecond') {
  const now = Date.now();
  return unit === 'millisecond' ? now : Math.floor(now / 1000);
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
 * 函数防抖
 *
 * 延迟响应函数调用，在指定时间之内重复调用，则继续延迟
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
 * 函数节流
 *
 * 在指定时间内多次调用函数只响应第一次，即两次调用之间至少间隔 wait 毫秒
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
