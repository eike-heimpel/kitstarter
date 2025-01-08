import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {

    // this app does not have a login or any form of private user area yet
    throw redirect(301, '/');

    const { session } = await safeGetSession();

    if (!session) {
        throw redirect(303, '/');
    }

    return {
        session
    };
};
