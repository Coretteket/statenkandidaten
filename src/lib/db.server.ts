import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';
import { get } from '@vercel/edge-config';

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = globalPrisma.prisma ?? new PrismaClient({ log: ['info', 'error', 'warn'] });
if (dev) globalPrisma.prisma = prisma;

export const getCache = () => (!dev ? get('cache-control') : Promise.resolve('public'));

export { prisma };
