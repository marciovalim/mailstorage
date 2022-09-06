import { Router } from 'express';

const usersRouter = Router();

usersRouter.post('/access/request', (req, res) => res.status(204).send());

export { usersRouter };
