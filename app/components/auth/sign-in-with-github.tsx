import { Button } from '~/components/ui/button';

import { authClient } from '~/lib/auth-client';

import { GithubIcon } from '../icons/github-icon';

export const SignInWithGithub = () => {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: 'github',
    });
  };

  return (
    <>
      <Button className={"w-full"} onClick={handleSignIn}>
        <GithubIcon className={"size-5"}  />
        Sign in with GitHub
      </Button>
    </>
  );
};
