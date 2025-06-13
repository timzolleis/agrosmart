import { createScopedMiddleware } from '~/lib/middleware/create-scoped-middleware';
import type { BetterAuthUser } from '~/lib/auth';
import type { Env } from 'hono';
import { href, redirect } from 'react-router';

// Define the environment with your custom variables
type CustomEnv = Env & {
  Variables: {
    user: BetterAuthUser | undefined;
  };
};

export const VERIFICATION_ROUTES = ['/request-verification'];


export const requireAccountVerificationMiddleware = createScopedMiddleware<CustomEnv>(async (context, next) => {
  const user = context.get("user");

  if (!user) {
    return redirect(href("/login"))
  }

  if (!user.isVerified && !user.hasVerificationRequested) {
    return redirect(href("/request-verification"));
  }

  return next();
});
