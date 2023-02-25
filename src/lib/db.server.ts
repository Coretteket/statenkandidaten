import { PrismaClient as PrismaClientNode } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';

const PrismaClient = import.meta.env.DEV ? PrismaClientNode : PrismaClientEdge;

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClientNode };
const prisma = globalPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });
if (import.meta.env.DEV) globalPrisma.prisma = prisma;

export { prisma };
