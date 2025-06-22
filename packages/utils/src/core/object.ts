import { isEmpty } from './is.js';
import type { Prettify } from './typing.js';

export function readonly<T>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

export function withDefault<T>(e: any, defaultValue: T): T {
  return isEmpty(e) ? defaultValue : e;
}

export function jsonEncode<T>(
  obj: T,
  options?: { prettier?: boolean; removeNullish?: boolean },
) {
  const { prettier, removeNullish: _removeNullish } = options ?? {};
  try {
    return JSON.stringify(
      _removeNullish ? removeNullish(obj) : obj,
      null,
      prettier ? 4 : 0,
    );
  } catch {
    return null;
  }
}

export function jsonDecode<T = any>(json: string | null | undefined) {
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function removeNullish<T>(data: T): T {
  if (!data) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.filter((e) => e != null) as any;
  }
  const res = {} as any;
  for (const key in data) {
    if (data[key] != null) {
      res[key] = data[key];
    }
  }
  return res;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Prettify<Pick<T, K>> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Prettify<Omit<T, K>> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

export function deepMerge<T extends object, S extends object>(
  target: T,
  source: S,
): T & S {
  const result = deepClone(target) as T & S;
  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      if (
        sourceValue !== null &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        typeof targetValue === 'object' &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue as any);
      } else {
        result[key] = deepClone(sourceValue as any);
      }
    }
  }
  return result;
}
