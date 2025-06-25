import { wrapPrismaError } from '~/lib/error/prisma-error';
import { fromPromise } from 'neverthrow';
import { prisma } from '~/lib/db.server';
import type { CreateJournalEntryInput } from '~/modules/pasture-journal/schema/create-journal-entry-schema';

export function findPastureJournalEntriesByFarm({ farmId }: { farmId: string }) {
  return fromPromise(
    prisma.pastureJournalEntry.findMany({
      where: { 
        farmId 
      },
      include: {
        herd: true,
      },
      orderBy: {
        date: 'desc',
      },
    }),
    wrapPrismaError(),
  );
}

export function createPastureJournalEntry(data: CreateJournalEntryInput & { farmId: string }) {
  return fromPromise(
    prisma.pastureJournalEntry.create({
      data,
    }),
    wrapPrismaError(),
  );
}

export function updatePastureJournalEntry({ 
  id, 
  farmId, 
  data 
}: { 
  id: string; 
  farmId: string; 
  data: Partial<CreateJournalEntryInput> 
}) {
  return fromPromise(
    prisma.pastureJournalEntry.updateMany({
      where: { 
        id,
        farmId 
      },
      data,
    }),
    wrapPrismaError(),
  );
}

export function deletePastureJournalEntry({ 
  id, 
  farmId 
}: { 
  id: string; 
  farmId: string 
}) {
  return fromPromise(
    prisma.pastureJournalEntry.deleteMany({
      where: { 
        id,
        farmId 
      },
    }),
    wrapPrismaError(),
  );
}