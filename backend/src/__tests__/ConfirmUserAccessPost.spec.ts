import request from 'supertest';
import { container } from 'tsyringe';

import { Environment } from '../core/Environment';
import { VerificationCode } from '../modules/users/entities/User';
import { UsersRepository, usersRepositoryAlias } from '../modules/users/repositories/UsersRepository';
import { app } from '../server/app';

const route = '/users/access/confirm';

describe('Confirm User Acccess POST', () => {
	const createConfirmUserAccessReq = async (email: string, code: string) => {
		return request(app).post(route)
			.send({
				email,
				code,
			});
	};

	const getRequestUserAccessCode = async (email: string): Promise<string> => {
		await request(app).post('/users/access/request').send({ email });

		const usersRepo = container.resolve<UsersRepository>(usersRepositoryAlias);
		const user = await usersRepo.findByEmail(email);

		const codes = user.verificationCodes.filter((v) => v !== undefined) as VerificationCode[];
		const lastCode = codes.reduce((prev, curr) => {
			return prev.secondsToLive > curr.secondsToLive ? prev : curr;
		});
		return lastCode.code;
	};

	beforeAll(async () => {
		await Environment.assertInitialized();
	});

	describe('Schema', () => {
		it('should return 400 if email is not provided', async () => {
			const response = await request(app).post(route).send({
				code: '123456',
			});

			expect(response.status).toBe(400);
			expect(response.body.email).toBeTruthy();
		});

		it('should return 400 if code is not provided', async () => {
			const response = await request(app).post(route).send({
				email: 'test@example.com',
			});

			expect(response.status).toBe(400);
			expect(response.body.code).toBeTruthy();
		});

		it('should not ask for parameters if all parameters are provided', async () => {
			const response = await request(app).post(route).send({
				email: 'test@example.com',
				code: '123456',
			});

			expect(response.body.code).toBeFalsy();
			expect(response.body.email).toBeFalsy();
		});
	});

	describe('Logic', () => {
		const verifiedRecipient = () => Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT;

		it('should return 400 if code is invalid', async () => {
			const realCode = await getRequestUserAccessCode(verifiedRecipient());
			const fakeCode = `${realCode.split('').reverse().join('')}123`;

			const response = await createConfirmUserAccessReq(verifiedRecipient(), fakeCode);

			expect(response.status).toBe(400);
			expect(response.body.result).toBe('INVALID_CODE');
		});

		it('should return JWT token if code is valid', async () => {
			const realCode = await getRequestUserAccessCode(verifiedRecipient());

			const response = await createConfirmUserAccessReq(verifiedRecipient(), realCode);

			expect(response.status).toBe(200);
			expect(response.body.result).toBe('SUCCESS');
			expect(response.body.token).toEqual(expect.any(String));
			expect(response.body.exp).toEqual(expect.any(Number));
		});
	});
});
