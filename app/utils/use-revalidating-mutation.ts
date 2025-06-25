import { useRevalidator } from 'react-router';

import {
  type MutateFunction,
  type UseMutateFunction,
  type UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';

export function useRevalidatingMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(args: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const revalidator = useRevalidator();
  const isRevalidating = revalidator.state === 'loading';
  const {
    mutate: originalMutate,
    mutateAsync: originalMutateAsync,
    isPending: originalIsPending,
    ...rest
  } = useMutation(args);

  const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (variables, options) => {
    return originalMutate(variables, {
      ...options,
      onSuccess: (...params) => {
        options?.onSuccess?.(...params);
        revalidator.revalidate();
      },
    });
  };

  const mutateAsync: MutateFunction<TData, TError, TVariables, TContext> = async (
    variables,
    options,
  ) => {
    return await originalMutateAsync(variables, {
      ...options,
      onSuccess: (...params) => {
        options?.onSuccess?.(...params);
        revalidator.revalidate();
      },
    });
  };

  const isPending = originalIsPending || isRevalidating;
  return { mutate, mutateAsync, isPending, ...rest };
}
