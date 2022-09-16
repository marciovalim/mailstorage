import { Environment } from '../../../../core/Environment';
import { AppError } from '../../../../errors/AppError';
import { EmailProvider } from '../../../../providers/email/EmailProvider';
import { EmailProviderFake } from '../../../../providers/email/implementations/EmailProviderFake';
import { FileManager } from '../../../../providers/file-manager/FileManager';
import { FileManagerFs } from '../../../../providers/file-manager/implementations/FileManagerFs';
import { RandomProviderImpl } from '../../../../providers/random/implementations/RandomProviderImpl';
import { RandomProvider } from '../../../../providers/random/RandomProvider';
import { TemplaterHandleBars } from '../../../../providers/templater/implementations/TemplaterHandleBars';
import { Templater } from '../../../../providers/templater/Templater';
import { UsersRepositoryInMemory } from '../../repositories/implementations/UsersRepositoryInMemory';
import { RequestUserAccessUseCase } from '../RequestUserAccessUseCase';

let usersRepository: UsersRepositoryInMemory;
let emailProvider: EmailProvider;
let randomProvider: RandomProvider;
let requestUserAccessUseCase: RequestUserAccessUseCase;
let fileManager: FileManager;
let templater: Templater;

describe('Request User Access Use Case', () => {
	beforeEach(() => {
		usersRepository = new UsersRepositoryInMemory();
		emailProvider = new EmailProviderFake();
		randomProvider = new RandomProviderImpl();
		fileManager = new FileManagerFs();
		templater = new TemplaterHandleBars();
		requestUserAccessUseCase = new RequestUserAccessUseCase(usersRepository, emailProvider, randomProvider, fileManager, templater);
	});

	it('should send email and save code', async () => {
		const emailSendSpy = jest.spyOn(emailProvider, 'sendMail');

		const email = 'test@example.com';
		await requestUserAccessUseCase.execute(email);

		expect(emailSendSpy).toBeCalledWith(expect.objectContaining({
			to: {
				email,
			},
		}));
		expect(await usersRepository.findByEmail(email)).toMatchObject({
			email,
			verificationCodes: expect.arrayContaining([expect.objectContaining({ code: expect.any(String) })]),
		});
	});

	it('should save code in empty slot', async () => {
		const email = 'test@example.com';
		usersRepository.users.push({
			email,
			verificationCodes: [
				undefined,
				{
					code: '123456',
					secondsToLive: 50,
				},
			],
			files: [],
		});

		await requestUserAccessUseCase.execute(email);

		expect(await usersRepository.findByEmail(email)).toMatchObject({
			email,
			verificationCodes: expect.arrayContaining([
				expect.objectContaining({ code: expect.any(String) }),
				expect.objectContaining({ code: '123456' }),
			]),
		});
	});

	it('should not allow new access request if user already has 2 requests', async () => {
		const email = 'test@example.com';
		await requestUserAccessUseCase.execute(email);
		await requestUserAccessUseCase.execute(email);

		const sendMailSpy = jest.spyOn(emailProvider, 'sendMail');
		const userRepoSpy = jest.spyOn(usersRepository, 'saveVerification');

		expect(async () => {
			await requestUserAccessUseCase.execute(email);
		}).rejects.toMatchObject(new AppError(405, 'User already has 2 access requests'));
		expect(sendMailSpy).not.toBeCalled();
		expect(userRepoSpy).not.toBeCalled();
	});

	it('should send welcome email if is a new user', async () => {
		const email = 'test@example.com';
		const emailSendSpy = jest.spyOn(emailProvider, 'sendMail');

		await requestUserAccessUseCase.execute(email);

		expect(emailSendSpy).toBeCalledWith(expect.objectContaining({
			html: expect.stringContaining(Environment.vars.MAIL_WELCOME_MSG),
		}));

		expect(await usersRepository.findByEmail(email)).toMatchObject({
			email,
			verificationCodes: expect.arrayContaining([expect.objectContaining({ code: expect.any(String) })]),
		});
	});

	it('should send welcome back email if is not a new user', async () => {
		const email = 'test@example.com';
		await requestUserAccessUseCase.execute(email);
		usersRepository.users[0].files = ['file1', 'file2'];

		const emailSendSpy = jest.spyOn(emailProvider, 'sendMail');
		await requestUserAccessUseCase.execute(email);

		expect(emailSendSpy).toBeCalledWith(expect.objectContaining({
			html: expect.stringContaining(Environment.vars.MAIL_WELCOME_BACK_MSG),
		}));

		expect(await usersRepository.findByEmail(email)).toMatchObject({
			email,
			verificationCodes: expect.arrayContaining([expect.objectContaining({ code: expect.any(String) })]),
		});
	});
});
