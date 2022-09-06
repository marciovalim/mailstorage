import { Router } from 'express';

import { usersRouter } from './users.routes';

const appRouter = Router();

appRouter.use('/users', usersRouter);

export { appRouter };
