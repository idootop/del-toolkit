export interface IStorage {
  clear: () => void;
  hasItem: (key: string) => boolean;
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
  removeItem: (key: string) => void;
}

export interface StringStorage<O = any> extends Omit<IStorage, 'hasItem'> {
  setItem: (key: string, value: string, options?: O) => void;
}
