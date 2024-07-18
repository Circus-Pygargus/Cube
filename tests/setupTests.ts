import mongoose from "mongoose";
import dotenv from 'dotenv';
import dbManager from "../src/db/databaseManager";

dotenv.config()

beforeAll(async () => {
    await dbManager.connect();
}, 10000);

afterAll(async () => {
    await dbManager.disconnect();
}, 10000);
