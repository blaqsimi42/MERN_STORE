import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host} successfully💡✅`);
  } catch (err) {
    console.error(`MongoDB failed to connect: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
