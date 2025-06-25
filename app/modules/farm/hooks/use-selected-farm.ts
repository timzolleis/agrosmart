import { useTRPC } from '~/lib/trpc/trpc-client';
import { useQuery } from '@tanstack/react-query';
import { useRevalidatingMutation } from '~/utils/use-revalidating-mutation';

export function useSelectedFarm() {
  const trpc = useTRPC();
  const { data: selectedFarm } = useQuery(trpc.farm.getSelectedFarm.queryOptions());
  const { mutate: setSelectedFarm } = useRevalidatingMutation(trpc.farm.setSelectedFarm.mutationOptions());

  return { selectedFarm, setSelectedFarm };

}