import request from 'supertest';

import { Environment } from '../core/Environment';
import { app } from '../server/app';

describe('Request User Access Integration', () => {
	it('should send email and save code', async () => {
		const response = await request(app).post('/users/access/request').send({
			email: Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT,
		});

		expect(response.status).toBe(204);
	});
});
