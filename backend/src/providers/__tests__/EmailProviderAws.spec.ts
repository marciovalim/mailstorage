import { Environment } from '../../core/Environment';
import { EmailProviderAws } from '../email/implementations/EmailProviderAws';

describe('EmailProviderAws', () => {
	const emailProvider = new EmailProviderAws();

	it('should send an email', async () => {
		await emailProvider.sendMail({
			from: {
				email: Environment.vars.MAIL_FROM,
			},
			to: {
				email: Environment.vars.AWS_VERIFIED_MAIL_RECIPIENT,
			},
			subject: 'Test email',
			html: 'Test email body',
		});
	});
});
