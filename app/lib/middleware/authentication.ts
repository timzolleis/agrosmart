import { href, redirect } from 'react-router';

import { auth } from '~/lib/auth';
import { createScopedMiddleware, pathMatch } from '~/lib/middleware/create-scoped-middleware';
import { AuthenticatedUser } from '~/modules/authentication/model/authenticated-user.server';

import { createMiddleware } from 'hono/factory';
import { pathToRegexp } from 'path-to-regexp';

const LOGIN_ROUTES = ['/login', '/register', '/api/auth/*splat'];

export const PUBLIC_ROUTES = [...LOGIN_ROUTES];


export const authenticationMiddleware = createScopedMiddleware(async (context, next) => {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  if (!session) {
    return redirect(href('/login'));
  }
  context.set('user', new AuthenticatedUser(session.user));
  return next();
});
