import { container } from 'tsyringe';

import { RandomProvider, randomProviderAlias } from '../../../../providers/random/RandomProvider';
import { RedisProviderImpl } from '../../../../providers/redis/implementations/RedisProviderImpl';
import { User } from '../../entities/User';
import { UsersRepositoryRedis } from '../implementations/UsersRepositoryRedis';
import { SaveVerificationDTO } from '../UsersRepository';

describe('Users Repository Redis', () => {
	let usersRepository: UsersRepositoryRedis;
	const redisProvider = new RedisProviderImpl();

	beforeAll(async () => {
		await redisProvider.open();
		usersRepository = new UsersRepositoryRedis(redisProvider);
	});

	const randomProvider = container.resolve<RandomProvider>(randomProviderAlias);
	const randomEmail = () => `test-${randomProvider.string(10, 'alpha')}@test.com`;

	const saveVerification = async (slot: 1 | 2): Promise<SaveVerificationDTO> => {
		const saveUserDTO : SaveVerificationDTO = {
			email: randomEmail(),
			verification: {
				code: randomProvider.string(6, 'numeric'),
				slot,
				secondsToLive: 600,
			},
		};

		await usersRepository.saveVerification(saveUserDTO);
		return saveUserDTO;
	};

	describe('saveVerification', () => {
		const assertSaveCodeToSlot = async (slot: 1 | 2) => {
			const saveUserDTO = await saveVerification(slot);

			const timedValue = await redisProvider.getStr(`${saveUserDTO.email}:code:${slot}`);
			expect(timedValue).not.toBeNull();

			expect(timedValue!.value).toEqual(saveUserDTO.verification.code);

			const ttlAbsDiff = Math.abs(saveUserDTO.verification.secondsToLive - timedValue!.secondsToLive);
			expect(ttlAbsDiff).toBeLessThanOrEqual(10);
		};

		it('should save verification code to slot 1', async () => {
			await assertSaveCodeToSlot(1);
		});

		it('should save verification code to slot 2', async () => {
			await assertSaveCodeToSlot(2);
		});
	});

	describe('findByEmail', () => {
		it('should return empty user if email does not exist', async () => {
			const randomEmail = `${randomProvider.string(10, 'alpha')}@example.com`;
			const user = await usersRepository.findByEmail(randomEmail);

			const emptyUser = new User(randomEmail);

			expect(user.email).toEqual(emptyUser.email);
			expect(user.verificationCodes).toEqual(emptyUser.verificationCodes);
			expect(user.files).toEqual(emptyUser.files);
		});

		it('should return user if email exists', async () => {
			const saveVerificationDTO = await saveVerification(1);

			const user = await usersRepository.findByEmail(saveVerificationDTO.email);
			expect(user).not.toBeNull();
			expect(user!.email).toEqual(saveVerificationDTO.email);
			expect(user!.verificationCodes[0]!.code).toEqual(saveVerificationDTO.verification.code);
			expect(user!.verificationCodes[0]!.secondsToLive).toEqual(saveVerificationDTO.verification.secondsToLive);
			expect(user!.files).toHaveLength(0);
		});
	});

	describe('saveFile', () => {
		it('should save file to user', async () => {
			const saveVerificationDTO = await saveVerification(1);

			const userFile = {
				link: randomProvider.string(10, 'alpha'),
				bytes: randomProvider.integer(100, 1000),
			};

			await usersRepository.saveFile(saveVerificationDTO.email, userFile);

			const user = await usersRepository.findByEmail(saveVerificationDTO.email);
			expect(user!.files).toHaveLength(1);
			expect(user!.files[0]).toMatchObject(userFile);
		});
	});

	afterAll(async () => {
		await redisProvider.close();
	});
});
