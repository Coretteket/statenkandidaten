import { PrismaClient } from '@prisma/client';

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = globalPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });
if (import.meta.env.DEV) globalPrisma.prisma = prisma;

export { prisma };
