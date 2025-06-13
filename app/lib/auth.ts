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

  hasVerificationRequested: boolean;
  isVerified: boolean;
  isAdmin: boolean;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  user: {
    modelName: 'User',
    additionalFields: {
      hasVerificationRequested: {
        type: 'boolean',
        input: false,
      },
      isVerified: {
        type: 'boolean',
        input: false,
      },
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
