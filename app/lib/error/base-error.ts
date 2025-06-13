
export abstract class BaseError {
    abstract readonly code: string;
    abstract readonly details: string;
    readonly cause?: unknown

    constructor({cause}: { cause?: unknown }) {
        this.cause = cause;
    }

}