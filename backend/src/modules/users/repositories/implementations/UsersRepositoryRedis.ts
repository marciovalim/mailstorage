import { inject } from 'tsyringe';

import { RedisProvider, redisProviderAlias } from '../../../../providers/redis/RedisProvider';
import { User } from '../../entities/User';
import { SaveVerificationDTO, UsersRepository } from '../UsersRepository';

export class UsersRepositoryRedis implements UsersRepository {
	constructor(
    @inject(redisProviderAlias)
		private redisProvider: RedisProvider,
	) {}

	async saveVerification({ email, verification }: SaveVerificationDTO): Promise<void> {
		const key = verification.slot === 1 ? this.code1Key(email) : this.code2Key(email);
		await this.redisProvider.setStr(key, verification.code, verification.secondsToLive);
	}

	async findByEmail(email: string): Promise<User> {
		const emailFiles = await this.redisProvider.getList(this.filesKey(email));
		const emailCode1 = await this.redisProvider.getStr(this.code1Key(email));
		const emailCode2 = await this.redisProvider.getStr(this.code2Key(email));

		const user = new User(email);
		user.files = emailFiles;

		const verification1 = emailCode1 ? { code: emailCode1.value, secondsToLive: emailCode1.secondsToLive } : undefined;
		const verification2 = emailCode2 ? { code: emailCode2.value, secondsToLive: emailCode2.secondsToLive } : undefined;
		user.verificationCodes = [verification1, verification2];

		return user;
	}

	private code1Key = (email: string) => `${email}:code:1`;
	private code2Key = (email: string) => `${email}:code:2`;
	private filesKey = (email: string) => `${email}:files`;
}
