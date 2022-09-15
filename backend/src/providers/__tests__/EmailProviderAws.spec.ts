import { EmailProviderAws } from '../email/implementations/EmailProviderAws';

describe('EmailProviderAws', () => {
	const emailProvider = new EmailProviderAws();

	it('should send an email', async () => {
		await emailProvider.sendMail({
			to: {
				email: 'marciogsvalim@gmail.com',
			},
			subject: 'Test email',
			body: 'Test email body',
		});
	});
});
