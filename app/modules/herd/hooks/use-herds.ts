import { useTRPC } from '~/lib/trpc/trpc-client';
import { useResultQuery } from '~/utils/use-result-query';

export function useHerds({ enabled = true }: { enabled?: boolean }) {
  const trpc = useTRPC();
  return useResultQuery(trpc.herd.getHerds.queryOptions(void 0, {
    enabled,
  }));
}