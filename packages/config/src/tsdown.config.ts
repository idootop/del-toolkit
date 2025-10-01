export const config: any = {
  entry: [
    './src/**/*.ts',
    './src/**/*.tsx',
    '!./src/**/*.test.ts',
    '!./src/**/*.test.tsx',
  ],
  unbundle: true,
  outDir: 'dist',
  target: 'es2022',
  platform: 'neutral',
  format: ['esm', 'cjs'],
  treeshake: true,
  dts: true,
};
