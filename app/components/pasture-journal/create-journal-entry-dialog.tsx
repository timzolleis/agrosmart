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
  DialogTrigger,
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
  type CreateJournalEntryInput,
  createJournalEntrySchema,
} from '~/modules/pasture-journal/schema/create-journal-entry-schema';
import { useTranslation } from 'react-i18next';
import { useCreateJournalEntry } from '~/modules/pasture-journal/hooks/use-create-journal-entry';
import { useTRPC } from '~/lib/trpc/trpc-client';
import { useQueryClient } from '@tanstack/react-query';
import { hydrateServerResult } from '~/utils/server-result';
import { toast } from 'sonner';
import { useState } from 'react';


export function CreateJournalEntryDialog() {
  const [open, setOpen] = useState(false);

  const { data: availableHerds } = useHerds({enabled: open});
  const { t } = useTranslation('pasture-journal');
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    mutate: createEntry,
    isPending: isCreatingEntry,
  } = useCreateJournalEntry();

  const formSchema = createJournalEntrySchema(t);

  const form = useForm<CreateJournalEntryInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const handleSubmit = (values: CreateJournalEntryInput) => {
    createEntry(values, {
      onSuccess: (response) => {
        const result = hydrateServerResult(response);
        if (result.isErr()) {
          toast.error(t('errors.createEntry'), { description: t(`errors:${result.error.translationKey}`) });
        } else {
          toast.success(t('notifications.entryCreated'));
          form.reset();
          queryClient.invalidateQueries({ queryKey: trpc.pastureJournal.getEntries.queryKey() });
          setOpen(false);
        }
      },
    });
  };

  const herds = availableHerds?.isOk() ? availableHerds.value : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>{t('createEntry')}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('dialog.description')}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="submit" isLoading={isCreatingEntry}>
                {t('actions.createEntry')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}