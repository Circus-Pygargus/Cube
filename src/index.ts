import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import dbManager from './db/databaseManager';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();

const hostname: string = '127.0.0.1';

const port = 3000;

const shutDown = async (server: any, signal: string) => {
    console.log('Signal SIGTERM reçu : fermeture du serveur');
    server.close(async () => {
        await dbManager.disconnect();
        process.exit(0); // Exit process with success
    });
};

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
    process.on('SIGINT', async () => await shutDown(server, 'SIGINT'));
    process.on('SIGTERM', async () => await shutDown(server, 'SIGTERM'));

    // gestion des erreurs critiques
    process.on('uncaughtException', async (err) => {
        console.error('Exception non capturée :', err);
        await shutDown(server, 'uncaughtException');
    });

    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Rejet non géré :', reason);
        await shutDown(server, 'unhandledRejection');
    });
})();
