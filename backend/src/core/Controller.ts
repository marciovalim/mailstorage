import { Request, Response } from 'express';

export type Controller = {
	handle: (req: Request, res: Response) => Promise<Response>;
}
