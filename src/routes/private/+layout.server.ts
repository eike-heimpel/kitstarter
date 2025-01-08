import { fail, redirect } from '@sveltejs/kit';
import { userAuth } from '$lib/config';

/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/

export const load = async ({ locals: { supabase } }) => {
    if (!supabase || !userAuth) {
        console.log('Supabase or user auth is not set, supabase disabled at the moment')
        throw redirect(303, '/')
    }
}