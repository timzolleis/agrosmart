import { z } from 'zod/v4';
import type { TFunction } from 'i18next';

export function createJournalEntrySchema(t: TFunction) {
  return z.object({
    fieldName: z.string().min(1, t('form.validation.fieldName.required')),
    date: z.date(),
    herdId: z.string().min(1, t('form.validation.herd.required')),
  });
}

export function updateJournalEntrySchema(t: TFunction) {
  return z.object({
    id: z.string().min(1, 'ID is required'),
    fieldName: z.string().min(1, t('form.validation.fieldName.required')).optional(),
    date: z.date().optional(),
    herdId: z.string().min(1, t('form.validation.herd.required')).optional(),
  });
}

export const deleteJournalEntrySchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type CreateJournalEntryInput = z.infer<ReturnType<typeof createJournalEntrySchema>>;
export type UpdateJournalEntryInput = z.infer<ReturnType<typeof updateJournalEntrySchema>>;
export type DeleteJournalEntryInput = z.infer<typeof deleteJournalEntrySchema>;