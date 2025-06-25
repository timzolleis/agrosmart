import type { BaseError } from '~/lib/error/base-error';

type ErrorWithCode = {
  code: string;
};

type ExtractErrorByCode<T extends ErrorWithCode, Code extends string> = T extends { code: Code }
  ? T
  : never;

export function matchTag<TError extends ErrorWithCode, TResult>(
  error: TError,
  patterns: {
    [K in TError['code']]?: (error: ExtractErrorByCode<TError, K>) => TResult;
  },
  fallback?: (error: TError) => TResult,
): TResult | undefined {
  const handler = patterns[error.code as TError['code']];
  if (handler) {
    console.log('Handling error with code:', error.code);
    return handler(error as any);
  }
  if (fallback) {
    return fallback(error);
  }
  return undefined;
}
