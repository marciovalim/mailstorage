import request from 'supertest';

import { find } from '../core/DependencyInjection';
import { Environment } from '../core/Environment';
import { UsersRepository, usersRepositoryAlias } from '../modules/users/repositories/UsersRepository';
import { RandomProvider, randomProviderAlias } from '../providers/random/RandomProvider';
import { StorageProvider, storageProviderAlias } from '../providers/storage/StorageProvider';
import { app } from '../server/app';
import { UserTestUtils } from './utils/UserTestUtils';

const route = (id: string) => `/users/files/${id}`;

describe('Delete User File Delete', () => {
	Environment.assertInitialized();
	const email = Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;

	let bearerHeader: string;
	beforeAll(async () => {
		await UserTestUtils.initTesting();
		bearerHeader = await UserTestUtils.getBearerToken(email);
	});

	describe('Schema', () => {
		it('should return 401 if file id is not authorized', async () => {
			const response = await request(app).delete(route('id'));
			expect(response.status).toBe(401);
		});
	});

	describe('Logic', () => {
		it('should return 404 if file is not found', async () => {
			const randomProvider = find<RandomProvider>(randomProviderAlias);
			const randomFileId = randomProvider.string(10, 'alpha');

			const response = await request(app).delete(route(randomFileId)).set('Authorization', bearerHeader);
			expect(response.status).toBe(404);
		});

		it('should return 204 if file is deleted', async () => {
			const uploadRes = await UserTestUtils.makeUploadUserFileReq(bearerHeader);
			const usersRepoSpy = jest.spyOn(find<UsersRepository>(usersRepositoryAlias), 'deleteFile');
			const storageProviderSpy = jest.spyOn(find<StorageProvider>(storageProviderAlias), 'deleteFile');

			const fileLink = uploadRes.body.link;
			const response = await UserTestUtils.makeDeleteFileReq(bearerHeader, fileLink);

			expect(response.status).toBe(204);
			expect(usersRepoSpy).toBeCalledTimes(1);
			expect(usersRepoSpy).toBeCalledWith(email, expect.objectContaining({ link: fileLink }));
			expect(storageProviderSpy).toBeCalledTimes(1);
			expect(storageProviderSpy).toBeCalledWith(fileLink);
		});
	});

	afterAll(async () => {
		await UserTestUtils.clearUserBytes(bearerHeader, email);
		await UserTestUtils.finishTesting();
	});
});
