import mongoose from "mongoose";
import dns from "dns";

// ✅ Force IPv4
dns.setDefaultResultOrder("ipv4first");

// ✅ Set DNS servers manually
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("DB Error");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUrl)
      .then((conn) => conn.connection);
  }

  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;