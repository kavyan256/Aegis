import { defineConfig } from '@prisma/internals';

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.POSTGRES_URL,
  },
});
