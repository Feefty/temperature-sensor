import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './src/application/api/api-contract/openapi.yaml',
  output: {
    path: './src/application/api/api-contract/generated',
  },
  plugins: [
    { name: '@hey-api/typescript', enums: 'javascript' },
    'zod',
    'nestjs',
  ],
});
