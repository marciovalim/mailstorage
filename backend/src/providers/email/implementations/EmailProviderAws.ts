import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';

import { Environment } from '../../../core/Environment';
import { EmailProvider, SendMailDTO } from '../EmailProvider';

export class EmailProviderAws implements EmailProvider {
	private transporter: Transporter;
	private sentCount = 0;

	constructor() {
		this.transporter = createTransport({
			SES: new SES({
				apiVersion: '2010-12-01',
				region: Environment.vars.AWS_REGION,
			}),
		});
	}

	async sendMail(data: SendMailDTO): Promise<void> {
		if (Environment.vars.NODE_ENV === 'test' && this.sentCount > 0) {
			throw new Error('EmailProviderAws should not be used more than once in test environment');
		}

		this.sentCount++;
		await this.transporter.sendMail({
			from: data.from.email,
			to: data.to.email,
			subject: data.subject,
			html: data.html,
		});
	}
}
