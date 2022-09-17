import request from 'supertest';
import { container } from 'tsyringe';

import { Environment } from '../core/Environment';
import { RedisProvider, redisProviderAlias } from '../providers/redis/RedisProvider';
import { app } from '../server/app';
import { UserTestUtils } from './utils/UserTestUtils';

describe('Request User Access Integration', () => {
	beforeAll(async () => {
		await UserTestUtils.initDatabase();
	});

	const email = Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;
	const redisProvider = container.resolve<RedisProvider>(redisProviderAlias);

	it('should send email and save code', async () => {
		await redisProvider.clearKeysContaining(email);
		const response = await request(app).post('/users/access/request').send({ email });
		expect(response.status).toBe(204);
	});

	afterAll(async () => {
		await UserTestUtils.closeDatabase();
	});
});
