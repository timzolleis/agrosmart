import {prisma} from "~/lib/db.server";
import {type FetchCreateContextFnOptions} from "@trpc/server/adapters/fetch";
import type {AppLoadContext} from "react-router";
import {initTRPC} from "@trpc/server";
import * as SuperJSON from "superjson";
import {ZodError} from "zod";

interface TRPCContextType {
    request: Request
    context: AppLoadContext
    responseHeaders: Headers
}

export const trpcInstance = initTRPC.context<TRPCContextType>().create({
    transformer: SuperJSON,
    errorFormatter: ({shape, error}) => ({
        ...shape,
        data: {
            ...shape.data,
            zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
    })
});

export const createProcedure = trpcInstance.procedure;
export const createRouter = trpcInstance.router;