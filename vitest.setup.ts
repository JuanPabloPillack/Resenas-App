// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'; // Importar explícitamente
import { server } from './src/mocks/server'; // Ajustar ruta
import { setupMongoDB, teardownMongoDB } from './src/mocks/db'; // Ajustar ruta
import '@testing-library/jest-dom';

beforeAll(async () => {
  server.listen();
  await setupMongoDB();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(async () => {
  server.close();
  await teardownMongoDB();
});