import { type Result, ok, err } from 'neverthrow';

const RESULT_TAGS = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type ServerError<T> = {
  _tag: typeof RESULT_TAGS.ERROR;
  error: T;
};

type ServerSuccess<T> = {
  _tag: typeof RESULT_TAGS.SUCCESS;
  data: T;
};

export type ServerResult<T, E> = ServerError<E> | ServerSuccess<T>;

export function serverResult<T, E>(data: Result<T, E>): ServerResult<T, E> {
  if (data.isErr()) {
    return {
      _tag: RESULT_TAGS.ERROR,
      error: data.error,
    } as ServerError<E>;
  }
  return {
    _tag: RESULT_TAGS.SUCCESS,
    data: data.value,
  } as ServerSuccess<T>;
}

export function serverError<E>(error: E): ServerError<E> {
  return {
    _tag: RESULT_TAGS.ERROR,
    error,
  };
}

export function serverSuccess<T>(data: T): ServerSuccess<T> {
  return {
    _tag: RESULT_TAGS.SUCCESS,
    data,
  };
}


export function hydrateServerResult<T, E>(serverResult: ServerResult<T, E>): Result<T, E> {
  if (serverResult._tag === RESULT_TAGS.SUCCESS) {
    return ok(serverResult.data);
  }
  return err(serverResult.error);
}
