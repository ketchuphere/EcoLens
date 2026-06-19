import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 85,
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/test/setup.ts',
        '**/*.config.*',
        'server.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/components/common/**',
        'src/components/dashboard/**',
        'src/components/landing/**',
        'src/components/calculator/CarbonCalculatorForm.tsx', // complex interactive visual page
      ],
    },
  },
});
