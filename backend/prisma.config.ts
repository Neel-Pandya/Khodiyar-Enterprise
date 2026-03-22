import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const user = process.env.DB_USER;
const password = encodeURIComponent(process.env.DB_PASSWORD || '');
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

const DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
