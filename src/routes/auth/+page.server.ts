import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { userService } from '$lib/server/mongodb/services/UserService';

export const actions: Actions = {
    magicLink: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        if (!email) {
            return fail(400, {
                error: 'Please provide your email'
            });
        }

        // Check if user exists in MongoDB
        const existingUser = await userService.findByEmail(email);

        if (!existingUser) {
            // Create user in MongoDB if they don't exist yet
            try {
                await userService.create({
                    email,
                    supabaseId: '', // Will be set after first login
                });
            } catch (err) {
                console.error('Failed to create MongoDB user:', err);
                return fail(500, {
                    error: 'Failed to create user account'
                });
            }
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

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return fail(400, {
                error: error.message
            });
        }

        // Create user in MongoDB
        try {
            await userService.create({
                email,
                supabaseId: data.user?.id || '',
            });
        } catch (err) {
            console.error('Failed to create MongoDB user:', err);
            // Continue with redirect even if MongoDB creation fails
            // The user can be created later during their first login
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
