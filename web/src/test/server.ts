import { setupServer } from 'msw/node';

// Shared request-mocking server. Tests add per-case handlers with server.use(...).
export const server = setupServer();
