import { ClientStorage } from './core/client.js';

export const LocalStorage = new ClientStorage(
  typeof localStorage === 'undefined' ? undefined : localStorage,
);
