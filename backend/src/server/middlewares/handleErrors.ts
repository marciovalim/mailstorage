import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';

import { Validator } from '../../core/Validator';
import { AppError } from '../../errors/AppError';

export async function handleErrors(err: Error, req: Request, res: Response, next: NextFunction): Promise<Response> {
	if (err instanceof AppError) {
		const data = { ...err.payload } as { [key: string]: string };
		if (err.reason) {
			data.reason = err.reason;
		}

		res.status(err.statusCode);
		return Object.keys(data).length === 0 ? res.send() : res.json(data);
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
