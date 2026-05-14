import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zenbile');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`MongoDB Connection Failed: ${error.message}. Running in Mock Database Mode.`);
    // process.exit(1); // Removed so backend keeps running without docker
  }
};

export default connectDB;
