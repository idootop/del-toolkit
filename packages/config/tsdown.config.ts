import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/**/*.ts'],
  unbundle: true,
  outDir: 'dist',
  target: 'es2022',
  platform: 'neutral',
  format: ['esm', 'cjs'],
  treeshake: true,
  dts: true,
});
