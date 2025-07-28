import { isEmpty } from './is.js';

export function withDefault<T>(e: any, defaultValue: T): T {
  return isEmpty(e) ? defaultValue : e;
}

export const withRetry = async <T = any>(
  fn: () => T,
  options?: {
    retry?: number;
    isOK?: (res: T) => boolean;
    defaultValue?: T;
  },
) => {
  const {
    retry = 3,
    isOK = (e: any) => e != null,
    defaultValue = null,
  } = options ?? {};
  for (let i = 0; i < retry; i++) {
    try {
      const res = await fn();
      if (isOK(res)) {
        return res;
      }
    } catch {
      //
    }
  }
  return defaultValue;
};
