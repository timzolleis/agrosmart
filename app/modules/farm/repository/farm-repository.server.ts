import { fromPromise } from 'neverthrow';
import { prisma } from '~/lib/db.server';
import { wrapPrismaError } from '~/lib/error/prisma-error';


export function listFarms() {
  return fromPromise(prisma.farm.findMany(), wrapPrismaError());
}

export function getFarmsForUser({ userId }: { userId: string }) {
  return fromPromise(prisma.farm.findMany({ where: { members: { some: { id: userId } } } }), wrapPrismaError());
}

export function createFarm({ userId, name }: { userId: string; name: string }) {
  return fromPromise(
    prisma.farm.create({
      data: {
        name,
        createdById: userId,
        members: {
          connect: { id: userId },
        },
      },
    }),
    wrapPrismaError(),
  );
}