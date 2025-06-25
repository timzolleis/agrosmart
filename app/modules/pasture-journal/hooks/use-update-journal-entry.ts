import { useTRPC } from '~/lib/trpc/trpc-client';
import { useRevalidatingMutation } from '~/utils/use-revalidating-mutation';

export function useUpdateJournalEntry() {
  const trpc = useTRPC();
  return useRevalidatingMutation(trpc.pastureJournal.updateEntry.mutationOptions());
}