import mongoose from "mongoose";
import dotenv from 'dotenv';
import dbConnect from "../src/db/mongoose";

dotenv.config()

beforeAll(async () => {
    await dbConnect();
}, 10000);

afterAll(async () => {
    await mongoose.connection.close();
}, 10000);
