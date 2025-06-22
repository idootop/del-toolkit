import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/**/*.ts'],
  splitting: true,
  outDir: 'dist',
  target: 'es2022',
  platform: 'neutral',
  format: ['esm', 'cjs'],
  sourcemap: false,
  treeshake: true,
  minify: false,
  clean: true,
  shims: true,
  dts: true,
});
