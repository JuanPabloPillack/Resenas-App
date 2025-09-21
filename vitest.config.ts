//vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Mapea @ a la carpeta src/
    },
  },
  test: {
    environment: 'jsdom', // Para simular un navegador
    setupFiles: './vitest.setup.ts', // Archivo de configuración
    globals: true, // Habilita globals como describe, it, expect
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});