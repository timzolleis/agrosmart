import { PrismaClient } from '../../generated/prisma';

function getPrismaClient() {
  const prisma = new PrismaClient();
  prisma.$connect().then(() => console.log('Connected to Prisma database'));
  return prisma;
}

export const prisma = getPrismaClient();
