import mongoose from "mongoose";
import {env} from "./env.js";

export async function connectDB(){
  try{
    await mongoose.connect(env.DATABASE_URI);
    console.log("Database connected");
  }catch(err){
    console.log("Database connection failed. ", err);
    process.exit(1);
  }
}