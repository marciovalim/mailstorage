import { Request, Response, NextFunction } from 'express';

import { AppError } from '../../errors/AppError';

export function handleErrors(err: Error, req: Request, res: Response, next: NextFunction): Response {
	if (err instanceof AppError) {
		return res.status(err.statusCode)
			.json({ message: err.message, ...err.payload });
	}

	return res.status(500).json({
		status: 'error',
		message: 'Internal server error',
	});
}
