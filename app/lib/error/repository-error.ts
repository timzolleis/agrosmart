import {BaseError} from "~/lib/error/base-error";


abstract class RepositoryError extends BaseError {
    readonly modelName: string

    constructor({modelName, cause}: { modelName: string, cause?: unknown }) {
        super({cause});
        this.modelName = modelName
    }
}


export class RecordNotFoundError extends RepositoryError {
    readonly code = "database:recordNotFound";
    readonly details = "Record for the given criteria was not found in the database.";
}

export class ListRecordsError extends RepositoryError {
    readonly code = "database:listRecords";
    readonly details = "Failed to list records from the database.";
}

export class CreateRecordError extends RepositoryError {
    readonly code = "database:createRecord";
    readonly details = "Failed to create a record in the database.";
}

export class UpdateRecordError extends RepositoryError {
    readonly code = "database:updateRecord";
    readonly details = "Failed to update a record in the database.";
}

export class DeleteRecordError extends RepositoryError {
    readonly code = "database:deleteRecord";
    readonly details = "Failed to delete a record in the database.";
}