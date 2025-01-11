import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MongoClient } from 'mongodb';

// Mock $env/static/private module
vi.mock('$env/static/private', () => ({
    get MONGODB_URI() {
        return process.env.MONGODB_URI;
    }
}));

// Mock mongodb
vi.mock('mongodb', () => {
    return {
        MongoClient: vi.fn().mockImplementation((uri: string) => {
            return {
                close: vi.fn().mockResolvedValue(undefined)
            };
        })
    };
});

describe('MongoDB Client', () => {
    const originalEnv = process.env;
    const originalListeners = process.listeners('SIGTERM');

    beforeEach(() => {
        // Reset environment before each test
        process.env = { ...originalEnv };
        // Clear module cache to test different environment scenarios
        vi.resetModules();
        // Clear all mocks
        vi.clearAllMocks();
        // Store original SIGTERM listeners
        process.removeAllListeners('SIGTERM');
    });

    afterEach(() => {
        // Restore environment
        process.env = originalEnv;
        // Restore original SIGTERM listeners
        process.removeAllListeners('SIGTERM');
        originalListeners.forEach(listener => process.on('SIGTERM', listener));
    });

    it('should create a MongoDB client when URI is provided', async () => {
        // Set environment variable
        const testUri = 'mongodb://localhost:27017/test';
        process.env.MONGODB_URI = testUri;

        // Import the client (this will execute the file)
        const { mongodb } = await import('../client');

        // Verify MongoClient was called with correct URI
        expect(MongoClient).toHaveBeenCalledWith(testUri);
        expect(mongodb).toBeDefined();
    });

    it('should throw error when MONGODB_URI is not set', async () => {
        // Ensure MONGODB_URI is not set
        delete process.env.MONGODB_URI;

        // Attempt to import the client
        await expect(() => import('../client')).rejects.toThrow('MONGODB_URI environment variable is not set');
    });

    it('should close client on SIGTERM', async () => {
        // Set environment variable
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

        // Get the close mock
        const closeMock = vi.fn().mockResolvedValue(undefined);
        // @ts-expect-error - Partial mock is sufficient for our tests
        vi.mocked(MongoClient).mockImplementation(() => ({
            close: closeMock
        }));

        // Import the client
        await import('../client');

        // Simulate SIGTERM
        process.emit('SIGTERM', 'SIGTERM');

        // Wait for any promises to resolve
        await new Promise(process.nextTick);

        // Verify close was called
        expect(closeMock).toHaveBeenCalled();
    });

    it('should handle close errors gracefully', async () => {
        // Set environment variable
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

        // Mock console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Mock close to reject
        const mockCloseError = new Error('Failed to close connection');
        // @ts-expect-error - Partial mock is sufficient for our tests
        vi.mocked(MongoClient).mockImplementation(() => ({
            close: vi.fn().mockRejectedValue(mockCloseError)
        }));

        // Import the client
        await import('../client');

        // Simulate SIGTERM
        process.emit('SIGTERM', 'SIGTERM');

        // Wait for any promises to resolve
        await new Promise(process.nextTick);

        // Verify error was logged
        expect(consoleSpy).toHaveBeenCalledWith(mockCloseError);

        // Restore console.error
        consoleSpy.mockRestore();
    });
}); 