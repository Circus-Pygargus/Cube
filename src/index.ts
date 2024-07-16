import express, { Express, Request, Response } from 'express';
import dbConnect from './db/mongoose';

const app: Express = express();

const hostname: string = '127.0.0.1';

const port = 3000;

dbConnect();

// homepage
app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Cube !</h1>');
});

// launch server
app.listen(port, hostname, () => {
    console.log(`Serveur is up at ${hostname}:${port}`);
});
