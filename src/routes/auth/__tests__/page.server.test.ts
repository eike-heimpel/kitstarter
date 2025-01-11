import { describe, it, expect, vi, beforeEach } from 'vitest';
import { actions } from '../+page.server';
import { userService } from '$lib/server/mongodb/services/UserService';
import { fail, redirect } from '@sveltejs/kit';

// Mock userService
vi.mock('$lib/server/mongodb/services/UserService', () => ({
    userService: {
        findByEmail: vi.fn(),
        create: vi.fn()
    }
}));

// Mock environment variable
vi.stubEnv('PUBLIC_SITE_URL', 'http://localhost:5173');

describe('Auth Actions', () => {
    const mockSupabase = {
        auth: {
            signInWithOtp: vi.fn(),
            signUp: vi.fn(),
            signInWithPassword: vi.fn()
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('magicLink', () => {
        const createMockRequest = (email?: string) => {
            return new Request('http://localhost', {
                method: 'POST',
                body: new URLSearchParams({ email: email || '' }).toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        it('should fail if email is not provided', async () => {
            const result = await actions.magicLink({
                request: createMockRequest(),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Please provide your email'
            }));
        });

        it('should create new user if not exists and send magic link', async () => {
            const email = 'test@example.com';
            vi.mocked(userService.findByEmail).mockResolvedValueOnce(null);
            vi.mocked(userService.create).mockResolvedValueOnce({ email } as any);
            vi.mocked(mockSupabase.auth.signInWithOtp).mockResolvedValueOnce({ error: null });

            const result = await actions.magicLink({
                request: createMockRequest(email),
                locals: { supabase: mockSupabase }
            } as any);

            expect(userService.create).toHaveBeenCalledWith({
                email,
                supabaseId: ''
            });
            expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
                email,
                options: {
                    emailRedirectTo: 'http://localhost:5173/auth/confirm'
                }
            });
            expect(result).toEqual({
                message: 'Check your email for the magic link'
            });
        });

        it('should handle existing user and send magic link', async () => {
            const email = 'test@example.com';
            vi.mocked(userService.findByEmail).mockResolvedValueOnce({ email } as any);
            vi.mocked(mockSupabase.auth.signInWithOtp).mockResolvedValueOnce({ error: null });

            const result = await actions.magicLink({
                request: createMockRequest(email),
                locals: { supabase: mockSupabase }
            } as any);

            expect(userService.create).not.toHaveBeenCalled();
            expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'Check your email for the magic link'
            });
        });

        it('should handle Supabase error', async () => {
            const email = 'test@example.com';
            vi.mocked(userService.findByEmail).mockResolvedValueOnce(null);
            vi.mocked(userService.create).mockResolvedValueOnce({ email } as any);
            vi.mocked(mockSupabase.auth.signInWithOtp).mockResolvedValueOnce({
                error: { message: 'Invalid email' }
            });

            const result = await actions.magicLink({
                request: createMockRequest(email),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Invalid email'
            }));
        });
    });

    describe('signup', () => {
        const createMockRequest = (email?: string, password?: string) => {
            return new Request('http://localhost', {
                method: 'POST',
                body: new URLSearchParams({
                    email: email || '',
                    password: password || ''
                }).toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        it('should fail if email or password is not provided', async () => {
            const result = await actions.signup({
                request: createMockRequest(),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Please provide both email and password'
            }));
        });

        it('should fail if password is too short', async () => {
            const result = await actions.signup({
                request: createMockRequest('test@example.com', '12345'),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Password must be at least 6 characters long'
            }));
        });

        it('should create user and handle successful signup', async () => {
            const email = 'test@example.com';
            const password = '123456';
            const userId = 'test-user-id';

            vi.mocked(mockSupabase.auth.signUp).mockResolvedValueOnce({
                data: { user: { id: userId } },
                error: null
            });

            try {
                await actions.signup({
                    request: createMockRequest(email, password),
                    locals: { supabase: mockSupabase }
                } as any);
            } catch (error) {
                // Ignore redirect response
            }

            // Only verify the side effects
            expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
                email,
                password
            });
            expect(userService.create).toHaveBeenCalledWith({
                email,
                supabaseId: userId
            });
        });

        it('should handle Supabase error', async () => {
            const email = 'test@example.com';
            const password = '123456';

            vi.mocked(mockSupabase.auth.signUp).mockResolvedValueOnce({
                data: null,
                error: { message: 'Email already registered' }
            });

            const result = await actions.signup({
                request: createMockRequest(email, password),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Email already registered'
            }));
        });
    });

    describe('login', () => {
        const createMockRequest = (email?: string, password?: string) => {
            return new Request('http://localhost', {
                method: 'POST',
                body: new URLSearchParams({
                    email: email || '',
                    password: password || ''
                }).toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        it('should fail if email or password is not provided', async () => {
            const result = await actions.login({
                request: createMockRequest(),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Please provide both email and password'
            }));
        });

        it('should handle successful login', async () => {
            const email = 'test@example.com';
            const password = '123456';

            vi.mocked(mockSupabase.auth.signInWithPassword).mockResolvedValueOnce({
                data: {},
                error: null
            });

            try {
                await actions.login({
                    request: createMockRequest(email, password),
                    locals: { supabase: mockSupabase }
                } as any);
            } catch (error) {
                // Ignore redirect response
            }

            // Only verify the side effects
            expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email,
                password
            });
        });

        it('should handle invalid credentials', async () => {
            const email = 'test@example.com';
            const password = 'wrong-password';

            vi.mocked(mockSupabase.auth.signInWithPassword).mockResolvedValueOnce({
                data: null,
                error: { message: 'Invalid credentials' }
            });

            const result = await actions.login({
                request: createMockRequest(email, password),
                locals: { supabase: mockSupabase }
            } as any);

            expect(result).toEqual(fail(400, {
                error: 'Invalid credentials'
            }));
        });
    });
});
