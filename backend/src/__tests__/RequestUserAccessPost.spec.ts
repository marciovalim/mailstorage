import request from 'supertest';

import { Environment } from '../core/Environment';
import { app } from '../server/app';
import { UserTestUtils } from './utils/UserTestUtils';

describe('Request User Access Integration', () => {
	beforeAll(async () => {
		await UserTestUtils.initTesting();
	});

	const email = Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;

	it('should send email and save code', async () => {
		await UserTestUtils.hardDeleteUser(email);
		const response = await request(app).post('/users/access/request').send({ email });
		expect(response.status).toBe(204);
	});

	afterAll(async () => {
		await UserTestUtils.finishTesting();
	});
});
