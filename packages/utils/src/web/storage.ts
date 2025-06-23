import { jsonDecode, jsonEncode } from '../core/object.js';

class _LocalStorage {
  has(key: string): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem(key) != null;
  }

  getItem<T = any>(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const str = localStorage.getItem(key);
    const data = jsonDecode(str) ?? str;
    return data;
  }

  setItem = (key: string, data: any) => {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const saveData = jsonEncode(data)!;
    localStorage.setItem(key, saveData);
  };

  removeItem(key: string) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  }

  clear() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.clear();
  }
}

export const LocalStorage = new _LocalStorage();
