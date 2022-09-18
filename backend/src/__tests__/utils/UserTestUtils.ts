import request from 'supertest';
import { container } from 'tsyringe';

import { find } from '../../core/DependencyInjection';
import { Environment } from '../../core/Environment';
import { User, VerificationCode } from '../../modules/users/entities/User';
import { UsersRepository, usersRepositoryAlias } from '../../modules/users/repositories/UsersRepository';
import { FileManager, fileManagerAlias } from '../../providers/file-manager/FileManager';
import { RedisProvider, redisProviderAlias } from '../../providers/redis/RedisProvider';
import { app } from '../../server/app';

export class UserTestUtils {
	static readonly testFilePath = 'src/__tests__/assets/file.txt';

	static async wait(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	static async initTesting() {
		await container.resolve<RedisProvider>(redisProviderAlias).open();
	}

	static async finishTesting(email?: string) {
		await this.hardDeleteUser(email ?? Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT);
		await container.resolve<RedisProvider>(redisProviderAlias).close();
	}

	static async hardDeleteUser(email: string) {
		await find<RedisProvider>(redisProviderAlias).clearKeysContaining(email);
	}

	static async getBearerToken(email: string): Promise<string> {
		const code = await UserTestUtils.getRequestUserAccessCode(email);
		const response = await request(app).post('/users/access/confirm').send({ email, code });
		return `Bearer ${response.body.token}`;
	}

	static async getRequestUserAccessCode(email: string): Promise<string> {
		await request(app).post('/users/access/request').send({ email });

		const usersRepo = container.resolve<UsersRepository>(usersRepositoryAlias);
		const user = await usersRepo.findByEmail(email);

		const codes = user.verificationCodes.filter((v) => v !== undefined) as VerificationCode[];
		const lastCode = codes.reduce((prev, curr) => {
			return prev.secondsToLive > curr.secondsToLive ? prev : curr;
		});
		return lastCode.code;
	}

	static async clearUserBytes(bearerHeader: string, email: string) {
		const usersRepo = container.resolve<UsersRepository>(usersRepositoryAlias);
		const user = await usersRepo.findByEmail(email);
		const promises = user.files.map((file) => UserTestUtils.makeDeleteFileReq(bearerHeader, file.link));
		await Promise.all(promises);
	}

	static async fillUserBytes(bearerHeader: string) {
		const bytesPerUser = Environment.vars.BYTES_LIMIT_PER_USER;
		const bytesPerFile = Environment.vars.BYTES_LIMIT_PER_FILE;
		const filesToUpload = Math.floor(bytesPerUser / bytesPerFile);

		const fileManager = container.resolve<FileManager>(fileManagerAlias);
		const mock = jest.spyOn(fileManager, 'getByteSize').mockResolvedValue(bytesPerFile);

		const promises = Array.from({ length: filesToUpload }, () => this.makeUploadUserFileReq(bearerHeader));
		await Promise.all(promises);

		mock.mockRestore();
	}

	static async makeUploadUserFileReq(authHeader: string, filePath?: string) {
		return request(app).post('/users/files')
			.set({ Authorization: authHeader })
			.field('name', 'test-file')
			.attach('file', filePath ?? this.testFilePath);
	}

	static async makeDeleteFileReq(bearerHeader: string, fileLink: string) {
		const route = (id: string) => `/users/files/${id}`;
		const fileId = encodeURIComponent(fileLink.split('amazonaws.com').pop() ?? '');
		return request(app).delete(route(fileId)).set('Authorization', bearerHeader);
	}

	static async findUser(email: string): Promise<User> {
		return container.resolve<UsersRepository>(usersRepositoryAlias).findByEmail(email);
	}
}
