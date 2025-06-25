export const kEnvs = process.env as Record<string, string>;

export const kIsDev = process.env.NODE_ENV === 'development';

export const kIsProd = process.env.NODE_ENV === 'production';
