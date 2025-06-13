import { createMiddleware } from 'hono/factory';
import { pathToRegexp } from 'path-to-regexp';
import type { Env, Input, MiddlewareHandler } from 'hono';

interface CreateScopedMiddlewareOptions {
  ignoreOnRoutes: string[];
}


export function createScopedMiddleware <E extends Env = any, P extends string = string, I extends Input = {}>(middlewareImpl: MiddlewareHandler<E, P, I>) {
  return (options: CreateScopedMiddlewareOptions) => createMiddleware(async (context, next) => {
    const shouldIgnore = pathMatch(options.ignoreOnRoutes, context.req.path);
    if (shouldIgnore) {
      return next();
    }
    return middlewareImpl(context, next);
  })

}

export function pathMatch(paths: string[], requestPath: string) {
  for (const path of paths) {
    const withoutDataSuffix = requestPath.replace('.data', '');
    const regex = pathToRegexp(path);
    if (regex.regexp.test(withoutDataSuffix)) {
      return true;
    }
  }
  return false;
}