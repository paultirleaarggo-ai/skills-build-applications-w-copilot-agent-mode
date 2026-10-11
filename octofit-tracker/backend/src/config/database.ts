import mongoose from 'mongoose';

const connectionString =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(connectionString, { dbName: 'octofit_db' });
  console.log('Connected to octofit_db');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export default mongoose.connection;
