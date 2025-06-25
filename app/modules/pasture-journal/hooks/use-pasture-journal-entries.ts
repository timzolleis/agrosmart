import { useTRPC } from '~/lib/trpc/trpc-client';
import { useResultQuery } from '~/utils/use-result-query';

export function usePastureJournalEntries() {
  const trpc = useTRPC();
  return useResultQuery(trpc.pastureJournal.getEntries.queryOptions());
}