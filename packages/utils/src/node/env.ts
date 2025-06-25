export const kEnvs = process.env as Record<string, string>;

export const kIsNodeDev = process.env.NODE_ENV === 'development';

export const kIsNodeProd = process.env.NODE_ENV === 'production';

export const kIsNode =
  typeof process !== 'undefined' && !!process.versions?.node;
