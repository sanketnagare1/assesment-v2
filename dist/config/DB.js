import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const dbconnect = () => {
    mongoose.connect(process.env.URL)
        .then(() => {
        console.log("Database connected");
    })
        .catch((error) => {
        console.log(error);
        console.log("Error in Database connection");
    });
};
