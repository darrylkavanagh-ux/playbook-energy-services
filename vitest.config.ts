// vitest.config.ts — VeriTech Platform Test Configuration
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
    include: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
    exclude: ['node_modules', 'dist'],
  },
});
