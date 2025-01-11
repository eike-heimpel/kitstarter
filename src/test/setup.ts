import { vi } from 'vitest';
import type { Collection } from 'mongodb';

// Mock MongoDB collection with just the methods we need for testing
export function createMockCollection<T = any>(): Collection<T> {
    return {
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
    };
}
