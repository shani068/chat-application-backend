import mongoose from "mongoose";
import { DB_NAME } from "../contants";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {writeConcern: {w: "majority"}, retryWrites: true, authMechanism: "DEFAULT"});
        console.log(`MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error !!", error);
        process.exit(1);
    }
}


export default connectDB;