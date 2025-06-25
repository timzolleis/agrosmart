import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { Route } from './+types/pasture-journal';
import { PageHeader } from '~/components/common/page-header';
import { Button } from '~/components/ui/button';
import { PastureJournalEntryList } from '~/components/pasture-journal/pasture-journal-entry-list';
import { CreateJournalEntryDialog } from '~/components/pasture-journal/create-journal-entry-dialog';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pasture Journal | AgroSmart" },
    { name: "description", content: "Manage your pasture journal entries" },
  ];
}

export default function PastureJournal() {
  const { t } = useTranslation('pasture-journal');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title={t('page.title')} 
          description={t('page.description')} 
        />
        <CreateJournalEntryDialog
        />
      </div>
      <PastureJournalEntryList />
    </div>
  );
}