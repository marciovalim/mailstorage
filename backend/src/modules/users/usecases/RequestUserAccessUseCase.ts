import { dirname } from 'path';
import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { AppError } from '../../../errors/AppError';
import { EmailProvider, emailProviderAlias } from '../../../providers/email/EmailProvider';
import { fileManagerAlias, FileManager } from '../../../providers/file-manager/FileManager';
import { RandomProvider, randomProviderAlias } from '../../../providers/random/RandomProvider';
import { templaterAlias, Templater } from '../../../providers/templater/Templater';
import { VerificationCode } from '../entities/User';
import { UsersRepository, usersRepositoryAlias } from '../repositories/UsersRepository';

@injectable()
export class RequestUserAccessUseCase {
	private readonly emailVerificationCodeSecondsToLive = 60 * 10;

	constructor(
		@inject(usersRepositoryAlias)
		private usersRepository: UsersRepository,

		@inject(emailProviderAlias)
		private emailProvider: EmailProvider,

		@inject(randomProviderAlias)
		private randomProvider: RandomProvider,

		@inject(fileManagerAlias)
		private fileManager: FileManager,

		@inject(templaterAlias)
		private templater: Templater,
	) {}

	async execute(email: string): Promise<void> {
		const foundUser = await this.usersRepository.findByEmail(email);
		if (!this.findEmptySlot(foundUser.verificationCodes)) {
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

		const isNewUser = foundUser.files.length === 0;
		await this.sendMail(email, code, isNewUser);
	}

	private findEmptySlot(verificationCodes: (VerificationCode | undefined)[]): (1 | 2) | undefined {
		const index = verificationCodes.findIndex((v) => !v);
		return index === -1 ? undefined : (index + 1) as 1 | 2;
	}

	private generateEmailVerificationCode(): string {
		return this.randomProvider.string(6, 'numeric');
	}

	private async sendMail(recipient: string, code: string, isNewUser: boolean): Promise<void> {
		const rawHtml = await this.fileManager.read(`${__dirname}/../../../templates/verification-code.hbs`);
		const templatedHtml = await this.templater.render(rawHtml, {
			welcome: isNewUser ? Environment.vars.MAIL_WELCOME_MSG : Environment.vars.MAIL_WELCOME_BACK_MSG,
			code,
		});

		await this.emailProvider.sendMail({
			from: {
				email: Environment.vars.MAIL_FROM,
			},
			to: {
				email: recipient,
			},
			subject: 'Código de acesso',
			html: templatedHtml,
		});
	}
}
