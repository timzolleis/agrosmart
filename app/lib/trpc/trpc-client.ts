import {createTRPCContext} from '@trpc/tanstack-react-query';
import type {AppRouter} from "~/lib/trpc/trpc-router.server";

export const {useTRPC, TRPCProvider, useTRPCClient} = createTRPCContext<AppRouter>();