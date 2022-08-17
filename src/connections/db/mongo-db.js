import mongoose from "mongoose";
import AppConstants from "../../constants/app-constants.js";

export async function connectMongo() {
    try {
        await mongoose.connect(AppConstants.MONGO_DB_URL, {
            dbName: AppConstants.DB_NAME,
        });
        console.log("Connect to mongodb successfully");
    } catch (err) {
        console.error(`Mongodb connection err: ${err}`);
    }
}
