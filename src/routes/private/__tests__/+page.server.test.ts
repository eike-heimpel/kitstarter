import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect, fail } from '@sveltejs/kit';

// Mock modules at the top level
vi.mock('$env/static/public', () => ({
    PUBLIC_AUTH_ENABLED: 'true'
}));

vi.mock('$lib/config', () => ({
    userAuth: true
}));

describe('Private Route Protection', () => {
    const mockSupabase = {
        auth: {
            getSession: vi.fn()
        }
    };

    const mockLoadEvent = {
        locals: {
            supabase: mockSupabase,
            safeGetSession: vi.fn(),
            session: null,
            user: null
        },
        depends: vi.fn(),
        parent: vi.fn().mockResolvedValue({}),
        url: new URL('http://localhost'),
        params: {},
        route: { id: 'private' },
        setHeaders: vi.fn(),
        cookies: {
            get: vi.fn(),
            set: vi.fn(),
            delete: vi.fn(),
            serialize: vi.fn()
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        // Reset the mock implementation
        mockSupabase.auth.getSession.mockReset();
    });

    it('should allow access when user is authenticated', async () => {
        const mockSession = {
            user: {
                id: 'test-user',
                email: 'test@example.com',
                app_metadata: {},
                user_metadata: {},
                aud: 'authenticated',
                created_at: '2023-01-01'
            }
        };

        mockSupabase.auth.getSession.mockResolvedValue({
            data: {
                session: mockSession
            },
            error: null
        });

        const { load } = await import('../+page.server');
        const result = await load(mockLoadEvent as any);

        expect(result).toEqual({
            supabase: mockSupabase,
            session: mockSession
        });
        expect(mockLoadEvent.depends).toHaveBeenCalledWith('supabase:auth');
    });

    it('should redirect to auth page when user is not authenticated', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: null },
            error: null
        });

        const { load } = await import('../+page.server');

        try {
            await load(mockLoadEvent as any);
            throw new Error('Expected redirect');
        } catch (error: any) {
            expect(error.status).toBe(303);
            expect(error.location).toBe('/auth');
        }
    });

    it('should redirect to auth page on session error', async () => {
        mockSupabase.auth.getSession.mockResolvedValue({
            data: { session: null },
            error: {
                name: 'AuthError',
                message: 'Session error'
            }
        });

        const { load } = await import('../+page.server');

        try {
            await load(mockLoadEvent as any);
            throw new Error('Expected redirect');
        } catch (error: any) {
            expect(error.status).toBe(303);
            expect(error.location).toBe('/auth');
        }
    });

    it('should bypass auth check when auth is disabled', async () => {
        // Override the config for this test
        vi.doMock('$lib/config', () => ({
            userAuth: false
        }));

        const { load } = await import('../+page.server');
        const result = await load(mockLoadEvent as any);

        expect(result).toEqual({
            supabase: mockSupabase,
            session: null
        });
        expect(mockSupabase.auth.getSession).not.toHaveBeenCalled();
    });
});

describe('Password Change Actions', () => {
    const mockSupabase = {
        auth: {
            signInWithPassword: vi.fn(),
            updateUser: vi.fn(),
            getSession: vi.fn()
        }
    };

    const mockSafeGetSession = vi.fn();

    const createMockFormData = (data: Record<string, string>) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fail if any required fields are missing', async () => {
        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    // Missing newPassword and confirmPassword
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(400, {
            error: 'All fields are required'
        }));
    });

    it('should fail if new passwords do not match', async () => {
        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    newPassword: 'new123',
                    confirmPassword: 'different123'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(400, {
            error: 'New passwords do not match'
        }));
    });

    it('should fail if new password is too short', async () => {
        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    newPassword: '12345',
                    confirmPassword: '12345'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(400, {
            error: 'Password must be at least 6 characters long'
        }));
    });

    it('should fail if current password is incorrect', async () => {
        const mockUser = { email: 'test@example.com' };
        mockSafeGetSession.mockResolvedValue({ user: mockUser });
        mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } });

        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'wrongpassword',
                    newPassword: 'newpassword123',
                    confirmPassword: 'newpassword123'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(400, {
            error: 'Current password is incorrect'
        }));
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: mockUser.email,
            password: 'wrongpassword'
        });
    });

    it('should successfully change password when all conditions are met', async () => {
        const mockUser = { email: 'test@example.com' };
        mockSafeGetSession.mockResolvedValue({ user: mockUser });
        mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
        mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    newPassword: 'newpassword123',
                    confirmPassword: 'newpassword123'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual({ success: true });
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: mockUser.email,
            password: 'current123'
        });
        expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newpassword123'
        });
    });

    it('should fail if user email is not found', async () => {
        mockSafeGetSession.mockResolvedValue({ user: null });

        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    newPassword: 'newpassword123',
                    confirmPassword: 'newpassword123'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(400, {
            error: 'User email not found'
        }));
    });

    it('should handle password update errors', async () => {
        const mockUser = { email: 'test@example.com' };
        mockSafeGetSession.mockResolvedValue({ user: mockUser });
        mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
        mockSupabase.auth.updateUser.mockResolvedValue({ error: new Error('Failed to update password') });

        const { actions } = await import('../+page.server');
        const result = await actions.changePassword({
            request: new Request('http://localhost', {
                method: 'POST',
                body: createMockFormData({
                    currentPassword: 'current123',
                    newPassword: 'newpassword123',
                    confirmPassword: 'newpassword123'
                })
            }),
            locals: { supabase: mockSupabase, safeGetSession: mockSafeGetSession }
        } as any);

        expect(result).toEqual(fail(500, {
            error: 'Failed to update password'
        }));
    });
}); 