import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MongoClient } from 'mongodb';

// Mock mongodb
vi.mock('mongodb', () => ({
    MongoClient: vi.fn(() => ({
        close: vi.fn().mockResolvedValue(undefined),
        connect: vi.fn().mockResolvedValue(undefined),
        db: vi.fn(),
        options: {},
        serverApi: undefined,
        readConcern: undefined,
        writeConcern: undefined,
        readPreference: undefined,
        bsonOptions: undefined,
        logger: undefined
    }))
}));

describe('MongoDB Client', () => {
    const originalEnv = process.env;
    const mockClose = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        // Reset environment before each test
        process.env = { ...originalEnv };
        // Reset MongoClient mock
        vi.mocked(MongoClient).mockImplementation(() => ({
            close: mockClose,
            connect: vi.fn().mockResolvedValue(undefined),
            db: vi.fn(),
            options: {},
            serverApi: undefined,
            readConcern: undefined,
            writeConcern: undefined,
            readPreference: undefined,
            bsonOptions: undefined,
            logger: undefined
        }));
        // Clear module cache to test different environment scenarios
        vi.resetModules();
    });

    afterEach(() => {
        // Restore environment
        process.env = originalEnv;
        // Clear all mocks
        vi.clearAllMocks();
    });

    it('should create a MongoDB client when URI is provided', async () => {
        // Set environment variable
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

        // Import the client (this will execute the file)
        const { mongodb } = await import('../client');

        // Verify MongoClient was called with correct URI
        expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:27017/test');
        expect(mongodb).toBeDefined();
    });

    it('should throw error when MONGODB_URI is not set', async () => {
        // Ensure MONGODB_URI is not set
        delete process.env.MONGODB_URI;

        // Attempt to import the client
        await expect(import('../client')).rejects.toThrow('MONGODB_URI environment variable is not set');
    });

    it('should close client on SIGTERM', async () => {
        // Set environment variable
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

        // Import the client
        await import('../client');

        // Simulate SIGTERM
        process.emit('SIGTERM', 'SIGTERM');

        // Verify close was called
        expect(mockClose).toHaveBeenCalled();
    });

    it('should handle close errors gracefully', async () => {
        // Set environment variable
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

        // Mock console.error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Mock close to reject
        const mockCloseError = new Error('Failed to close connection');
        vi.mocked(MongoClient).mockImplementation(() => ({
            close: vi.fn().mockRejectedValue(mockCloseError),
            connect: vi.fn().mockResolvedValue(undefined),
            db: vi.fn(),
            options: {},
            serverApi: undefined,
            readConcern: undefined,
            writeConcern: undefined,
            readPreference: undefined,
            bsonOptions: undefined,
            logger: undefined
        }));

        // Import the client
        await import('../client');

        // Simulate SIGTERM
        process.emit('SIGTERM', 'SIGTERM');

        // Verify error was logged
        expect(consoleSpy).toHaveBeenCalledWith(mockCloseError);

        // Restore console.error
        consoleSpy.mockRestore();
    });
}); 