import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';

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