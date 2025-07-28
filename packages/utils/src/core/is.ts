export const kSymbolNone = Symbol('none');

export const identity = <T>(e: T) => e;

export function isNull<T>(input: T | null): input is null {
  return input === null;
}

export function isUndefined<T>(input: T | undefined): input is undefined {
  return input === undefined;
}

export function isNullish<T>(
  input: T | undefined | null,
): input is null | undefined {
  return input == null;
}

export function isEmpty(e: any): boolean {
  if ((e?.size ?? 0) > 0) return false;
  return (
    Number.isNaN(e) ||
    isNullish(e) ||
    (isString(e) && (e.length < 1 || !/\S/.test(e))) ||
    (isArray(e) && e.length < 1) ||
    (isObject(e) && Object.keys(e).length < 1)
  );
}

export function isNotEmpty(e: unknown): boolean {
  return !isEmpty(e);
}

export function isNumber<T>(input: T | number): input is number {
  return typeof input === 'number' && !Number.isNaN(input);
}

export function isString<T>(input: T | string): input is string {
  return typeof input === 'string';
}

export function isArray<T>(input: T | any[]): input is any[] {
  return Array.isArray(input);
}

export function isObject(e: unknown): boolean {
  return typeof e === 'object' && !isNullish(e);
}

export function isPromise(value: any): boolean {
  try {
    return typeof value.then === 'function';
  } catch {
    return false;
  }
}

export function isFunction(e: unknown): boolean {
  return typeof e === 'function';
}

export function isAsyncFunction(func: any): boolean {
  try {
    return func.constructor.name === 'AsyncFunction';
  } catch {
    return false;
  }
}
