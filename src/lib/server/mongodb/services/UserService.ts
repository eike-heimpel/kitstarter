import type { User } from '../types';
import { BaseService } from './BaseService';
import { users } from '../collections';

export class UserService extends BaseService<User> {
    constructor() {
        super(users);
    }

    /**
     * Find a user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ email } as any);
    }

    /**
     * Find a user by Supabase ID
     */
    async findBySupabaseId(supabaseId: string): Promise<User | null> {
        return this.findOne({ supabaseId } as any);
    }

    /**
     * List users with pagination
     * @deprecated Use find() from BaseService instead
     */
    async listUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
        const { items, total } = await this.find({}, page, limit);
        return { users: items, total };
    }
}

// Export a singleton instance
export const userService = new UserService();
