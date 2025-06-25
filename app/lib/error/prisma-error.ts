import { BaseError } from '~/lib/error/base-error';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function wrapPrismaError() {
  return (cause: unknown) => {
    if (cause instanceof PrismaClientKnownRequestError) {
      if (cause.code.startsWith('P10')) {
        return InternalPrismaError.fromPrismaError(cause);
      }
      switch (cause.code) {
        case 'P2001':
        case '2015':
        case '2025':
          return new RecordNotFoundError({
            prismaErrorCode: cause.code,
            prismaErrorMessage: cause.message,
          });
        case 'P2002':
          return new UniqueConstraintViolationError({
            prismaErrorCode: cause.code,
            prismaErrorMessage: cause.message,
          });
        case 'P2003':
          return new ForeignKeyConstraintViolationError({
            prismaErrorCode: cause.code,
            prismaErrorMessage: cause.message,
          });
        case 'P2004':
        case 'P2011':
        case 'P2012':
        case 'P2013':
          return new NullConstraintViolationError({
            prismaErrorCode: cause.code,
            prismaErrorMessage: cause.message,
          });
      }
    }
    return new UnknownPrismaError({
      prismaErrorCode: 'unknown',
      prismaErrorMessage: 'An unknown Prisma error occurred.',
      cause,
    });
  };
}

type PrismaBaseErrorParams<T = {}> = {
  prismaErrorCode: string;
  prismaErrorMessage: string;
} & T;

export abstract class PrismaBaseError extends BaseError {
  readonly prismaErrorCode: string;
  readonly prismaErrorMessage: string;

  protected constructor({ prismaErrorCode, prismaErrorMessage }: PrismaBaseErrorParams) {
    super();
    this.prismaErrorCode = prismaErrorCode;
    this.prismaErrorMessage = prismaErrorMessage;
  }
}

export class UnknownPrismaError extends PrismaBaseError {
  readonly code = 'UnknownPrismaError';
  readonly translationKey = 'errors:prisma.unknownError';
  readonly cause: unknown;

  constructor({
    prismaErrorCode,
    prismaErrorMessage,
    cause,
  }: PrismaBaseErrorParams<{ cause: unknown }>) {
    super({ prismaErrorCode, prismaErrorMessage });
    this.cause = cause;
  }
}

type InternalPrismaErrorCause =
  | 'AuthenticationFailure'
  | 'DatabaseUnreachable'
  | 'QueryTimeout'
  | 'UnknownError';

export class InternalPrismaError extends PrismaBaseError {
  readonly code = 'InternalPrismaError';
  readonly internalCause: InternalPrismaErrorCause;
  readonly translationKey = 'errors:prisma.internalError';

  constructor({
    prismaErrorCode,
    prismaErrorMessage,
    internalCause,
  }: PrismaBaseErrorParams<{
    internalCause: InternalPrismaErrorCause;
  }>) {
    super({ prismaErrorCode, prismaErrorMessage });
    this.internalCause = internalCause;
  }

  static fromPrismaError(cause: PrismaClientKnownRequestError): InternalPrismaError {
    let internalCause: InternalPrismaErrorCause = 'UnknownError';
    switch (cause.code) {
      case 'P1000':
      case 'P1010':
        internalCause = 'AuthenticationFailure';
        break;
      case 'P1001':
      case 'P1011':
        internalCause = 'DatabaseUnreachable';
        break;
      case 'P1002':
      case 'P1008':
        internalCause = 'QueryTimeout';
        break;
    }
    return new InternalPrismaError({
      prismaErrorCode: cause.code,
      prismaErrorMessage: cause.message,
      internalCause,
    });
  }
}

export class UniqueConstraintViolationError extends PrismaBaseError {
  readonly code = 'UniqueConstraintViolationError';
  readonly details = 'A unique constraint was violated in the database.';
  readonly translationKey = 'errors:prisma.uniqueConstraintViolation';

  constructor({ prismaErrorCode, prismaErrorMessage }: PrismaBaseErrorParams) {
    super({ prismaErrorCode, prismaErrorMessage });
  }
}

export class ForeignKeyConstraintViolationError extends PrismaBaseError {
  readonly code = 'ForeignKeyConstraintViolationError';
  readonly details = 'A foreign key constraint was violated in the database.';
  readonly translationKey = 'errors:prisma.foreignKeyConstraintViolation';

  constructor({ prismaErrorCode, prismaErrorMessage }: PrismaBaseErrorParams) {
    super({ prismaErrorCode, prismaErrorMessage });
  }
}

export class NullConstraintViolationError extends PrismaBaseError {
  readonly code = 'NullConstraintViolationError';
  readonly details = 'A null constraint was violated in the database.';
  readonly translationKey = 'errors:prisma.nullConstraintViolation';

  constructor({ prismaErrorCode, prismaErrorMessage }: PrismaBaseErrorParams) {
    super({ prismaErrorCode, prismaErrorMessage });
  }
}

export class RecordNotFoundError extends PrismaBaseError {
  readonly code = 'RecordNotFoundError';
  readonly details = 'Record for the given criteria was not found in the database.';
  readonly translationKey = 'errors:prisma.recordNotFound';

  constructor({ prismaErrorCode, prismaErrorMessage }: PrismaBaseErrorParams) {
    super({ prismaErrorCode, prismaErrorMessage });
  }
}
