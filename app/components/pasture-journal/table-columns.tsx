import { useTranslation, Trans } from 'react-i18next';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import type { PastureJournalEntryWithHerd } from './types';

interface UseColumnsProps {
  onEdit: (entryId: string) => void;
  onDelete: (entryId: string) => void;
}

export function useTableColumns({ onEdit, onDelete }: UseColumnsProps): ColumnDef<PastureJournalEntryWithHerd>[] {
  const { t } = useTranslation('pasture-journal');

  return [
    {
      accessorKey: 'fieldName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium hover:bg-transparent"
          >
            <Trans i18nKey="list.table.headers.fieldName" ns="pasture-journal" />
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('fieldName')}</div>
      ),
    },
    {
      accessorKey: 'herd.name',
      id: 'herd',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium hover:bg-transparent"
          >
            <Trans i18nKey="list.table.headers.herd" ns="pasture-journal" />
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => row.original.herd.name,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-medium hover:bg-transparent"
          >
            <Trans i18nKey="list.table.headers.date" ns="pasture-journal" />
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue('date')), 'MMM dd, yyyy');
      },
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const entry = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(entry.id)}>
                <Edit className="mr-2 h-4 w-4" />
                <Trans i18nKey="list.table.actions.edit" ns="pasture-journal" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(entry.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <Trans i18nKey="list.table.actions.delete" ns="pasture-journal" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}