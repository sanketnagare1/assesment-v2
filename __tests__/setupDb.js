import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const setupTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    return mongoUri;
};

export const closeTestDB = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

test('Sample test', () => {
    expect(true).toBe(true);
});
  