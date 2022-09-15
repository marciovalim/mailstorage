import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { AppError } from '../../../errors/AppError';
import { EmailProvider } from '../../../providers/email/EmailProvider';
import { RandomProvider } from '../../../providers/random/RandomProvider';
import { VerificationCode } from '../entities/User';
import { UsersRepository } from '../repositories/UsersRepository';

@injectable()
export class RequestUserAccessUseCase {
	private readonly emailVerificationCodeSecondsToLive = 60 * 10;

	constructor(
		@inject('UsersRepository')
		private usersRepository: UsersRepository,

		@inject('EmailProvider')
		private emailProvider: EmailProvider,

		@inject('RandomProvider')
		private randomProvider: RandomProvider,
	) {}

	async execute(email: string): Promise<void> {
		const foundUser = await this.usersRepository.findByEmail(email);
		if (foundUser && !this.findEmptySlot(foundUser.verificationCodes)) {
			const minimumWaitTime = Math.min(foundUser.verificationCodes[0]!.secondsToLive, foundUser.verificationCodes[1]!.secondsToLive);
			throw new AppError(405, 'User already has 2 access requests', { minimumWaitTime });
		}

		const slot = this.findEmptySlot(foundUser?.verificationCodes ?? []) ?? 1;
		const code = this.generateEmailVerificationCode();
		const secondsToLive = this.emailVerificationCodeSecondsToLive;

		await this.usersRepository.saveVerification({
			email,
			verification: { code, slot, secondsToLive },
		});

		await this.emailProvider.sendMail({
			from: {
				email: Environment.vars.MAIL_FROM,
			},
			to: {
				email,
			},
			subject: 'Código de acesso',
			body: `O seu código de acesso ao Mailstorage é ${code}`,
		});
	}

	private findEmptySlot(verificationCodes: (VerificationCode | undefined)[]): (1 | 2) | undefined {
		const index = verificationCodes.findIndex((v) => !v);
		return index === -1 ? undefined : (index + 1) as 1 | 2;
	}

	private generateEmailVerificationCode(): string {
		return this.randomProvider.string(6, 'numeric');
	}
}
