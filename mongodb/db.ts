import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.sgap2r1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

if (!connectionString) {
  throw new Error("Please provide a connection string");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
