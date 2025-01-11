import { describe, it, expect, vi } from 'vitest';
import { GET } from '../+server';
import { redirect } from '@sveltejs/kit';

describe('Auth Confirm Endpoint', () => {
    const mockSupabase = {
        auth: {
            verifyOtp: vi.fn()
        }
    };

    function createMockUrl(params: Record<string, string>) {
        const url = new URL('http://localhost/auth/confirm');
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        return url;
    }

    function getPathFromUrl(url: string) {
        return new URL(url, 'http://localhost').pathname + new URL(url, 'http://localhost').search;
    }

    it('should redirect to error page if token_hash is missing', async () => {
        const url = new URL('http://localhost/auth/confirm');

        try {
            await GET({
                url,
                locals: { supabase: mockSupabase }
            } as any);
            // If we get here, the test should fail because we expect a redirect
            expect(true).toBe(false);
        } catch (error: any) {
            // Verify the redirect properties
            expect(error.status).toBe(303);
            expect(error.location).toBe('/auth/error?error=missing-token');
        }
    });

    it('should redirect to error page if type is missing', async () => {
        const url = createMockUrl({ token_hash: 'some-hash' });

        try {
            await GET({
                url,
                locals: { supabase: mockSupabase }
            } as any);
            expect(true).toBe(false);
        } catch (error: any) {
            expect(error).toHaveProperty('status', 303);
            expect(error).toHaveProperty('location');
            const path = getPathFromUrl(error.location);
            expect(path).toContain('/auth/error');
        }
    });

    it('should redirect to next URL on successful verification', async () => {
        const url = createMockUrl({
            token_hash: 'valid-hash',
            type: 'email',
            next: '/dashboard'
        });

        vi.mocked(mockSupabase.auth.verifyOtp).mockResolvedValueOnce({ error: null });

        try {
            await GET({
                url,
                locals: { supabase: mockSupabase }
            } as any);
            expect(true).toBe(false);
        } catch (error: any) {
            expect(error).toHaveProperty('status', 303);
            expect(error).toHaveProperty('location');
            const path = getPathFromUrl(error.location);
            expect(path).toBe('/dashboard');
        }

        expect(mockSupabase.auth.verifyOtp).toHaveBeenCalledWith({
            type: 'email',
            token_hash: 'valid-hash'
        });
    });

    it('should redirect to error page on verification failure', async () => {
        const url = createMockUrl({
            token_hash: 'invalid-hash',
            type: 'email',
            next: '/dashboard'
        });

        vi.mocked(mockSupabase.auth.verifyOtp).mockResolvedValueOnce({
            error: { message: 'Invalid OTP' }
        });

        try {
            await GET({
                url,
                locals: { supabase: mockSupabase }
            } as any);
            expect(true).toBe(false);
        } catch (error: any) {
            expect(error).toHaveProperty('status', 303);
            expect(error).toHaveProperty('location');
            const path = getPathFromUrl(error.location);
            expect(path).toContain('/auth/error');
        }

        expect(mockSupabase.auth.verifyOtp).toHaveBeenCalledWith({
            type: 'email',
            token_hash: 'invalid-hash'
        });
    });

    it('should use default next path if not provided', async () => {
        const url = createMockUrl({
            token_hash: 'valid-hash',
            type: 'email'
        });

        vi.mocked(mockSupabase.auth.verifyOtp).mockResolvedValueOnce({ error: null });

        try {
            await GET({
                url,
                locals: { supabase: mockSupabase }
            } as any);
            expect(true).toBe(false);
        } catch (error: any) {
            expect(error).toHaveProperty('status', 303);
            expect(error).toHaveProperty('location');
            const path = getPathFromUrl(error.location);
            expect(path).toBe('/');
        }
    });
}); 