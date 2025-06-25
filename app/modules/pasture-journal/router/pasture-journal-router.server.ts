import { createProcedure, createRouter } from '~/lib/trpc/trpc-instance.server';
import { 
  findPastureJournalEntriesByFarm, 
  createPastureJournalEntry,
  updatePastureJournalEntry,
  deletePastureJournalEntry
} from '~/modules/pasture-journal/repository/pasture-journal-repository.server';
import { 
  createJournalEntrySchema,
  updateJournalEntrySchema,
  deleteJournalEntrySchema
} from '~/modules/pasture-journal/schema/create-journal-entry-schema';
import { serverResult } from '~/utils/server-result';
import { mockServerTranslation } from '~/utils/server-translation';

export const pastureJournalRouter = createRouter({
  getEntries: createProcedure.query(async ({ ctx }) => {
    const farmId = await ctx.context.getSelectedFarmId();
    const entriesResult = await findPastureJournalEntriesByFarm({ farmId });
    return serverResult(entriesResult);
  }),

  createEntry: createProcedure
    .input(createJournalEntrySchema(mockServerTranslation))
    .mutation(async ({ input, ctx }) => {
      const farmId = await ctx.context.getSelectedFarmId();
      const entryResult = await createPastureJournalEntry({ ...input, farmId });
      return serverResult(entryResult);
    }),

  updateEntry: createProcedure
    .input(updateJournalEntrySchema(mockServerTranslation))
    .mutation(async ({ input, ctx }) => {
      const farmId = await ctx.context.getSelectedFarmId();
      const { id, ...data } = input;
      const entryResult = await updatePastureJournalEntry({ id, farmId, data });
      return serverResult(entryResult);
    }),

  deleteEntry: createProcedure
    .input(deleteJournalEntrySchema)
    .mutation(async ({ input, ctx }) => {
      const farmId = await ctx.context.getSelectedFarmId();
      const entryResult = await deletePastureJournalEntry({ id: input.id, farmId });
      return serverResult(entryResult);
    }),
});