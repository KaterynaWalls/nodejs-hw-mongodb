import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoDB = async () => {
    try {
        const user = getEnvVar('MONGODB_USER');
        const password = encodeURIComponent(getEnvVar('MONGODB_PASSWORD'));
        const url = getEnvVar('MONGODB_URL');
        const db = getEnvVar('MONGODB_DB');
        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`);
    console.log("Mango connection successfully established!");
        } catch(error){
            console.log("Error connecting to MongoDB", error.message);
            throw error;
        }

};