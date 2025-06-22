interface CacheData {
  data: any;
  /**
   * 过期时间(毫秒时间戳)
   */
  expireAt?: number | null;
}

export interface ExpireOptions {
  /**
   * 多久后过期(毫秒)
   */
  expireAfter?: number;
  /**
   * 过期时间(毫秒时间戳)
   */
  expireAt?: number;
}

export class BaseCache {
  private _cache = new Map<string, CacheData>();

  get<T = any>(key: string): T | null {
    this.clearExpired();
    return this._cache.get(key)?.data as T | null;
  }

  set<T>(key: string, data: T, options: ExpireOptions = {}) {
    this.clearExpired();
    const expireAt = options.expireAt
      ? options.expireAt
      : options.expireAfter
        ? Date.now() + options.expireAfter
        : null;
    this._cache.set(key, { data, expireAt });
  }

  has(key: string): boolean {
    return this._cache.has(key);
  }

  delete(key: string) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    this._cache.forEach((value, key) => {
      if (value.expireAt && now > value.expireAt) {
        this._cache.delete(key);
      }
    });
  }
}
