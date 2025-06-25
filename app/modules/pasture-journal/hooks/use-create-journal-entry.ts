import { useTRPC } from '~/lib/trpc/trpc-client';
import { useRevalidatingMutation } from '~/utils/use-revalidating-mutation';

export function useCreateJournalEntry() {
  const trpc = useTRPC();
  return useRevalidatingMutation(trpc.pastureJournal.createEntry.mutationOptions());
}