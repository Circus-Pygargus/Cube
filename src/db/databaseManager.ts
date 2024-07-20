import mongoose from "mongoose";

class DatabaseManager {
    private static instance: DatabaseManager;
    private connection: mongoose.Connection | null = null;

    private constructor() {}

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }

        return DatabaseManager.instance;
    }

    public async connect(): Promise<void> {
        if (this.connection) return;

        const dbName = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME;
        const MONGODB_URI: string = `mongodb://127.0.0.1:27017/${dbName}`;

        try {
            await mongoose.connect(MONGODB_URI);
            this.connection = mongoose.connection;
            if ( process.env.NODE_ENV !== 'test') {
                console.log(`Connexion à la base de données "${dbName}" réussie.`);
            }
        } catch (err) {
            console.log('Erreur lors de la connexion à MongoDB : ', err);
            process.exit(1); // exit process with failure
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.connection) return;

        try {
            await mongoose.connection.close();
            this.connection = null;
            if ( process.env.NODE_ENV !== 'test') {
                console.log(`Déconnexion de la base de données réussie.`);
            }
        } catch (err) {
            console.error('Erreur pendant la déconnexion de MongoDB : ', err);
            process.exit(1);
        }
    }

    public getConnectionState(): number | null {
        return this.connection ? this.connection.readyState : null;
    }
}

export default DatabaseManager.getInstance();
