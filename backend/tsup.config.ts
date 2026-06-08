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
  const dirs = [
    ['src/database/migrations', 'dist/database/migrations'],
    ['src/database/seeds',      'dist/database/seeds'],
  ];

  for (const [src, dest] of dirs) {
    mkdirSync(resolve(dest), { recursive: true });
    cpSync(resolve(src), resolve(dest), { recursive: true });
  }

  console.log('✓ Migrations and seeds copied to dist/');
},
});