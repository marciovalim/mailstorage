import 'reflect-metadata';
import { container } from 'tsyringe';

import { UsersRepositoryInMemory } from '../modules/users/repositories/implementations/UsersRepositoryInMemory';
import { UsersRepository, usersRepositoryAlias } from '../modules/users/repositories/UsersRepository';
import { EmailProvider, emailProviderAlias } from '../providers/email/EmailProvider';
import { EmailProviderAws } from '../providers/email/implementations/EmailProviderAws';
import { EmailProviderFake } from '../providers/email/implementations/EmailProviderFake';
import { RandomProviderImpl } from '../providers/random/implementations/RandomProviderImpl';
import { RandomProvider, randomProviderAlias } from '../providers/random/RandomProvider';
import { RedisProviderImpl } from '../providers/redis/implementations/RedisProviderImpl';
import { RedisProvider, redisProviderAlias } from '../providers/redis/RedisProvider';

export class DependencyInjection {
	private static initialized = false;

	static assertInitialized() {
		if (this.initialized) return;
		this.initialized = true;

		container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryInMemory);
		container.registerSingleton<EmailProvider>(emailProviderAlias, EmailProviderAws);
		container.registerSingleton<RandomProvider>(randomProviderAlias, RandomProviderImpl);
		container.registerSingleton<RedisProvider>(redisProviderAlias, RedisProviderImpl);
	}
}

DependencyInjection.assertInitialized();
export const usersRepository = container.resolve<UsersRepository>(usersRepositoryAlias);
export const emailProvider = container.resolve<EmailProvider>(emailProviderAlias);
export const randomProvider = container.resolve<RandomProvider>(randomProviderAlias);
export const redisProvider = container.resolve<RedisProvider>(redisProviderAlias);
