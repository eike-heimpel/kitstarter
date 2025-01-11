import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the $env/static/public module to dynamically access process.env
vi.mock('$env/static/public', () => ({
    get PUBLIC_AUTH_ENABLED() {
        return process.env.PUBLIC_AUTH_ENABLED;
    }
}));

describe('Auth Configuration', () => {
    beforeEach(() => {
        vi.resetModules();
        delete process.env.PUBLIC_AUTH_ENABLED;
    });

    it('should enable auth when PUBLIC_AUTH_ENABLED is true', async () => {
        process.env.PUBLIC_AUTH_ENABLED = 'true';
        const { userAuth } = await import('$lib/config');
        expect(userAuth).toBe(true);
    });

    it('should disable auth when PUBLIC_AUTH_ENABLED is false', async () => {
        process.env.PUBLIC_AUTH_ENABLED = 'false';
        const { userAuth } = await import('$lib/config');
        expect(userAuth).toBe(false);
    });

    it('should handle missing PUBLIC_AUTH_ENABLED env var', async () => {
        const { userAuth } = await import('$lib/config');
        expect(userAuth).toBe(false);
    });

    it('should handle invalid PUBLIC_AUTH_ENABLED values', async () => {
        process.env.PUBLIC_AUTH_ENABLED = 'invalid';
        const { userAuth } = await import('$lib/config');
        expect(userAuth).toBe(false);
    });
}); 