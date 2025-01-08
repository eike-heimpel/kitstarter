import { userAuth } from '$lib/config'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals: { supabase } }) => {
    if (!supabase || !userAuth) {
        console.log('Supabase or user auth is not set, supabase disabled at the moment')
        throw redirect(303, '/')
    }
}