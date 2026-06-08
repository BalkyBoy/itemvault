import { defineConfig } from 'tsup';
import { cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  external: [
    'sharp',
    'pg',
    'pg-native',
    'knex',
    'objection',
    'pino',
    'pino-pretty',
  ],
  noExternal: [],
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
      '@config': './src/config',
      '@models': './src/models',
      '@repositories': './src/repositories',
      '@modules': './src/modules',
      '@shared': './src/shared',
      '@jobs': './src/jobs',
    };
  },
  async onSuccess() {
    const src = resolve('src/database/migrations');
    const dest = resolve('dist/database/migrations');
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
    console.log('Migrations copied to dist/database/migrations');
  },
});