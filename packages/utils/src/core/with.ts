import { isEmpty } from './is.js';
import { sleep } from './time.js';

export function withDefault<T>(e: any, defaultValue: T): T {
  return isEmpty(e) ? defaultValue : e;
}

export const withRetry = async <T = any>(
  fn: () => T,
  options?: {
    defaultValue?: T;
    isOK?: (res: T) => boolean;
    maxRetry?: number;
    retryAfter?: (count: number) => number;
  },
) => {
  const {
    maxRetry = 3,
    retryAfter = () => 0,
    defaultValue = null,
    isOK = (e: any) => e != null,
  } = options ?? {};
  for (let i = 0; i < maxRetry; i++) {
    try {
      const res = await fn();
      if (isOK(res)) {
        return res;
      }
    } catch {
      //
    }
    const duration = retryAfter(i + 1);
    if (duration) {
      await sleep(duration);
    }
  }
  return defaultValue;
};
