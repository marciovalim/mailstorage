import { SES } from 'aws-sdk';
import { createTransport, Transporter } from 'nodemailer';

import { Environment } from '../../../core/Environment';
import { EmailProvider, SendMailDTO } from '../EmailProvider';

export class EmailProviderAws implements EmailProvider {
	private transporter: Transporter;

	constructor() {
		this.init();
	}

	private async init() {
		await Environment.assertInitialized();
		this.transporter = createTransport({
			SES: new SES({
				apiVersion: '2010-12-01',
				region: Environment.vars.AWS_REGION,
			}),
		});
	}

	async sendMail(data: SendMailDTO): Promise<void> {
		await this.transporter.sendMail({
			from: data.from.email,
			to: data.to.email,
			subject: data.subject,
			html: data.html,
		});
	}
}
