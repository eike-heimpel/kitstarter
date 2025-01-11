# MongoDB Integration

This document outlines the MongoDB integration in our SvelteKit application.

## Overview

The MongoDB integration is structured to provide a clean, type-safe, and server-side-only interface to the database. The implementation follows these key principles:

- All MongoDB operations are server-side only
- Type safety throughout the codebase
- Abstracted database operations through service classes
- Centralized connection management
- Environment-based configuration
- Extensible base service class for common operations

## Structure

```
src/lib/server/mongodb/
├── client.ts          # MongoDB client setup and connection management
├── collections.ts     # Collection definitions and exports
├── types.ts          # TypeScript interfaces for documents
├── index.ts          # Central export point
└── services/         # Service classes for database operations
    ├── BaseService.ts # Abstract base class with common CRUD operations
    └── UserService.ts # User-specific service implementation
```

## Configuration

The MongoDB connection requires two environment variables:

- `MONGODB_URI`: Your MongoDB connection string
- `MONGO_DB_DATABASE`: The name of your MongoDB database

Add these to your `.env` file:

```env
MONGODB_URI="your-mongodb-connection-string"
MONGO_DB_DATABASE="your-database-name"
```

## Usage

### Base Service Pattern

The `BaseService` class provides common CRUD operations for all collections:

```typescript
abstract class BaseService<T extends BaseDocument> {
    async findById(id: ObjectId): Promise<T | null>;
    async findOne(filter: Filter<T>): Promise<T | null>;
    async find(filter: Filter<T>, page?: number, limit?: number): Promise<{ items: T[]; total: number }>;
    async create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    async update(id: ObjectId, update: Partial<T>): Promise<T | null>;
    async delete(id: ObjectId): Promise<boolean>;
}
```

### Service Implementation

Services extend the BaseService to inherit common CRUD operations while adding collection-specific methods:


### API Routes

Example of using services in a SvelteKit API route:

```typescript
// src/routes/api/users/+server.ts
import { userService } from '$lib/server/mongodb';

export const GET = async ({ url }: RequestEvent) => {
    const page = Number(url.searchParams.get('page')) || 1;
    const result = await userService.find({}, page);
    return json(result);
};
```

## Adding New Collections

1. Define the type in `types.ts`:
```typescript
export interface NewCollection extends BaseDocument {
    // your fields here
}
```

2. Add the collection to `collections.ts`:
```typescript
export const newCollection: Collection<NewCollection> = db.collection('new_collection');
```

3. Create a new service in `services/NewCollectionService.ts`:
```typescript
export class NewCollectionService extends BaseService<NewCollection> {
    constructor() {
        super(newCollection);
    }

    // Add collection-specific methods here
}

// Export singleton instance
export const newCollectionService = new NewCollectionService();
```

## Best Practices

1. Always use service classes for database operations
2. Keep database operations server-side only
3. Use TypeScript interfaces for type safety
4. Handle errors appropriately
5. Use pagination for list operations
6. Keep services focused and single-responsibility
7. Use the BaseService for common CRUD operations
8. Export services as singletons
9. Document new collections and services

## Error Handling

The service methods include proper error handling and type checking. When using these services, wrap your calls in try-catch blocks:

```typescript
try {
    const user = await userService.findById(id);
} catch (err) {
    console.error('Error fetching user:', err);
    throw error(500, 'Internal server error');
}
