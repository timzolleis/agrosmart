import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import type { TFunction } from 'i18next';
import { AgrosmartIcon } from '~/components/icons/agrosmart-icon';

import type { Route } from './+types/register';
import { authClient } from '~/lib/auth-client';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';

export const handle = {
  i18n: 'register',
};

export const meta = () => {
  return [{
    title: "Register | AgroSmart",
  }]
}

const createRegisterSchema = (t: TFunction) => {
  return z.object({
    fullName: z.string().min(1, t('form.errors.name.required')),
    email: z
      .string()
      .email()
      .min(1, t('form.errors.email.required')),
    password: z
      .string()
      .min(1, t('form.errors.password.required'))
      .min(6, t('form.errors.password.minLength')),
  });
};

const RegisterPage = ({ loaderData }: Route.ComponentProps) => {
  const { t } = useTranslation('register');

  const registerSchema = createRegisterSchema(t);
  type RegisterFormData = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.fullName,
    }, {
      onSuccess: () => {
        console.log("Registration successful");
        navigate('/')
      },
      onError: (error) => {
        toast.error(error.error.message);
      },
    });


  };

  return (
    <section className="h-full flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <AgrosmartIcon className="size-16 mx-auto mb-4" />
        <h2 className="text-xl">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="max-w-sm w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.labels.name')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('form.placeholders.name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.labels.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('form.placeholders.email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.labels.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('form.placeholders.password')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={form.formState.isSubmitting}
            >
              {t('form.submit')}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t('links.haveAccount')}{' '}
            <Link 
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              {t('links.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;