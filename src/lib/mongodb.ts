'use server'
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) throw new Error('MONGODB_URI is not defined');

let isConnected = false;

const connectDb = async (): Promise<typeof mongoose> => {
   if(isConnected) return mongoose;
   const connection = await mongoose.connect(MONGODB_URI!,{
    bufferCommands: false,
   });
   isConnected = !!connection.connections[0].readyState;
   return connection;

};

export default connectDb;