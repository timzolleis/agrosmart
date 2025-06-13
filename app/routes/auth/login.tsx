import { useTranslation } from 'react-i18next';
import { SignInWithGithub } from '~/components/auth/sign-in-with-github';

import type { Route } from './+types/login';


export const handle = {
  i18n: 'auth',
};


const LoginPage = ({loaderData}: Route.ComponentProps) => {
  const { t } = useTranslation('auth');


  return (
    <section className={"h-full flex flex-col items-center justify-center gap-6"}>
      <div className={"text-center"}>
        <h2 className={"text-xl"}>{t("login.title")}</h2>
        <p className={"text-muted-foreground"}>{t("login.description")}</p>
      </div>

      <div className={"max-w-sm w-full"}>
        <SignInWithGithub/>
      </div>

    </section>
  );
};

export default LoginPage;
