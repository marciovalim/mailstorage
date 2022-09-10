import request from 'supertest';

import { app } from '../server/app';

describe('Request User Access Integration', () => {
	it('should send email and save code', async () => {
		const response = await request(app).post('/users/access/request').send({
			email: 'test@example.com',
		});

		expect(response.status).toBe(204);
		// expect had created user
		// expect had sent email
	});
});
