import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [

  //AUTH ROUTES
  route('/api/auth/*', 'routes/api/auth.ts'),
  route('login', 'routes/auth/login.tsx'),
  route('/register', 'routes/auth/register.tsx'),

  //TRPC ROUTES
  route('/api/trpc/*', 'routes/api/trpc.ts'),


  //AUTHENTICATED ROUTES
  layout('layout/home.tsx', [
    index('routes/home.tsx'),
    route('/pasture-journal', 'routes/pasture-journal.tsx'),

  ]),


] satisfies RouteConfig;
