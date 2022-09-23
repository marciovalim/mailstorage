import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { Environment } from '../../core/Environment';
import { AppError } from '../../errors/AppError';

Environment.assertInitialized();
const limiter = new RateLimiterMemory({
	points: Environment.vars.RATE_LIMITER_POINTS,
	duration: Environment.vars.RATE_LIMITER_DURATION,
});

export async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		await limiter.consume(req.ip);
		next();
	} catch (err) {
		throw new AppError(429, 'Too many requests');
	}
}
