import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
}

const client = new MongoClient(MONGODB_URI);

export const mongodb = client;

// Ensure we close the client when the app is shutting down
process.on('SIGTERM', () => {
    client.close().catch(console.error);
});
