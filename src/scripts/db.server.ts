import { PrismaClient } from '@prisma/client';
import zodformdata from 'zod-form-data';
import z from 'zod';

const globalPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = globalPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });
if (import.meta.env.DEV) globalPrisma.prisma = prisma;

const { zfd } = zodformdata;

export { prisma, z, zfd };
