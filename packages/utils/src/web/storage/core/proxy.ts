import type { IStorage } from './typing.js';

type IProxyStorage<T extends Record<string, any>> = T & {
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
  keys,
  storage,
}: {
  keys: Set<string>;
  storage: IStorage;
}): IProxyStorage<T> => {
  const proxy = {
    clear: () => {
      keys.forEach((key) => {
        storage.removeItem(key);
      });
    },
  } as IProxyStorage<T>;

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
