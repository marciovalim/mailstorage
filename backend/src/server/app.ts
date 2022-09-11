import 'express-async-errors';
import express from 'express';

import { DependencyInjection } from '../core/DependencyInjection';
import { handleErrors } from './middlewares/handleErrors';
import { appRouter } from './routes/router';

DependencyInjection.assertInitialized();

const app = express();

app.use(express.json());
app.use(appRouter);
app.use(handleErrors);

export { app };
