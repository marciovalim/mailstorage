import { EmailProvider, SendMailDTO } from '../EmailProvider';

export class EmailProviderFake implements EmailProvider {
	sendMail(data: SendMailDTO): Promise<void> {
		return Promise.resolve();
	}
}
