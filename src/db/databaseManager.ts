import mongoose from "mongoose";
import dotenv from 'dotenv';

// load environment variables
dotenv.config();

const dbName = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME;
if (dbName === undefined || dbName === '') {
    console.error('La connexion à la base de données n\'a pas pu être établie. Vous devez renseigner les clés DB_NAME et TEST_DB_NAME dans le fichier d\'environnement .env !');
    process.exit(1); // exit process with failure
}

const connect = async (): Promise<void> => {
    const MONGODB_URI: string = `mongodb://127.0.0.1:27017/${dbName}`;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connexion à la base de données "${dbName}" réussie.`);
    } catch (err) {
        console.log('Erreur lors de la connexion à MongoDB : ', err);
        process.exit(1); // exit process with failure
    }
};

const disconnect = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log(`Déconnexion de la base de données "${dbName}" réussie.`);
    } catch (err) {
        console.error('Erreur pendant la déconnection de MongoDB : ', err);
        process.exit(1);
    }
};

export default { connect, disconnect };
