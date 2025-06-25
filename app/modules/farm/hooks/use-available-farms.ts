import { useTRPC } from '~/lib/trpc/trpc-client';
import { useResultQuery } from '~/utils/use-result-query';

export function useAvailableFarms() {
  const trpc = useTRPC();
  const { data: farms } = useResultQuery(trpc.farm.getFarms.queryOptions());
  return farms
}