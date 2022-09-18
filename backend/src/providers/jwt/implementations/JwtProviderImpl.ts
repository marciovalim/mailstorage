import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { DateProvider, dateProviderAlias } from '../../date/DateProvider';
import { JwtProvider, JwtInput, JwtResponse } from '../JwtProvider';

@injectable()
export class JwtProviderImpl implements JwtProvider {
	constructor(
    @inject(dateProviderAlias)
    private dateProvider: DateProvider,
	) {}

	public async generate(input: JwtInput): Promise<JwtResponse> {
		const exp = this.dateProvider.nowPlusHours(Environment.vars.JWT_EXP_IN_HOURS).inSeconds;
		const token = jwt.sign({ exp }, Environment.vars.JWT_SECRET, { subject: input.subject });
		return { token, exp };
	}

	public async verify(token: string): Promise<object | null> {
		try {
			return jwt.verify(token, Environment.vars.JWT_SECRET) as object;
		} catch (e) {
			return null;
		}
	}
}
