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

    it('should update a document', async () => {
        const service = new TestService();
        const mockId = new ObjectId();
        const update = { name: 'updated' };
        const updatedDoc = {
            _id: mockId,
            name: 'updated',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockCollection.findOneAndUpdate.mockResolvedValueOnce(updatedDoc);

        const result = await service.update(mockId, update);
        expect(result).toEqual(updatedDoc);
        expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockId },
            {
                $set: {
                    ...update,
                    updatedAt: expect.any(Date)
                }
            },
            { returnDocument: 'after' }
        );
    });

    it('should delete a document', async () => {
        const service = new TestService();
        const mockId = new ObjectId();

        mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

        const result = await service.delete(mockId);
        expect(result).toBe(true);
        expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: mockId });
    });

    it('should return false when document not found for deletion', async () => {
        const service = new TestService();
        const mockId = new ObjectId();

        mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

        const result = await service.delete(mockId);
        expect(result).toBe(false);
    });

    it('should find one document by custom filter', async () => {
        const service = new TestService();
        const mockDoc = {
            _id: new ObjectId(),
            name: 'test',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const filter = { name: 'test' };

        mockCollection.findOne.mockResolvedValueOnce(mockDoc);

        const result = await service.findOne(filter);
        expect(result).toEqual(mockDoc);
        expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
    });

    it('should return null when document not found', async () => {
        const service = new TestService();
        const filter = { name: 'nonexistent' };

        mockCollection.findOne.mockResolvedValueOnce(null);

        const result = await service.findOne(filter);
        expect(result).toBeNull();
    });
});
