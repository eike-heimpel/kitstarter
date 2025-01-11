import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../UserService';
import { ObjectId } from 'mongodb';
import type { User } from '../../types';

// Mock collections module
vi.mock('../../collections', () => ({
    users: {
        findOne: vi.fn(),
        find: vi.fn(() => ({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            toArray: vi.fn()
        })),
        countDocuments: vi.fn(),
        insertOne: vi.fn(),
        findOneAndUpdate: vi.fn(),
        deleteOne: vi.fn()
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should find user by email', async () => {
        const service = new UserService();
        const mockUser: User = {
            _id: new ObjectId(),
            email: 'test@example.com',
            supabaseId: 'abc123',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        vi.mocked(service['collection'].findOne).mockResolvedValueOnce(mockUser);

        const result = await service.findByEmail('test@example.com');
        expect(result).toEqual(mockUser);
        expect(service['collection'].findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should find user by Supabase ID', async () => {
        const service = new UserService();
        const mockUser: User = {
            _id: new ObjectId(),
            email: 'test@example.com',
            supabaseId: 'abc123',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        vi.mocked(service['collection'].findOne).mockResolvedValueOnce(mockUser);

        const result = await service.findBySupabaseId('abc123');
        expect(result).toEqual(mockUser);
        expect(service['collection'].findOne).toHaveBeenCalledWith({ supabaseId: 'abc123' });
    });

    it('should return null when user not found by email', async () => {
        const service = new UserService();
        vi.mocked(service['collection'].findOne).mockResolvedValueOnce(null);

        const result = await service.findByEmail('nonexistent@example.com');
        expect(result).toBeNull();
    });

    it('should return null when user not found by Supabase ID', async () => {
        const service = new UserService();
        vi.mocked(service['collection'].findOne).mockResolvedValueOnce(null);

        const result = await service.findBySupabaseId('nonexistent');
        expect(result).toBeNull();
    });
});
