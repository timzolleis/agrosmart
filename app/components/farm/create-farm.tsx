import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import type { TFunction } from 'i18next';
import { useTRPC } from '~/lib/trpc/trpc-client';
import { useRevalidatingMutation } from '~/utils/use-revalidating-mutation';
import { useQueryClient } from '@tanstack/react-query';
import { hydrateServerResult } from '~/utils/server-result';
import { toast } from 'sonner';
import { href, useNavigate } from 'react-router';

interface CreateFarmProps {
  open: boolean;
}

const createFarmSchema = (t: TFunction) => {
  return z.object({
    name: z.string().min(1, t('create.form.errors.name.required')),
  });
};

export function CreateFarm({ open }: CreateFarmProps) {
  const { t } = useTranslation('farm');

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    mutate: createFarm,
    isPending: isCreatingFarm,
  } = useRevalidatingMutation(trpc.farm.createFarm.mutationOptions());

  const farmSchema = createFarmSchema(t);
  type CreateFarmData = z.infer<typeof farmSchema>;

  const form = useForm<CreateFarmData>({
    resolver: zodResolver(farmSchema),
  });
  const navigate = useNavigate();

  const onSubmit = (data: CreateFarmData) => {
    createFarm({ name: data.name }, {
      onSuccess: (response) => {
        const result = hydrateServerResult(response);
        if (result.isErr()) {
          toast.error(t('errors:createFarm'), { description: t(result.error.translationKey) });
        } else {
          toast.success(t('notifications.farmCreated'));
          form.reset();
          queryClient.invalidateQueries({ queryKey: trpc.farm.getFarms.queryKey() });
        }
      },
    });


  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
          <DialogDescription>
            {t('create.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('create.form.labels.name')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('create.form.placeholders.name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={isCreatingFarm}
              type="submit"
              className="w-full"
              disabled={isCreatingFarm}
            >
              {t('create.form.submit')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}