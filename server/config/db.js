import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri); // No need for deprecated options
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
