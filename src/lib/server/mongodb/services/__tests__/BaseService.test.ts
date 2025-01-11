import { describe, it, expect, vi } from 'vitest';
import { BaseService } from '../BaseService';
import { ObjectId } from 'mongodb';
import type { BaseDocument } from '../../types';

// Test document type
interface TestDoc extends BaseDocument {
    name: string;
}

class TestService extends BaseService<TestDoc> {
    constructor() {
        super(mockCollection);
    }
}

// Mock collection for testing
const mockCollection = {
    findOne: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    insertOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    deleteOne: vi.fn()
} as any;

describe('BaseService', () => {
    it('should find document by id', async () => {
        const service = new TestService();
        const mockId = new ObjectId();
        const mockDoc = { _id: mockId, name: 'test', createdAt: new Date(), updatedAt: new Date() };

        mockCollection.findOne.mockResolvedValueOnce(mockDoc);

        const result = await service.findById(mockId);
        expect(result).toEqual(mockDoc);
        expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: mockId });
    });

    it('should create a new document', async () => {
        const service = new TestService();
        const mockId = new ObjectId();
        const input = { name: 'test' };

        mockCollection.insertOne.mockResolvedValueOnce({
            insertedId: mockId,
            acknowledged: true
        });

        const result = await service.create(input);
        expect(result).toHaveProperty('_id', mockId);
        expect(result).toHaveProperty('name', 'test');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
    });

    it('should find documents with pagination', async () => {
        const service = new TestService();
        const mockDocs = [
            { _id: new ObjectId(), name: 'test1', createdAt: new Date(), updatedAt: new Date() },
            { _id: new ObjectId(), name: 'test2', createdAt: new Date(), updatedAt: new Date() }
        ];

        const mockToArray = vi.fn().mockResolvedValueOnce(mockDocs);
        const mockSkip = vi.fn().mockReturnThis();
        const mockLimit = vi.fn().mockReturnThis();

        mockCollection.find.mockReturnValueOnce({
            skip: mockSkip,
            limit: mockLimit,
            toArray: mockToArray
        });
        mockCollection.countDocuments.mockResolvedValueOnce(2);

        const result = await service.find({}, 1, 10);

        expect(mockCollection.find).toHaveBeenCalledWith({});
        expect(mockSkip).toHaveBeenCalledWith(0);
        expect(mockLimit).toHaveBeenCalledWith(10);
        expect(result.items).toEqual(mockDocs);
        expect(result.total).toBe(2);
    });
});
