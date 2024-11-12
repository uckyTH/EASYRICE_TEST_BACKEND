import mongoose from "mongoose";
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ MongoDB URI is not defined in the environment variables.");
  process.exit(1);
}
const connectDB = async () => {
  try {
    const dbName = "riceInspectionDB";
    await mongoose.connect(uri, { dbName });

    console.log("✅ MongoDB connected");
    await mongoose.connect(uri, { dbName });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
