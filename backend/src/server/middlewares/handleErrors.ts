import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';

import { Validator } from '../../core/Validator';
import { AppError } from '../../errors/AppError';

export async function handleErrors(err: Error, req: Request, res: Response, next: NextFunction): Promise<Response> {
	if (err instanceof AppError) {
		return res.status(err.statusCode)
			.json({ message: err.message, ...err.payload });
	}

	if (err instanceof ValidationError) {
		const errors = await Validator.formatYupErrors(err);
		return res.status(400).json(errors);
	}

	console.error(err);

	return res.status(500).json({
		status: 'error',
		message: 'Internal server error',
	});
}
