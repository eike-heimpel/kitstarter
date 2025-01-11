import type { ObjectId } from 'mongodb';

export interface BaseDocument {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface User extends BaseDocument {
    supabaseId: string;
    email: string;
    name: string;
    // Add other user fields as needed
}

// Add other collection types here as needed
