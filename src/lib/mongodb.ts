import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
if (!uri) throw new Error("MONGODB_URI is not set in environment variables");

// In development, preserve the connection across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoDb: Db | undefined;
}

const OPTIONS = { serverSelectionTimeoutMS: 5000, family: 4 };

export async function getDb(): Promise<Db> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoDb) {
      const client = new MongoClient(uri, OPTIONS);
      await client.connect();
      global._mongoClient = client;
      global._mongoDb = client.db();
    }
    return global._mongoDb;
  }

  // Production: new client per cold start (serverless-friendly)
  const client = new MongoClient(uri, OPTIONS);
  await client.connect();
  return client.db();
}
