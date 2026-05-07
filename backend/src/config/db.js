import mongoose from "mongoose";

const DEFAULT_LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/civicmitra";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || DEFAULT_LOCAL_MONGO_URI;

    if (!process.env.MONGO_URI) {
      console.warn(`MONGO_URI missing. Using local MongoDB: ${DEFAULT_LOCAL_MONGO_URI}`);
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("DB error", error);
    process.exit(1);
  }
};

export default connectDB;
