import { Router } from 'express';
import { container } from 'tsyringe';

import { ConfirmUserAccessController } from '../../modules/users/controllers/ConfirmUserAccessController';
import { RequestUserAccessController } from '../../modules/users/controllers/RequestUserAccessController';
import { UploadUserFileController } from '../../modules/users/controllers/UploadUserFileController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { receiveSingleFile } from '../middlewares/receiveSingleFile';

const usersRouter = Router();

usersRouter.post('/access/request', (req, res) => container.resolve(RequestUserAccessController).handle(req, res));
usersRouter.post('/access/confirm', (req, res) => container.resolve(ConfirmUserAccessController).handle(req, res));

usersRouter.post(
	'/files',
	ensureAuthenticated,
	receiveSingleFile,
	(req, res) => container.resolve(UploadUserFileController).handle(req, res),
);

export { usersRouter };
