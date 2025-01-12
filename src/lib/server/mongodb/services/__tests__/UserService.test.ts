import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../UserService';
import { ObjectId, type WithId } from 'mongodb';
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

    it('should list users with pagination', async () => {
        const service = new UserService();
        const mockUsers: WithId<User>[] = [
            {
                _id: new ObjectId(),
                email: 'user1@example.com',
                supabaseId: 'abc123',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                email: 'user2@example.com',
                supabaseId: 'def456',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const mockToArray = vi.fn().mockResolvedValueOnce(mockUsers);
        const mockSkip = vi.fn().mockReturnThis();
        const mockLimit = vi.fn().mockReturnThis();
        const mockFind = vi.fn().mockReturnValue({
            skip: mockSkip,
            limit: mockLimit,
            toArray: mockToArray
        });

        vi.mocked(service['collection'].find).mockImplementation(mockFind);
        vi.mocked(service['collection'].countDocuments).mockResolvedValueOnce(2);

        const result = await service.listUsers(1, 10);

        expect(result).toEqual({ users: mockUsers, total: 2 });
        expect(service['collection'].find).toHaveBeenCalledWith({});
        expect(mockSkip).toHaveBeenCalledWith(0);
        expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it('should list users with default pagination values', async () => {
        const service = new UserService();
        const mockUsers: WithId<User>[] = [];

        const mockToArray = vi.fn().mockResolvedValueOnce(mockUsers);
        const mockSkip = vi.fn().mockReturnThis();
        const mockLimit = vi.fn().mockReturnThis();
        const mockFind = vi.fn().mockReturnValue({
            skip: mockSkip,
            limit: mockLimit,
            toArray: mockToArray
        });

        vi.mocked(service['collection'].find).mockImplementation(mockFind);
        vi.mocked(service['collection'].countDocuments).mockResolvedValueOnce(0);

        const result = await service.listUsers();

        expect(result).toEqual({ users: [], total: 0 });
        expect(service['collection'].find).toHaveBeenCalledWith({});
        expect(mockSkip).toHaveBeenCalledWith(0);
        expect(mockLimit).toHaveBeenCalledWith(10);
    });
});
