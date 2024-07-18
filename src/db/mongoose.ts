import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME;

// here cube is the name of the database
const MONGODB_URI: string = `mongodb://127.0.0.1:27017/${dbName}`;

const dbConnect = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connexion à la base de données réussie.');
    } catch (err) {
        console.log('Erreur lors de la connexion à MOngoDB : ', err);
        process.exit(1); // exit process with failure
    }
};

export default dbConnect;
