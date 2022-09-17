import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { AppError } from '../../errors/AppError';
import { JwtProvider, jwtProviderAlias } from '../../providers/jwt/JwtProvider';

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		throw new AppError(401, null);
	}

	const [, token] = authHeader.split(' ');
	const jwtProvider = container.resolve<JwtProvider>(jwtProviderAlias);

	const payload = await jwtProvider.verify(token);
	if (!payload) {
		throw new AppError(401, null);
	}

	const { sub } = payload as { sub: string };
	req.user = {
		email: sub,
	};

	return next();
}
