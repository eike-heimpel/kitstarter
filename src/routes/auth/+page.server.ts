import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

interface AuthActionData {
    error?: string;
    message?: string;
}

export const actions: Actions = {
    magicLink: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        if (!email) {
            return fail(400, {
                error: 'Please provide your email'
            });
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${process.env.PUBLIC_SITE_URL}/auth/confirm`
            }
        });

        if (error) {
            return fail(400, {
                error: error.message
            });
        }

        return {
            message: 'Check your email for the magic link'
        };
    },

    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, {
                error: 'Please provide both email and password'
            });
        }

        if (password.length < 6) {
            return fail(400, {
                error: 'Password must be at least 6 characters long'
            });
        }

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return fail(400, {
                error: error.message
            });
        }

        throw redirect(303, '/');
    },

    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, {
                error: 'Please provide both email and password'
            });
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return fail(400, {
                error: error.message
            });
        }

        throw redirect(303, '/private');
    }
};
