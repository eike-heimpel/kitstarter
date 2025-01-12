import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../+server';
import { userService } from '$lib/server/mongodb';
import type { User } from '$lib/server/mongodb/types';
import { ObjectId } from 'mongodb';

// Mock userService
vi.mock('$lib/server/mongodb', () => ({
    userService: {
        find: vi.fn(),
        create: vi.fn(),
        findBySupabaseId: vi.fn(),
        findByEmail: vi.fn()
    }
}));

// Helper to convert dates to ISO strings in objects
function convertDatesToISOStrings(obj: any): any {
    const newObj = { ...obj };
    for (const key in newObj) {
        if (newObj[key] instanceof Date) {
            newObj[key] = newObj[key].toISOString();
        } else if (newObj[key] instanceof ObjectId) {
            newObj[key] = newObj[key].toString();
        } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
            newObj[key] = convertDatesToISOStrings(newObj[key]);
        }
    }
    return newObj;
}

describe('Users API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return paginated users', async () => {
            const mockUsers: User[] = [
                {
                    _id: new ObjectId('000000000000000000000001'),
                    email: 'user1@example.com',
                    supabaseId: 'sup1',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: new ObjectId('000000000000000000000002'),
                    email: 'user2@example.com',
                    supabaseId: 'sup2',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            vi.mocked(userService.find).mockResolvedValueOnce({
                items: mockUsers,
                total: 2
            });

            const response = await GET({
                url: new URL('http://localhost/api/users?page=1&limit=10')
            } as any);

            const data = await response.json();
            expect(data).toEqual({
                users: mockUsers.map(user => convertDatesToISOStrings(user)),
                total: 2
            });
            expect(userService.find).toHaveBeenCalledWith({}, 1, 10);
        });

        it('should handle errors', async () => {
            vi.mocked(userService.find).mockRejectedValueOnce(new Error('Database error'));

            try {
                await GET({
                    url: new URL('http://localhost/api/users')
                } as any);
                // If we reach here, the test should fail
                expect(true).toBe(false);
            } catch (err: any) {
                expect(err.status).toBe(500);
                expect(err.body.message).toBe('Internal server error');
            }
        });
    });

    describe('POST', () => {
        const mockUserData = {
            email: 'test@example.com',
            name: 'Test User',
            supabaseId: 'abc123'
        };

        it('should create a new user', async () => {
            const mockCreatedUser: User = {
                _id: new ObjectId('000000000000000000000001'),
                ...mockUserData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            vi.mocked(userService.findBySupabaseId).mockResolvedValueOnce(null);
            vi.mocked(userService.findByEmail).mockResolvedValueOnce(null);
            vi.mocked(userService.create).mockResolvedValueOnce(mockCreatedUser);

            const response = await POST({
                request: new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mockUserData)
                })
            } as any);

            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual(convertDatesToISOStrings(mockCreatedUser));
        });

        it('should validate required fields', async () => {
            const invalidData = { email: 'test@example.com' };

            try {
                await POST({
                    request: new Request('http://localhost/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(invalidData)
                    })
                } as any);
                // If we reach here, the test should fail
                expect(true).toBe(false);
            } catch (err: any) {
                expect(err.status).toBe(400);
                expect(err.body.message).toBe('Email, name, and supabaseId are required');
            }
        });

        it('should prevent duplicate supabaseId', async () => {
            const existingUser: User = {
                _id: new ObjectId(),
                email: 'existing@example.com',
                supabaseId: 'abc123',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            vi.mocked(userService.findBySupabaseId).mockResolvedValueOnce(existingUser);

            try {
                await POST({
                    request: new Request('http://localhost/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mockUserData)
                    })
                } as any);
                // If we reach here, the test should fail
                expect(true).toBe(false);
            } catch (err: any) {
                expect(err.status).toBe(409);
                expect(err.body.message).toBe('User already exists');
            }
        });

        it('should prevent duplicate email', async () => {
            const existingUser: User = {
                _id: new ObjectId(),
                email: 'test@example.com',
                supabaseId: 'existing123',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            vi.mocked(userService.findBySupabaseId).mockResolvedValueOnce(null);
            vi.mocked(userService.findByEmail).mockResolvedValueOnce(existingUser);

            try {
                await POST({
                    request: new Request('http://localhost/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mockUserData)
                    })
                } as any);
                // If we reach here, the test should fail
                expect(true).toBe(false);
            } catch (err: any) {
                expect(err.status).toBe(409);
                expect(err.body.message).toBe('User with this email already exists');
            }
        });

        it('should handle database errors during creation', async () => {
            vi.mocked(userService.findBySupabaseId).mockResolvedValueOnce(null);
            vi.mocked(userService.findByEmail).mockResolvedValueOnce(null);
            vi.mocked(userService.create).mockRejectedValueOnce(new Error('Database connection failed'));

            try {
                await POST({
                    request: new Request('http://localhost/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mockUserData)
                    })
                } as any);
                // If we reach here, the test should fail
                expect(true).toBe(false);
            } catch (err: any) {
                expect(err.status).toBe(500);
                expect(err.body.message).toBe('Internal server error');
            }
        });
    });
});
