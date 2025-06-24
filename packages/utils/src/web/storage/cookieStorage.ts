import { ClientStorage } from './core/client.js';
import type { StringStorage } from './core/typing.js';

export interface CookieOptions {
  /** Expiration date as Date object or number of days */
  expires?: Date | number;
  /** Maximum age in seconds */
  maxAge?: number;
  path?: string;
  domain?: string;
  /** Whether to transmit only over HTTPS */
  secure?: boolean;
  /** SameSite policy */
  sameSite?: 'strict' | 'lax' | 'none';
}

class _CookieStorage implements StringStorage<CookieOptions> {
  private defaultOptions: CookieOptions = {
    path: '/',
    sameSite: 'lax',
  };

  decodeCookieValue(value: string): string {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  encodeCookieValue(value: string): string {
    return encodeURIComponent(value);
  }

  parseCookies(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (!cookieString) {
      return cookies;
    }

    cookieString.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      if (name && rest.length > 0) {
        const value = rest.join('=');
        cookies[name] = this.decodeCookieValue(value);
      }
    });

    return cookies;
  }

  getCookies(): Record<string, string> {
    if (typeof document === 'undefined') {
      return {};
    }

    return this.parseCookies(document.cookie);
  }

  setCookie(name: string, value: string, options?: CookieOptions): void {
    if (typeof document === 'undefined') {
      return;
    }

    const opts = { ...this.defaultOptions, ...options };
    let cookieString = `${name}=${this.encodeCookieValue(value)}`;

    if (opts.expires) {
      if (typeof opts.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${opts.expires.toUTCString()}`;
      }
    }

    if (opts.maxAge !== undefined) {
      cookieString += `; max-age=${opts.maxAge}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.secure) {
      cookieString += `; secure`;
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    // biome-ignore lint/suspicious/noDocumentCookie: Document cookie API required for synchronous operation
    document.cookie = cookieString;
  }

  getItem(key: string): string | null {
    const cookies = this.getCookies();
    return cookies[key] ?? null;
  }

  setItem(key: string, data: string, options?: CookieOptions) {
    this.setCookie(key, data, options);
  }

  removeItem(key: string) {
    this.setCookie(key, '', {
      expires: new Date(0),
      path: this.defaultOptions.path,
    });
  }

  clear() {
    const cookies = this.getCookies();
    Object.keys(cookies).forEach((key) => {
      this.removeItem(key);
    });
  }
}

export const CookieUtils = new _CookieStorage();

/**
 * Cookie storage implementation with automatic JSON serialization,
 * URL encoding/decoding, and SSR compatibility.
 *
 * @example
 * ```ts
 * const user = CookieStorage.getItem('user');
 *
 * CookieStorage.setItem('user', { name: 'John', age: 30 });
 *
 * CookieStorage.setItem('token', 'abc123', {
 *   expires: 7,
 *   secure: true,
 *   sameSite: 'strict'
 * });
 * ```
 */
export const CookieStorage = new ClientStorage(CookieUtils);
