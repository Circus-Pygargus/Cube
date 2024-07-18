import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import dbManager from './db/databaseManager';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();

const hostname: string = '127.0.0.1';

const port = 3000;

(async () => {
    await dbManager.connect();

    // homepage
    app.get('/', (req: Request, res: Response) => {
        res.send('<h1>Cube !</h1>');
    });

    // launch server
    const server = app.listen(port, hostname, () => {
        console.log(`Serveur is up at ${hostname}:${port}`);
    });

    // Gestion des signaux de terminaison
    process.on('SIGINT', async () => {
        console.log('Signal SIGINT reçu : fermeture du serveur');
        server.close(async () => {
            await dbManager.disconnect();
            process.exit(0); // Exit process with success
        });
    });

    process.on('SIGTERM', async () => {
        console.log('Signal SIGTERM reçu : fermeture du serveur');
        server.close(async () => {
            await dbManager.disconnect();
            process.exit(0); // Exit process with success
        });
    });

    process.on('uncaughtException', async (err) => {
        console.error('Exception non capturée :', err);
        await dbManager.disconnect(); // Déconnexion de la base de données
        process.exit(1); // Exit process with failure
    });

    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Rejet non géré :', reason);
        await dbManager.disconnect(); // Déconnexion de la base de données
        process.exit(1); // Exit process with failure
    });
})();
