import { vi } from 'vitest';
import type { Collection, Document, FindCursor, WithId, Filter, FindOptions } from 'mongodb';
import '@testing-library/jest-dom';

// Configure global fetch for testing
global.fetch = vi.fn();

// Mock window.matchMedia for Svelte components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock MongoDB collection with just the methods we need for testing
export function createMockCollection<T extends Document = Document>(): Partial<Collection<T>> {
    return {
        findOne: vi.fn(),
        find: vi.fn(() => ({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            toArray: vi.fn()
        })) as unknown as Collection<T>['find'],
        countDocuments: vi.fn(),
        insertOne: vi.fn(),
        findOneAndUpdate: vi.fn(),
        deleteOne: vi.fn()
    };
}
