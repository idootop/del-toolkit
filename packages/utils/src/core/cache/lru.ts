export class LRUCache<K = string, V = any> {
  private _cache: Map<K, V>;
  private _capacity: number;

  constructor(capacity = 128) {
    this._cache = new Map();
    this._capacity = capacity;
  }

  get(key: K): V | null {
    if (!this._cache.has(key)) {
      return null;
    }
    const value = this._cache.get(key)!;
    // Move the accessed key to the end to show that it was recently used
    this._cache.delete(key);
    this._cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this._cache.has(key)) {
      // If the key already exists, delete it so we can update the order
      this._cache.delete(key);
    }

    this._cache.set(key, value);

    if (this._cache.size > this._capacity) {
      // If the cache is full, remove the least recently used item
      const firstKey = this._cache.keys().next().value;
      if (firstKey) {
        this._cache.delete(firstKey);
      }
    }
  }

  keys() {
    return Array.from(this._cache.keys());
  }

  has(key: K): boolean {
    return this._cache.has(key);
  }

  delete(key: K) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }
}
