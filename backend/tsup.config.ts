import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  external: [
    // External dependencies that should not be bundled
    // Native/binary modules
    'sharp',
    'pg',
    'pg-native',
    // Database
    'knex',
    'objection',
    'pino',
    'pino-pretty',
  ],
  noExternal: [

  ],
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
});
