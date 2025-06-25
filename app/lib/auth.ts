import { prisma } from '~/lib/db.server';
import { env } from '~/lib/env';

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;

}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'User',
    additionalFields: {
      isAdmin: {
        type: 'boolean',
        input: false,
      },
    },
  },
  session: {
    modelName: 'Session',
  },
  verification: {
    modelName: 'Verification',
  },
  account: {
    modelName: 'Account',
  },
});
