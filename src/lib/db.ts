import mongoose from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: Cached | undefined;
}

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error(
    "Please define the DB_URI environment variable inside .env.local"
  );
}

let cached: Cached = (global as any).mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "acadmate",
      autoIndex: true,
    };

    cached.promise = mongoose.connect(DB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
