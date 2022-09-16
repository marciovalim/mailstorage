import 'reflect-metadata';
import { container } from 'tsyringe';

import { UsersRepositoryInMemory } from '../modules/users/repositories/implementations/UsersRepositoryInMemory';
import { UsersRepository, usersRepositoryAlias } from '../modules/users/repositories/UsersRepository';
import { DateProvider, dateProviderAlias } from '../providers/date/DateProvider';
import { DateProviderImpl } from '../providers/date/implementations/DateProviderImpl';
import { EmailProvider, emailProviderAlias } from '../providers/email/EmailProvider';
import { EmailProviderAws } from '../providers/email/implementations/EmailProviderAws';
import { FileManager, fileManagerAlias } from '../providers/file-manager/FileManager';
import { FileManagerFs } from '../providers/file-manager/implementations/FileManagerFs';
import { JwtProviderImpl } from '../providers/jwt/implementations/JwtProviderImpl';
import { JwtProvider, jwtProviderAlias } from '../providers/jwt/JwtProvider';
import { RandomProviderImpl } from '../providers/random/implementations/RandomProviderImpl';
import { RandomProvider, randomProviderAlias } from '../providers/random/RandomProvider';
import { RedisProviderImpl } from '../providers/redis/implementations/RedisProviderImpl';
import { RedisProvider, redisProviderAlias } from '../providers/redis/RedisProvider';
import { TemplaterHandleBars } from '../providers/templater/implementations/TemplaterHandleBars';
import { Templater, templaterAlias } from '../providers/templater/Templater';

export class DependencyInjection {
	private static initialized = false;

	static assertInitialized() {
		if (this.initialized) return;
		this.initialized = true;

		container.registerSingleton<UsersRepository>(usersRepositoryAlias, UsersRepositoryInMemory);
		container.registerSingleton<EmailProvider>(emailProviderAlias, EmailProviderAws);
		container.registerSingleton<RandomProvider>(randomProviderAlias, RandomProviderImpl);
		container.registerSingleton<RedisProvider>(redisProviderAlias, RedisProviderImpl);
		container.registerSingleton<FileManager>(fileManagerAlias, FileManagerFs);
		container.registerSingleton<Templater>(templaterAlias, TemplaterHandleBars);
		container.registerSingleton<DateProvider>(dateProviderAlias, DateProviderImpl);
		container.registerSingleton<JwtProvider>(jwtProviderAlias, JwtProviderImpl);
	}
}

DependencyInjection.assertInitialized();

export const usersRepository = container.resolve<UsersRepository>(usersRepositoryAlias);
export const emailProvider = container.resolve<EmailProvider>(emailProviderAlias);
export const randomProvider = container.resolve<RandomProvider>(randomProviderAlias);
export const redisProvider = container.resolve<RedisProvider>(redisProviderAlias);
export const fileManager = container.resolve<FileManager>(fileManagerAlias);
export const templater = container.resolve<Templater>(templaterAlias);
export const dateProvider = container.resolve<DateProvider>(dateProviderAlias);
export const jwtProvider = container.resolve<JwtProvider>(jwtProviderAlias);
