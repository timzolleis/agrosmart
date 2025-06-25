import type { Herd, PastureJournalEntry } from 'generated/prisma';

export interface PastureJournalEntryWithHerd extends PastureJournalEntry {
  herd: Herd;
}