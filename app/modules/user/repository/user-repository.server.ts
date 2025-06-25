import type { User } from '../../../../generated/prisma';
import { fromPromise } from 'neverthrow';
import { prisma } from '~/lib/db.server';
import { wrapPrismaError } from '~/lib/error/prisma-error';

export function updateUser({userId, data}: {userId: string, data: Partial<User>}) {
  return fromPromise(prisma.user.update({where: {id: userId}, data}), wrapPrismaError())
}