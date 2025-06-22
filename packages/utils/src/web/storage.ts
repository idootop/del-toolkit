import { jsonDecode, jsonEncode, LRUCache } from '../core/index.js';

class _LocalStorage {
  private _cache = new LRUCache<string, any>();

  get<T = any>(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
    const str = localStorage.getItem(key);
    const data = jsonDecode(str) ?? str;
    this._cache.set(key, data);
    return data;
  }

  set = (key: string, data: any) => {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const saveData = jsonEncode(data)!;
    localStorage.setItem(key, saveData);
    this._cache.set(key, data);
  };

  has(key: string): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return this._cache.has(key) || localStorage.getItem(key) != null;
  }

  delete(key: string) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
    this._cache.delete(key);
  }

  clear() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.clear();
    this._cache.clear();
  }
}

export const LocalStorage = new _LocalStorage();
