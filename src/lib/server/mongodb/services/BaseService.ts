import type { Collection, ObjectId, Filter, WithId } from 'mongodb';
import type { BaseDocument } from '../types';

export abstract class BaseService<T extends BaseDocument> {
    protected collection: Collection<T>;

    constructor(collection: Collection<T>) {
        this.collection = collection;
    }

    async findById(id: ObjectId): Promise<T | null> {
        const result = await this.collection.findOne({ _id: id } as Filter<T>);
        return result as T | null;
    }

    async findOne(filter: Filter<T>): Promise<T | null> {
        const result = await this.collection.findOne(filter);
        return result as T | null;
    }

    async find(filter: Filter<T> = {}, page = 1, limit = 10): Promise<{ items: T[]; total: number }> {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.collection.find(filter).skip(skip).limit(limit).toArray(),
            this.collection.countDocuments(filter)
        ]);

        return { items: items as T[], total };
    }

    async create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
        const now = new Date();
        const doc = {
            ...data,
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection.insertOne(doc as any);
        return {
            ...doc,
            _id: result.insertedId
        } as T;
    }

    async update(id: ObjectId, update: Partial<Omit<T, '_id' | 'createdAt'>>): Promise<T | null> {
        const result = await this.collection.findOneAndUpdate(
            { _id: id } as Filter<T>,
            {
                $set: {
                    ...update,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result as T | null;
    }

    async delete(id: ObjectId): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: id } as Filter<T>);
        return result.deletedCount === 1;
    }
}
