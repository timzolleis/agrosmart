export abstract class BaseError {
  abstract readonly code: string;
  readonly details?: string;
  readonly translationKey?: string;

  //Function to sanitize the error for logging or user display. Can be overridden by subclasses.
  public sanitize() {
    return { code: this.code, details: this.details, translationKey: this.translationKey } as const;
  }
}

export function serializeBaseError<TError extends BaseError>(
  error: TError,
): Record<string | number, unknown> {
  const record: Record<string | number, unknown> = {};
  for (const key of Object.keys(error)) {
    const value = error[key as keyof TError];
    if (value) {
      record[key] = value;
    }
  }
  return record;
}
