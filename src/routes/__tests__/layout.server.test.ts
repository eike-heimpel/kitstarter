import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';

describe('Layout Server Load Functions', () => {
    const mockEvent = {
        locals: {
            supabase: {}
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        // Set default auth to enabled
        vi.mock('$env/static/public', () => ({
            PUBLIC_AUTH_ENABLED: 'true'
        }));
    });

    describe('Auth Layout', () => {
        it('should redirect when supabase is not available', async () => {
            const mockEventNoSupabase = {
                locals: {
                    supabase: null
                }
            };

            const { load } = await import('../auth/+layout.server');
            await expect(load(mockEventNoSupabase as any)).rejects.toThrow();
        });

        it('should allow access when supabase is available', async () => {
            const { load } = await import('../auth/+layout.server');
            const result = await load(mockEvent as any);
            expect(result).toBeUndefined();
        });
    });

    describe('Private Layout', () => {
        it('should redirect when supabase is not available', async () => {
            const mockEventNoSupabase = {
                locals: {
                    supabase: null
                }
            };

            const { load } = await import('../private/+layout.server');
            await expect(load(mockEventNoSupabase as any)).rejects.toThrow();
        });

        it('should allow access when supabase is available', async () => {
            const { load } = await import('../private/+layout.server');
            const result = await load(mockEvent as any);
            expect(result).toBeUndefined();
        });
    });

    describe('Root Layout', () => {
        it('should handle safeGetSession throwing an error', async () => {
            const mockCookies = {
                getAll: vi.fn().mockReturnValue(['cookie1'])
            };
            const mockError = new Error('Session fetch failed');
            const mockSafeGetSession = vi.fn().mockRejectedValue(mockError);

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: mockSafeGetSession },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: null,
                cookies: ['cookie1']
            });
            expect(mockSafeGetSession).toHaveBeenCalled();
        });

        it('should handle empty cookies array', async () => {
            const mockCookies = {
                getAll: vi.fn().mockReturnValue([])
            };

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: vi.fn().mockResolvedValue({ session: null }) },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: null,
                cookies: []
            });
        });

        it('should handle undefined cookies', async () => {
            const mockCookies = {
                getAll: vi.fn().mockReturnValue(undefined)
            };

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: vi.fn().mockResolvedValue({ session: null }) },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: null,
                cookies: undefined
            });
        });

        it('should handle session with minimal user data', async () => {
            const mockCookies = {
                getAll: vi.fn().mockReturnValue(['cookie1'])
            };
            const minimalSession = { user: { id: '123' } };

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: vi.fn().mockResolvedValue({ session: minimalSession }) },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: minimalSession,
                cookies: ['cookie1']
            });
        });

        it('should handle session with null user', async () => {
            const mockCookies = {
                getAll: vi.fn().mockReturnValue(['cookie1'])
            };
            const nullUserSession = { user: null };

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: vi.fn().mockResolvedValue({ session: nullUserSession }) },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: nullUserSession,
                cookies: ['cookie1']
            });
        });

        it('should return null session when auth is disabled', async () => {
            vi.mock('$env/static/public', () => ({
                PUBLIC_AUTH_ENABLED: 'false'
            }));

            const mockCookies = {
                getAll: vi.fn().mockReturnValue(['cookie1', 'cookie2'])
            };

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: vi.fn().mockResolvedValue({ session: null }) },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: null,
                cookies: ['cookie1', 'cookie2']
            });
        });

        it('should return session when auth is enabled', async () => {
            vi.mock('$env/static/public', () => ({
                PUBLIC_AUTH_ENABLED: 'true'
            }));

            const mockCookies = {
                getAll: vi.fn().mockReturnValue(['cookie1', 'cookie2'])
            };
            const mockSession = { user: { id: '123' } };
            const mockSafeGetSession = vi.fn().mockResolvedValue({ session: mockSession });

            const { load } = await import('../+layout.server');
            const result = await load({
                locals: { safeGetSession: mockSafeGetSession },
                cookies: mockCookies
            } as any);

            expect(result).toEqual({
                session: mockSession,
                cookies: ['cookie1', 'cookie2']
            });
            expect(mockSafeGetSession).toHaveBeenCalled();
        });
    });
}); 