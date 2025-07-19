import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const connectDB = async (req,res) => {
    const connect = await mongoose.connect(process.env.MONGO_URI)
}
console.log("MongoDB connected successfully");
export default connectDB;