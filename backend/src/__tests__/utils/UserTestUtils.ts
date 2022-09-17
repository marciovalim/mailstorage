import request from 'supertest';
import { container } from 'tsyringe';

import { redisProvider, fileManager } from '../../core/DependencyInjection';
import { Environment } from '../../core/Environment';
import { User, VerificationCode } from '../../modules/users/entities/User';
import { UsersRepository, usersRepositoryAlias } from '../../modules/users/repositories/UsersRepository';
import { app } from '../../server/app';

export class UserTestUtils {
	static readonly testFilePath = 'src/__tests__/assets/file.txt';

	static async initDatabase() {
		await redisProvider.open();
	}

	static async closeDatabase() {
		await redisProvider.close();
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

	static async clearUserBytes(email: string) {
		const usersRepo = container.resolve<UsersRepository>(usersRepositoryAlias);
		const user = await usersRepo.findByEmail(email);
		const promises = user.files.map((file) => usersRepo.deleteFile(email, file));
		await Promise.all(promises);
	}

	static async fillUserBytes(bearerHeader: string) {
		const bytesPerUser = Environment.vars.BYTES_LIMIT_PER_USER;
		const bytesPerFile = Environment.vars.BYTES_LIMIT_PER_FILE;
		const filesToUpload = Math.floor(bytesPerUser / bytesPerFile);

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

	static async findUser(email: string): Promise<User> {
		return container.resolve<UsersRepository>(usersRepositoryAlias).findByEmail(email);
	}
}
