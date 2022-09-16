import { Router } from 'express';
import { container } from 'tsyringe';

import { ConfirmUserAccessController } from '../../modules/users/controllers/ConfirmUserAccessController';
import { RequestUserAccessController } from '../../modules/users/controllers/RequestUserAccessController';

const usersRouter = Router();

usersRouter.post('/access/request', (req, res) => container.resolve(RequestUserAccessController).handle(req, res));
usersRouter.post('/access/confirm', (req, res) => container.resolve(ConfirmUserAccessController).handle(req, res));

export { usersRouter };
