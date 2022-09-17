import request from 'supertest';

import { fileManager } from '../core/DependencyInjection';
import { Environment } from '../core/Environment';
import { FileManagerFs } from '../providers/file-manager/implementations/FileManagerFs';
import { app } from '../server/app';
import { UserTestUtils } from './utils/UserTestUtils';

const route = '/users/files';

describe('Upload User File POST', () => {
	Environment.assertInitialized();
	const email = Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;

	let bearerHeader: string;
	beforeAll(async () => {
		await UserTestUtils.initDatabase();
		bearerHeader = await UserTestUtils.getBearerToken(email);
	});

	describe('Schema', () => {
		it('should return 401 if auth token is not provided', async () => {
			const res = await request(app).post(route).send();
			expect(res.status).toBe(401);
		});

		it('should return 400 if file is not provided', async () => {
			const res = await request(app).post(route)
				.set('Authorization', bearerHeader).send();

			expect(res.status).toBe(400);
		});
	});

	describe('Logic', () => {
		it('should return 403 if user has reached the limit of bytes', async () => {
			await UserTestUtils.clearUserBytes(email);
			await UserTestUtils.fillUserBytesWith(bearerHeader, UserTestUtils.bigFilePath);

			const res = await UserTestUtils.makeUploadUserFileReq(bearerHeader, UserTestUtils.bigFilePath);

			expect(res.status).toBe(403);
			expect(res.body.reason).toBe('BYTES_LIMIT_REACHED');
		});

		it('should return 400 if file is too big', async () => {
			await UserTestUtils.clearUserBytes(email);

			jest.mock('../providers/file-manager/implementations/FileManagerFs.ts', () => {
				return jest.fn().mockImplementation(() => {
					return {
						getByteSize: () => {
							console.log('mocked getByteSize');
							return Environment.vars.BYTES_LIMIT_PER_USER + 1;
						},
						read: () => {
							return 'content';
						},
					};
				});
			});

			const fileManagerFs = new FileManagerFs();
			fileManagerFs.getByteSize('any path');

			const res = await UserTestUtils.makeUploadUserFileReq(bearerHeader, UserTestUtils.tooBigFilePath);

			expect(res.status).toBe(400);
			expect(res.body.reason).toBe('FILE_TOO_BIG');
		});

		it('should save file', async () => {
			await UserTestUtils.clearUserBytes(email);

			const res = await UserTestUtils.makeUploadUserFileReq(bearerHeader);
			expect(res.status).toBe(200);

			const user = await UserTestUtils.findUser(email);
			expect(user.files).toHaveLength(1);
		});

		it('it should not keep local temp file', async () => {
			const tempFolder = Environment.vars.TEMP_FOLDER;
			const filesCountBefore = await fileManager.countFiles(tempFolder);

			await UserTestUtils.clearUserBytes(email);

			const res = await UserTestUtils.makeUploadUserFileReq(bearerHeader);
			expect(res.status).toBe(200);

			const filesCountAfter = await fileManager.countFiles(tempFolder);
			expect(filesCountAfter).toBe(filesCountBefore);
		});
	});

	afterAll(async () => {
		await UserTestUtils.closeDatabase();
	});
});
