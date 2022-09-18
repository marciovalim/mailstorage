import request from 'supertest';

import { Environment } from '../core/Environment';
import { app } from '../server/app';
import { UserTestUtils } from './utils/UserTestUtils';

const route = '/users';

describe('Get User POST', () => {
	describe('Schema', () => {
		it('should return 401 if user is not authenticated', async () => {
			const response = await request(app).get(route).send();
			expect(response.status).toBe(401);
		});
	});

	describe('Logic', () => {
		const email = Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;
		let bearerHeader: string;

		beforeAll(async () => {
			await UserTestUtils.initTesting();
			bearerHeader = await UserTestUtils.getBearerToken(email);
		});

		it('should return user data', async () => {
			const response = await request(app).get('/users').set({ Authorization: bearerHeader });
			expect(response.status).toBe(200);
		});

		afterAll(async () => {
			await UserTestUtils.finishTesting();
		});
	});
});
