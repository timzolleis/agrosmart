import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useHerds } from '~/modules/herd/hooks/use-herds';
import {
  type UpdateJournalEntryInput,
  updateJournalEntrySchema,
} from '~/modules/pasture-journal/schema/create-journal-entry-schema';
import { useTranslation } from 'react-i18next';
import { useUpdateJournalEntry } from '~/modules/pasture-journal/hooks/use-update-journal-entry';
import { useTRPC } from '~/lib/trpc/trpc-client';
import { useQueryClient } from '@tanstack/react-query';
import { hydrateServerResult } from '~/utils/server-result';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { Herd, PastureJournalEntry } from 'generated/prisma';

interface PastureJournalEntryWithHerd extends PastureJournalEntry {
  herd: Herd;
}

interface EditJournalEntryDialogProps {
  entry: PastureJournalEntryWithHerd;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditJournalEntryDialog({
  entry,
  open,
  onOpenChange,
}: EditJournalEntryDialogProps) {
  const { data: availableHerds } = useHerds({enabled: open});
  const { t } = useTranslation('pasture-journal');
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    mutate: updateEntry,
    isPending: isUpdatingEntry,
  } = useUpdateJournalEntry();

  const formSchema = updateJournalEntrySchema(t);

  const form = useForm<UpdateJournalEntryInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: entry.id,
      fieldName: entry.fieldName,
      date: new Date(entry.date),
      herdId: entry.herdId,
    },
  });

  // Reset form when entry changes
  useEffect(() => {
    form.reset({
      id: entry.id,
      fieldName: entry.fieldName,
      date: new Date(entry.date),
      herdId: entry.herdId,
    });
  }, [entry, form]);

  const handleSubmit = (values: UpdateJournalEntryInput) => {
    updateEntry(values, {
      onSuccess: (response) => {
        const result = hydrateServerResult(response);
        if (result.isErr()) {
          toast.error(t('errors.updateEntry'), { description: t(`errors:${result.error.translationKey}`) });
        } else {
          toast.success(t('notifications.entryUpdated'));
          queryClient.invalidateQueries({ queryKey: trpc.pastureJournal.getEntries.queryKey() });
          onOpenChange(false);
        }
      },
    });
  };

  const herds = availableHerds?.isOk() ? availableHerds.value : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('editDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('editDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fieldName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fields.fieldName.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.fields.fieldName.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('form.fields.date.label')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString()
                          ) : (
                            <span>{t('form.fields.date.placeholder')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="herdId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.fields.herd.label')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.fields.herd.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {herds.map((herd) => (
                        <SelectItem key={herd.id} value={herd.id}>
                          {herd.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" isLoading={isUpdatingEntry}>
                {t('actions.updateEntry')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}