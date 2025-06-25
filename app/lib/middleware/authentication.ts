import { href } from 'react-router';

import { auth } from '~/lib/auth';
import { createScopedMiddleware, pathMatch } from '~/lib/middleware/create-scoped-middleware';
import { AuthenticatedUser } from '~/modules/authentication/model/authenticated-user.server';

import { createMiddleware } from 'hono/factory';
import { pathToRegexp } from 'path-to-regexp';
import { redirect } from 'react-router-hono-server/http';

const LOGIN_ROUTES = ['/login', '/register', '/api/auth/*splat'];

export const PUBLIC_ROUTES = [...LOGIN_ROUTES, "/__manifest"];


export const authenticationMiddleware = createScopedMiddleware(async (context, next) => {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  if (!session) {
    return redirect(context, href('/login'));
  }
  context.set('user', new AuthenticatedUser(session.user));
  return next();
});
