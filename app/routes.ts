import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  //AUTH ROUTES
  route('/api/auth/*', 'routes/api/auth.ts'),
  route('login', 'routes/auth/login.tsx'),

  //VERIFICATION ROUTES
  route('/request-verification', 'routes/auth/request-verification.tsx'),

  //TRPC ROUTES
  route('/api/trpc/*', 'routes/api/trpc.ts'),
] satisfies RouteConfig;
