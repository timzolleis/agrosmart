import { useState } from 'react';
import { toast } from 'sonner';
import { useTRPC } from '~/lib/trpc/trpc-client';
import { useQueryClient } from '@tanstack/react-query';
import { hydrateServerResult } from '~/utils/server-result';
import { useTranslation } from 'react-i18next';
import { usePastureJournalEntries } from '~/modules/pasture-journal/hooks/use-pasture-journal-entries';
import { useDeleteJournalEntry } from '~/modules/pasture-journal/hooks/use-delete-journal-entry';
import { TableSkeleton } from '~/components/ui/table-skeleton';
import { EditJournalEntryDialog } from './edit-journal-entry-dialog';
import { PastureJournalTable } from './pasture-journal-table';
import { EmptyState } from './empty-state';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import type { PastureJournalEntryWithHerd } from './types';


export function PastureJournalEntryList() {
  const { t } = useTranslation('pasture-journal');
  const { data: entriesResult, isLoading } = usePastureJournalEntries();
  const [editingEntry, setEditingEntry] = useState<PastureJournalEntryWithHerd | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteJournalEntry();

  const entries = entriesResult?.isOk() ? entriesResult.value : [];

  const handleEdit = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
    }
  };

  const handleDelete = () => {
    if (deletingEntryId) {
      deleteEntry({ id: deletingEntryId }, {
        onSuccess: (response) => {
          const result = hydrateServerResult(response);
          if (result.isErr()) {
            toast.error(t('errors.deleteEntry'), { 
              description: t(`errors:${result.error.translationKey}`) 
            });
          } else {
            toast.success(t('notifications.entryDeleted'));
            queryClient.invalidateQueries({ 
              queryKey: trpc.pastureJournal.getEntries.queryKey() 
            });
          }
          setDeletingEntryId(null);
        },
        onError: () => {
          setDeletingEntryId(null);
        }
      });
    }
  };

  if (isLoading) {
    return <TableSkeleton cols={4} rows={5} />;
  }

  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <PastureJournalTable 
        entries={entries}
        onEdit={handleEdit}
        onDelete={setDeletingEntryId}
      />

      {editingEntry && (
        <EditJournalEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open) => !open && setEditingEntry(null)}
        />
      )}

      <DeleteConfirmationDialog
        open={!!deletingEntryId}
        onOpenChange={(open) => !open && setDeletingEntryId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}