import express from 'express';

import { appRouter } from './routes/router';

const app = express();

app.use(express.json());
app.use(appRouter);

export { app };
