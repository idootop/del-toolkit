import { BaseCache, type ExpireOptions } from './base.js';

export const Cache = new BaseCache();

export const CacheWithExpire = new BaseCache();

export function withCacheSync<T>(
  key: string,
  getData: () => T,
  options: ExpireOptions = {},
): T {
  const data = CacheWithExpire.get(key);
  if (data) return data;
  const result = getData();
  CacheWithExpire.set(key, result, options);
  return result;
}

export async function withCache<T>(
  key: string,
  getData: () => T | Promise<T>,
  options: ExpireOptions = {},
): Promise<T> {
  const data = CacheWithExpire.get(key);
  if (data) return data;
  const result = await getData();
  CacheWithExpire.set(key, result, options);
  return result;
}
