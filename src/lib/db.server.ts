import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';
import { get } from '@vercel/edge-config';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';

const libsql = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql)

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = globalPrisma.prisma ?? new PrismaClient({ adapter, log: ['info', 'error', 'warn'] });
if (dev) globalPrisma.prisma = prisma;

export const getCache = () => (!dev ? get('cache-control') : Promise.resolve('public'));

export { prisma };
