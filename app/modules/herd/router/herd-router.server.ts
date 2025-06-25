import { createProcedure, createRouter } from '~/lib/trpc/trpc-instance.server';
import { findHerdsByFarm } from '~/modules/herd/repository/herd-repository.server';
import { serverResult } from '~/utils/server-result';


export const herdRouter = createRouter({
  getHerds: createProcedure.query(async ({ ctx }) => {
    const farmId = await ctx.context.getSelectedFarmId();
    const herdsResult = await findHerdsByFarm({ farmId });
    return serverResult(herdsResult);
  }),
});