import { dev } from '$app/environment';
import { PrismaClient as PrismaClientNode } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { get } from '@vercel/edge-config';

const PrismaClient = import.meta.env.DEV ? PrismaClientNode : PrismaClientEdge;

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClientNode };
const prisma = globalPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });
if (dev) globalPrisma.prisma = prisma;

export const getCache = () => (!dev ? get('cache-control') : Promise.resolve('public'));

export { prisma };
