import type {Route} from './+types/auth';
import {auth} from "~/lib/auth";

export const loader = async ({request}: Route.LoaderArgs) => {
    return auth.handler(request)
}

export const action = async ({request}: Route.ActionArgs) => {
    return auth.handler(request)
}

