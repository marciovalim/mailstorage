import 'reflect-metadata';
import { container, InjectionToken } from 'tsyringe';

import { UsersRepositoryRedis } from '../modules/users/repositories/implementations/UsersRepositoryRedis';
import { UsersRepository, usersRepositoryAlias } from '../modules/users/repositories/UsersRepository';
import { DateProvider, dateProviderAlias } from '../providers/date/DateProvider';
import { DateProviderImpl } from '../providers/date/implementations/DateProviderImpl';
import { EmailProvider, emailProviderAlias } from '../providers/email/EmailProvider';
import { EmailProviderAws } from '../providers/email/implementations/EmailProviderAws';
import { EmailProviderFake } from '../providers/email/implementations/EmailProviderFake';
import { FileManager, fileManagerAlias } from '../providers/file-manager/FileManager';
import { FileManagerFs } from '../providers/file-manager/implementations/FileManagerFs';
import { JwtProviderImpl } from '../providers/jwt/implementations/JwtProviderImpl';
import { JwtProvider, jwtProviderAlias } from '../providers/jwt/JwtProvider';
import { RandomProviderImpl } from '../providers/random/implementations/RandomProviderImpl';
import { RandomProvider, randomProviderAlias } from '../providers/random/RandomProvider';
import { RedisProviderImpl } from '../providers/redis/implementations/RedisProviderImpl';
import { RedisProvider, redisProviderAlias } from '../providers/redis/RedisProvider';
import { StorageProviderAws } from '../providers/storage/implementations/StorageProviderAws';
import { StorageProviderLocal } from '../providers/storage/implementations/StorageProviderLocal';
import { StorageProvider, storageProviderAlias } from '../providers/storage/StorageProvider';
import { TemplaterHandleBars } from '../providers/templater/implementations/TemplaterHandleBars';
import { Templater, templaterAlias } from '../providers/templater/Templater';
import { Environment } from './Environment';

export class DependencyInjection {
	private static initialized = false;

	static assertInitialized() {
		if (this.initialized) return;
		Environment.assertInitialized();
		this.initialized = true;

		container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryRedis);
		container.registerSingleton<RandomProvider>(randomProviderAlias, RandomProviderImpl);
		container.registerSingleton<RedisProvider>(redisProviderAlias, RedisProviderImpl);
		container.registerSingleton<FileManager>(fileManagerAlias, FileManagerFs);
		container.registerSingleton<Templater>(templaterAlias, TemplaterHandleBars);
		container.registerSingleton<DateProvider>(dateProviderAlias, DateProviderImpl);
		container.registerSingleton<JwtProvider>(jwtProviderAlias, JwtProviderImpl);

		const mailProviders = {
			aws: EmailProviderAws,
			local: EmailProviderFake,
		};
		container.registerSingleton<EmailProvider>(emailProviderAlias, mailProviders[Environment.vars.MAIL_PROVIDER]);

		const storageProviders = {
			aws: StorageProviderAws,
			local: StorageProviderLocal,
		};
		container.registerSingleton<StorageProvider>(storageProviderAlias, storageProviders[Environment.vars.STORAGE_PROVIDER]);
	}
}

export const find = <T>(token: InjectionToken<T>): T => {
	return container.resolve(token);
};
