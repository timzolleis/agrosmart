import {fetchRequestHandler} from "@trpc/server/adapters/fetch";
import { appRouter } from "~/lib/trpc/trpc-router.server";

import type {Route} from "./+types/trpc"

function getResHeadersWithCache(headers: Headers) {
    headers.append("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.append("Pragma", "no-cache");
    headers.append("Expires", "0");
    return headers;
}

function requestHandler(args: Route.LoaderArgs | Route.ActionArgs) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: args.request,
        router: appRouter,
        createContext: ({ resHeaders }) => ({
            context: args.context,
            request: args.request,
            responseHeaders: getResHeadersWithCache(resHeaders),
        }),
    });
}

export const loader = async (args: Route.LoaderArgs) => {
    return requestHandler(args);
};

export const action = async (args: Route.ActionArgs) => {
    return requestHandler(args);
};