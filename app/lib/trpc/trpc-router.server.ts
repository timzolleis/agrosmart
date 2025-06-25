import { createRouter } from '~/lib/trpc/trpc-instance.server';
import { farmRouter } from '~/modules/farm/router/farm-router.server';
import { herdRouter } from '~/modules/herd/router/herd-router.server';
import { pastureJournalRouter } from '~/modules/pasture-journal/router/pasture-journal-router.server';

export const appRouter = createRouter({
  farm: farmRouter,
  herd: herdRouter,
  pastureJournal: pastureJournalRouter,
});

export type AppRouter = typeof appRouter;
