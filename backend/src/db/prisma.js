import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import pg from 'pg';

const user = process.env.DB_USER;
const password = encodeURIComponent(process.env.DB_PASSWORD || '');
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

const DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}`;

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
