import { hydrateServerResult, type ServerResult } from '~/utils/server-result';
import { type QueryKey, useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import type { Result } from 'neverthrow';

type UseResultQueryOptions<T, E, TError = Error, TQueryKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<ServerResult<T, E>, TError, Result<T, E>, TQueryKey>,
  'select'
>;

type UseResultQueryResult<T, E, TError = Error> = Omit<
  UseQueryResult<Result<T, E>, TError>,
  'data'
> & {
  data: Result<T, E> | undefined;
};

export function useResultQuery<T, E, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  options: UseResultQueryOptions<T, E, TError, TQueryKey>
): UseResultQueryResult<T, E, TError> {
  const queryResult = useQuery({
    ...options,
    select: (data: ServerResult<T, E>) => hydrateServerResult(data),
  });

  return queryResult as UseResultQueryResult<T, E, TError>;
}