import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_CONNECTION_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_CONNECTION_URI is not defined in environment variables"
    );
  }

  try {
    await mongoose.connect(uri, {});
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("Unknown error while connecting to MongoDB");
    }
    process.exit(1);
  }
};

export default connectDB;
