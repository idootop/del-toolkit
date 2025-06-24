import { jsonDecode, jsonEncode } from '../../../core/object.js';
import type { StringStorage } from './typing.js';

export class ClientStorage<O = any> implements StringStorage<O> {
  private storage?: StringStorage<O>;

  constructor(storage?: StringStorage<O>) {
    this.storage = storage;
  }

  hasItem(key: string): boolean {
    return this.getItem(key) != null;
  }

  getItem<T = any>(key: string): T | null {
    if (!this.storage || typeof document === 'undefined') {
      return null;
    }
    const value = this.storage!.getItem(key);
    const decoded = jsonDecode(value);
    return decoded ?? (value as T);
  }

  setItem(key: string, data: any, options?: O) {
    if (!this.storage || typeof document === 'undefined') {
      return;
    }
    const encodedData = typeof data === 'string' ? data : jsonEncode(data);
    if (!encodedData) {
      throw new Error(`Failed to encode data for storage key: ${key}`);
    }
    this.storage.setItem(key, encodedData!, options);
  }

  removeItem(key: string) {
    if (!this.storage || typeof document === 'undefined') {
      return;
    }
    this.storage.removeItem(key);
  }

  clear() {
    if (!this.storage || typeof document === 'undefined') {
      return;
    }
    this.storage.clear();
  }
}
