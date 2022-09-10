import { Router } from 'express';
import { container } from 'tsyringe';

import { RequestUserAccessController } from '../../modules/users/controllers/RequestUserAccessController';

const usersRouter = Router();

usersRouter.post('/access/request', (req, res) => container.resolve(RequestUserAccessController).handle(req, res));

export { usersRouter };
