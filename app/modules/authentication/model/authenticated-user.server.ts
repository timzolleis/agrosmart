import type {BetterAuthUser} from "~/lib/auth";

export class AuthenticatedUser {
    data: BetterAuthUser

    constructor(user: BetterAuthUser) {
        this.data = user;
    }

}