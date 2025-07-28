import { BaseCache, type ExpireOptions } from './base.js';

export const CacheWithExpire = new BaseCache();

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
