import { createRouter } from '~/lib/trpc/trpc-instance.server';

export const appRouter = createRouter({});

export type AppRouter = typeof appRouter;
