import type {BaseError} from "~/lib/error/base-error";

export function wrapError<TError extends BaseError, TParams extends object = {}>(
    ErrorConstructor: new (args: { cause?: unknown } & TParams) => TError,
    additionalParams?: TParams
) {
    return (cause: unknown) => new ErrorConstructor({
        cause,
        ...(additionalParams || {})
    } as { cause?: unknown } & TParams);
}
type ErrorConstructor<TError extends BaseError> = new (args: {cause?: unknown}) => TError;