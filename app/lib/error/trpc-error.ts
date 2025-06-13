import { TRPCError } from '@trpc/server';

export function internalServerError({ message, cause }: { message: string; cause?: unknown }) {
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message,
    cause,
  });
}
