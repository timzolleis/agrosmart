import { createProcedure, createRouter } from '~/lib/trpc/trpc-instance.server';
import { createFarm, getFarmsForUser } from '~/modules/farm/repository/farm-repository.server';
import { serverResult } from '~/utils/server-result';
import { createFarmSchema } from '~/modules/farm/schema/create-farm-schema';
import { z } from 'zod/v4';

export const farmRouter = createRouter({
  getSelectedFarm: createProcedure.query(async ({ ctx }) => {
    return ctx.context.getSession().get('selectedFarmId');
  }),
  setSelectedFarm: createProcedure.input(z.object({ farmId: z.string() })).mutation(async ({ input, ctx }) => {
    ctx.context.getSession().set('selectedFarmId', input.farmId);
  }),
  getFarms: createProcedure.query(async ({ ctx }) => {
    const userFarmsResult = await getFarmsForUser({ userId: ctx.context.requireUser().id });
    return serverResult(userFarmsResult);
  }),
  createFarm: createProcedure.input(createFarmSchema).mutation(async ({ input, ctx }) => {
    const userId = ctx.context.requireUser().id;
    const { name } = input;
    const createFarmResult = await createFarm({ userId, name });
    return serverResult(createFarmResult);
  }),
});