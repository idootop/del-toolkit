import type { IStorage } from './typing.js';

export type ProxyStorageKeys<T extends Record<string, any>> = {
  [K in keyof T]: K;
};

export type ProxyStorageTypes<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | undefined;
};

export type ProxyStorage<T extends Record<string, any>> =
  ProxyStorageTypes<T> & {
    clear: () => void;
  };

/**
 * Creates a proxy storage object with direct property access.
 *
 * @example
 * ```ts
 * const myStorage = createProxyStorage<{
 *   session: CreateSessionResponse;
 *   user: User;
 * }>({
 *   keys: new Set(['session', 'user']),
 *   storage: localStorage,
 * });
 *
 * // Direct access
 * const session = myStorage.session;
 *
 * // Direct assignment
 * myStorage.session = {
 *   hello: 'world',
 * };
 *
 * // Delete by setting undefined
 * myStorage.session = undefined;
 *
 * // Clear all
 * myStorage.clear();
 * ```
 */
export const createProxyStorage = <T extends Record<string, any>>({
  keys: keysMap,
  storage,
}: {
  keys: ProxyStorageKeys<T>;
  storage: IStorage;
}) => {
  const keys = Object.keys(keysMap);

  const proxy = {
    clear: () => {
      keys.forEach((key) => {
        storage.removeItem(key);
      });
    },
  } as ProxyStorage<T>;

  keys.forEach((key) => {
    Object.defineProperty(proxy, key, {
      get: () => storage.getItem(key),
      set: (value) => {
        if (value === undefined) {
          storage.removeItem(key);
          return;
        }
        storage.setItem(key, value);
      },
      enumerable: true,
      configurable: false,
    });
  });

  return proxy;
};
