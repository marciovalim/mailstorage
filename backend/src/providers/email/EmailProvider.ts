export type SendMailDTO = {
	from: {
		email: string;
	}
	to: {
		email: string;
	};
	subject: string;
	html: string;
}

export type EmailProvider = {
	sendMail (data: SendMailDTO): Promise<void>;
}

export const emailProviderAlias = 'EmailProvider';
