import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { AppError } from '../../../errors/AppError';
import { DateProvider, dateProviderAlias } from '../../date/DateProvider';
import { JwtProvider, JwtInput, JwtResponse } from '../JwtProvider';

@injectable()
export class JwtProviderImpl implements JwtProvider {
	constructor(
    @inject(dateProviderAlias)
    private dateProvider: DateProvider,
	) {}

	public async generate(input: JwtInput): Promise<JwtResponse> {
		const exp = this.dateProvider.oneFromNowInMilliseconds();
		const token = jwt.sign({ exp }, Environment.vars.JWT_SECRET, { subject: input.subject });
		return { token, exp };
	}

	public async verify(token: string): Promise<object> {
		try {
			return jwt.verify(token, Environment.vars.JWT_SECRET) as object;
		} catch (e) {
			throw new AppError(401, 'UNAUTHORIZED');
		}
	}
}
