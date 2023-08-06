import {} from "dotenv/config";
import mongoose from "mongoose";
 
const url = process.env.MONGODB_CONNECTION_URL;

export const connectToDataBase = async () => {
  try {
    var isconnected = await mongoose.connect(url);
    console.log(`database connected...`); 
  } catch (error) {
    throw error;
  }

  return isconnected;
};
