import type { AppLoadContext } from 'react-router';
import { initTRPC } from '@trpc/server';
import * as SuperJSON from 'superjson';
import { ZodError } from 'zod';
import type { Context, Env } from 'hono';

interface TRPCContextType {
  request: Request
  context: AppLoadContext
  responseHeaders: Headers,
  honoContext: Context<Env>
}

export const trpcInstance = initTRPC.context<TRPCContextType>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createProcedure = trpcInstance.procedure;
export const createRouter = trpcInstance.router;