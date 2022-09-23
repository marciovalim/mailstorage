import 'express-async-errors';
import express from 'express';

import { handleErrors } from './middlewares/handleErrors';
import { rateLimiter } from './middlewares/rateLimiter';
import { appRouter } from './routes/router';

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(appRouter);
app.use(handleErrors);

export { app };
