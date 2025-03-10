import { json, error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { userService } from '$lib/server/mongodb';

export const GET = async ({ url }: RequestEvent) => {
    try {
        const page = Number(url.searchParams.get('page')) || 1;
        const limit = Number(url.searchParams.get('limit')) || 10;

        const result = await userService.find({}, page, limit);
        return json({ users: result.items, total: result.total });
    } catch (err) {
        console.error('Error fetching users:', err);
        throw error(500, 'Internal server error');
    }
};

export const POST = async ({ request }: RequestEvent) => {
    try {
        const userData = await request.json();

        // Validate required fields
        if (!userData.email || !userData.name || !userData.supabaseId) {
            throw error(400, 'Email, name, and supabaseId are required');
        }

        // Check if user already exists with this supabaseId
        const existingUserById = await userService.findBySupabaseId(userData.supabaseId);
        if (existingUserById) {
            throw error(409, 'User already exists');
        }

        const existingUser = await userService.findByEmail(userData.email);
        if (existingUser) {
            throw error(409, 'User with this email already exists');
        }

        const newUser = await userService.create(userData);
        return json(newUser, { status: 201 });
    } catch (err: any) {
        // If it's already an error from @sveltejs/kit, rethrow it
        if (err.status) {
            throw err;
        }
        // For other errors, return 500
        console.error('Error creating user:', err);
        throw error(500, 'Internal server error');
    }
};
