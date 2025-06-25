import { wrapPrismaError } from '~/lib/error/prisma-error';
import { fromPromise } from 'neverthrow';
import { prisma } from '~/lib/db.server';

export function findHerdsByFarm({ farmId }: { farmId: string }) {
  return fromPromise(
    prisma.herd.findMany({
      where: { farmId },
    }),
    wrapPrismaError(),
  );
}