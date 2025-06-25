import { createGetLoadContext, createHonoServer } from 'react-router-hono-server/node';
import { redirect } from 'react-router-hono-server/http';

import type { AuthenticatedUser } from '~/modules/authentication/model/authenticated-user.server';
import { authenticationMiddleware, PUBLIC_ROUTES } from '~/lib/middleware/authentication';
import { timing } from 'hono/timing';
import { getSession, session } from 'remix-hono/session';
import { createCookieSessionStorage, type Session } from 'react-router';
import { env } from '~/lib/env';
import type { Context, Env } from 'hono';
import { getFarmsForUser } from '~/modules/farm/repository/farm-repository.server';


declare module 'hono' {
  interface ContextVariableMap {
    user: AuthenticatedUser | undefined;
    selectedFarmId?: string;
  }
}


declare module 'react-router' {
  interface AppLoadContext {
    user: AuthenticatedUser | undefined;
    requireUser: () => AuthenticatedUser;
    getSession: () => Session<{ selectedFarmId: string }>;
    honoContext: Context<Env>;
    getSelectedFarmId: () => Promise<string>;
  }
}

const getLoadContext = createGetLoadContext((c) => {
  return {
    user: c.get('user'),
    requireUser: () => {
      const user = c.get('user');
      if (!user) {
        throw redirect(c, '/login');
      }
      return user;
    },
    //@ts-ignore
    getSession: () => getSession(c),
    getSelectedFarmId: async () => {
      const user = c.get('user');
      if (!user) {
        throw new Error('User is not authenticated');
      }
      const selectedFarmId = c.get('selectedFarmId');
      if (selectedFarmId) {
        return selectedFarmId;
      }
      const farmsResult = await getFarmsForUser({ userId: user.id });
      if (farmsResult.isErr() || farmsResult.value.length === 0) {
        throw new Error('Failed to fetch farms');
      }
      return farmsResult.value[0].id; // Return the first farm's ID if no selected farm is set
    },

    honoContext: c,
  };
});

export default await createHonoServer({
  getLoadContext,
  configure: (server) => {
    server.use(timing());
    server.use('*', session({
      autoCommit: true, createSessionStorage: () => createCookieSessionStorage({
        cookie: {
          name: 'session',
          path: '/',
          sameSite: 'lax',
          secrets: [env.APPLICATION_SECRET],
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        },
      }),
    }));
    server.use('*', authenticationMiddleware({ ignoreOnRoutes: PUBLIC_ROUTES }));
  },
});
