import { inject, injectable } from 'tsyringe';

import { UseCase } from '../../../core/UseCase';
import { DateProvider, dateProviderAlias } from '../../../providers/date/DateProvider';
import { jwtProviderAlias, JwtProvider } from '../../../providers/jwt/JwtProvider';
import { usersRepositoryAlias, UsersRepository } from '../repositories/UsersRepository';

export type ConfirmUserAccessReq = {
	email: string;
	code: string;
};

export type ConfirmUserAccessRes = {
	result: 'SUCCESS' | 'INVALID_CODE';
	token?: string;
	exp?: number;
}

@injectable()
export class ConfirmUserAccessUseCase implements UseCase<ConfirmUserAccessReq, ConfirmUserAccessRes> {
	constructor(
    @inject(usersRepositoryAlias)
		private usersRepository: UsersRepository,

    @inject(jwtProviderAlias)
		private jwtProvider: JwtProvider,
	) {}

	async execute(input: ConfirmUserAccessReq): Promise<ConfirmUserAccessRes> {
		const user = await this.usersRepository.findByEmail(input.email);

		const verificationCode = user.verificationCodes.find((v) => v?.code === input.code);
		if (!verificationCode) {
			return { result: 'INVALID_CODE' };
		}

		const { token, exp } = await this.jwtProvider.generate({ subject: user.email });
		return { result: 'SUCCESS', token, exp };
	}
}
