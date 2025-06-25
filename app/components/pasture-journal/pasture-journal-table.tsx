import { useTranslation, Trans } from 'react-i18next';
import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { useTableColumns } from './table-columns';
import type { PastureJournalEntryWithHerd } from './types';

interface PastureJournalTableProps {
  entries: PastureJournalEntryWithHerd[];
  onEdit: (entryId: string) => void;
  onDelete: (entryId: string) => void;
}

export function PastureJournalTable({ entries, onEdit, onDelete }: PastureJournalTableProps) {
  const { t } = useTranslation('pasture-journal');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  
  const columns = useTableColumns({ onEdit, onDelete });

  const table = useReactTable({
    data: entries,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Trans i18nKey="list.table.pagination.noResults" ns="pasture-journal" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          <Trans
            i18nKey="list.table.pagination.showing"
            ns="pasture-journal"
            values={{
              start: (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1,
              end: Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              ),
              total: table.getFilteredRowModel().rows.length
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Trans i18nKey="list.table.pagination.previous" ns="pasture-journal" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Trans i18nKey="list.table.pagination.next" ns="pasture-journal" />
          </Button>
        </div>
      </div>
    </div>
  );
}