import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import dbManager from './db/databaseManager';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();

// hbs module so we can use partial templates
const hbs: any = require('hbs');

const hostname: string = '127.0.0.1';

const port = 3000;

/* Define paths for express config */
// build the public path from absolute path
const publicDirectoryPath: string = path.join(__dirname, '../public');
// views directory
const viewsPath: string = path.join(__dirname, '../templates/views');
// partials templates location
const partialPath: string = path.join(__dirname, '../templates/partials');

/* Setup handlebars engine and views location */
// Tell express we're gonna use hbs as a template engine
app.set('view engine', 'hbs');
// Tell express we have moved the views directory
app.set('views', viewsPath);
// Tell hbs we're gonna use some partial templates
hbs.registerPartials(partialPath);

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


    // 404 Error page, !! this must be the very last route
    app.get('*', (req, res) => {
        res.render('404', {
            title: 'Cube',
            message404: 'Page non trouvée !'
        });
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
